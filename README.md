# Duelist Codex

## HU-01 — Ver catálogo de cartas

Al entrar, se pide todo el catálogo a la API y se muestra en un grid con imagen, nombre y tipo de cada carta. Mientras responde la API se muestra un aviso de carga, y si la API falla o no hay resultados, un mensaje explícito en vez de una pantalla en blanco.

### Cómo funciona

- `CardService` (`services/card.ts`) es el único que conoce la URL de la API. Llama a `HttpClient.get()`, y como la respuesta cruda de YGOPRODeck viene envuelta en  `{ data: [...] }` y con un montón de campos que no uso todavía, la transformo con un  `map()` de RxJS a un modelo `Card` simple (`id`, `name`, `type`, `imageUrl`) antes de devolverla. 
- `Catalog` (`catalog/catalog.ts`) es el componente contenedor: tiene tres signals (`cards`, `loading`, `error`) que representan el estado de la pantalla, y en `ngOnInit` le pide los datos al servicio y va actualizando esos signals según la respuesta.
- `CardItem` (`catalog/card-item/`) es un componente sin estado propio: recibe una carta por `input.required<Card>()` y solo la muestra. No sabe nada de la API.
- El template de `Catalog` usa el nuevo control de flujo: `@if` para loading/error, y `@for (...) { } @empty { }` para la grilla — el caso "no hay resultados" lo resuelve el propio `@empty`, sin lógica extra. 

### Decisiones 

- **Signals en vez de BehaviorSubject** para representar el estado de carga y del catálogo. Es más simple de leer, no requiere manejar suscripciones/desuscripciones a mano, y se integra directo con la detección de cambios moderna de Angular.
- **`ngOnInit` para disparar el fetch**, no el constructor: en el constructor el componente todavía no terminó de inicializarse, y `ngOnInit` es justo el punto del ciclo de vida pensado para hacer llamadas a APIs e inicializar datos.
- **Grid simple**, sin sidebar ni layout elaborado cumple el objetivo de HU-01 sin sumar complejidad que no pedía la historia.
- **Sin backend propio**: el `CardService` le pega directo a la API pública de YGOPRODeck desde el front, tal como está definido en el challenge.

## HU-02 — Buscar cartas por nombre

Un campo de búsqueda arriba de la grilla, con foco automático al entrar. A medida que se escribe, la grilla se filtra en tiempo real por nombre (coincidencia parcial, sin importar mayúsculas/minúsculas). Si no hay resultados, se avisa explícitamente qué término no encontró coincidencias.

### Cómo funciona

- `Catalog` suma un signal `searchTerm` (lo que hay escrito en el input) y un `computed` `filteredCards`, que deriva de `cards()` y `searchTerm()`: sin término devuelve todo, con término filtra el catálogo ya cargado con `Array.filter()` + `includes()`. Al ser `computed`, se recalcula solo cuando cambia alguno de esos dos signals.
- El input usa binding simple: `[value]="searchTerm()"` para mostrar el valor actual y `(input)="onSearch($event)"` para reaccionar a cada tecla. `onSearch` extrae `event.target.value` (con un cast a `HTMLInputElement` en TypeScript) y actualiza `searchTerm`.
- El `@for` de la grilla ahora itera `filteredCards()` en vez de `cards()`; el bloque `@empty` distingue si no hay resultados por la búsqueda (muestra el término) o porque no hay cartas cargadas.

### Decisiones

- **Búsqueda en el front, no contra la API**: se filtra sobre las cartas que ya están en memoria (`cards()`), sin disparar una nueva petición HTTP por cada letra escrita.
- **`[value]` + `(input)` en vez de `[(ngModel)]`**: evita agregar `FormsModule` solo para esto.
- **`autofocus` en el input**: cumple el criterio de que el campo quede listo para escribir apenas se entra a la pantalla, sin pasos adicionales.

## HU-03 — Ver detalle de una carta

Al hacer click en una carta se abre un modal con más información: imagen a la izquierda, y a la derecha nombre, tipo, atributo/nivel/ATK-DEF (si aplica, según el tipo de carta) y la descripción. Se cierra con el botón ✕ o haciendo click afuera del modal, y la búsqueda y el catálogo quedan como estaban.

### Cómo funciona

