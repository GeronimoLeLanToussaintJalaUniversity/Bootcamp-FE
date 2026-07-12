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