- `Catalog` suma un signal `selectedCard` (`Card | null`). `CardItem` emite un evento `select` con la carta al hacer click, y `Catalog` lo escucha y hace `selectedCard.set(card)`.
- `CardDetail` (`catalog/card-detail/`) es el componente del modal: recibe la carta por `input.required<Card>()` y emite `close` cuando hay que cerrarlo. No sabe nada de la API ni del resto del catálogo.
- El modal se muestra con un `@if (selectedCard(); as card)` en el template de `Catalog`. Cerrar (click en ✕ o en el fondo) dispara `close`, que hace `selectedCard.set(null)`.
- El modelo `Card` se extendió con `desc`, `atk?`, `def?`, `level?` y `attribute?`. Los últimos cuatro son opcionales porque la API solo los devuelve para cartas de tipo Monstruo (las de Magia/Trampa no los traen), así que el template los muestra con `@if` solo cuando existen.

### Decisiones

- **Modal superpuesto en vez de una ruta nueva**: no se usó el Router. Al no navegar a otra pantalla, el estado de búsqueda y el catálogo cargado nunca se pierden — abrir y cerrar el detalle no reinicia nada.
- **Imagen a la izquierda, info a la derecha**: prioriza que la carta se vea grande y clara, con el texto acompañándola sin tener que scrollear para llegar a la imagen.
- **Campos opcionales según tipo de carta**: en vez de asumir que toda carta tiene ATK/DEF/Nivel/Atributo, se muestran solo si vienen en la respuesta de la API, evitando mostrar campos vacíos o `undefined` en cartas de Magia/Trampa.

## HU-04 — Organizar el detalle en secciones

Dentro del modal de detalle, la información se organiza en 3 pestañas: Efecto, Estadísticas y Precio, en vez de un solo bloque de texto.

### Cómo funciona

- `Tabs` (`shared/tabs/`) es un componente genérico que no sabe nada de cartas: recibe `labels` (un array de strings) y expone `activeIndex` como binding de dos vías (`model()`). Solo dibuja los botones de las pestañas y marca cuál está activa.
- `CardDetail` lo usa con `[(activeIndex)]="activeTab"` y un `@switch (activeTab())` que muestra el contenido correspondiente a cada pestaña (Efecto → `desc`, Estadísticas → atributo/nivel/ATK-DEF, Precio → `prices`).
- El modelo `Card` se extendió con `prices?` (tomado de `card_prices`, otro campo real de la API). Si una carta no tiene estadísticas (Magia/Trampa) o no tiene precios cargados, la pestaña muestra un mensaje en vez de quedar vacía.

### Decisiones

- **Pestañas en vez de acordeón**: solo se ve una sección a la vez, lo cual mantiene el modal corto y evita que crezca mucho de alto con las tres secciones abiertas juntas.
- **`Tabs` reutilizable**: no depende de `Card` ni de nada de Yu-Gi-Oh — solo recibe etiquetas y un índice activo. Cualquier otro componente de la app podría usarlo para organizar contenido en pestañas.
- **`model()` para el índice activo**: es el mecanismo de two-way binding de Angular con signals; `CardDetail` mantiene el estado (`activeTab`) y `Tabs` solo lo lee/actualiza, sin duplicar esa información en dos lugares.

## HU-05 — Mantener el estado de búsqueda de forma consistente

No hubo que agregar código nuevo para esta historia: ya quedó resuelta por cómo se armó todo desde HU-01.

### Cómo funciona

- Todo el estado relevante (`cards`, `loading`, `error`, `searchTerm`, `selectedCard`) vive como signals en un solo lugar: `Catalog`. Ningún otro componente (`CardItem`, `CardDetail`, `Tabs`) tiene estado propio — solo reciben datos por `input()` y avisan cosas por `output()`.
- `Catalog` nunca se destruye mientras estás en la pantalla, así que sus signals se mantienen vivos todo el tiempo. `CardDetail` sí se crea y destruye (entra y sale detrás de un `@if`), pero no es dueño de ningún estado de búsqueda, así que no hay nada que perder al abrirlo o cerrarlo.

### Decisiones

- **Una sola herramienta (signals) para todo el estado de búsqueda**, no una mezcla de signals en un lado y variables sueltas en otro.
- **El estado vive en el componente que persiste**, no en los que se crean y destruyen (`CardDetail`): así abrir y cerrar el modal nunca resetea la búsqueda ni el catálogo cargado.

## Posibles mejoras

- Sacar el buscador a su propio componente en vez de tenerlo inline en `Catalog`.
- Reorganizar mejor las carpetas del proyecto.
- No traer todas las cartas de una al inicio: buscar por API con paginación en vez de cargar el catálogo completo.
- Debounce en la búsqueda si en algún momento se pasa a buscar contra la API, para no pegarle en cada tecla.
- Manejar el caso de una carta sin imagen (`card_images` vacío) con un placeholder en vez de dejar el `<img>` roto.
- Tests de componentes: hoy solo existe `card.spec.ts` del service, faltan `Catalog`, `CardItem`, `CardDetail` y `Tabs`.
