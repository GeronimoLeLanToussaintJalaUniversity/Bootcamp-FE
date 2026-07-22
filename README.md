# Duelist Codex

## Challenge 1

### HU-01 — Ver catálogo de cartas

Al entrar, se pide todo el catálogo a la API y se muestra en un grid con imagen, nombre y tipo de cada carta. Mientras responde la API se muestra un aviso de carga, y si la API falla o no hay resultados, un mensaje explícito en vez de una pantalla en blanco.

#### Cómo funciona

- `CardService` (`services/card.ts`) es el único que conoce la URL de la API. Llama a `HttpClient.get()`, y como la respuesta cruda de YGOPRODeck viene envuelta en  `{ data: [...] }` y con un montón de campos que no uso todavía, la transformo con un  `map()` de RxJS a un modelo `Card` simple (`id`, `name`, `type`, `imageUrl`) antes de devolverla. 
- `Catalog` (`catalog/catalog.ts`) es el componente contenedor: tiene tres signals (`cards`, `loading`, `error`) que representan el estado de la pantalla, y en `ngOnInit` le pide los datos al servicio y va actualizando esos signals según la respuesta.
- `CardItem` (`catalog/card-item/`) es un componente sin estado propio: recibe una carta por `input.required<Card>()` y solo la muestra. No sabe nada de la API.
- El template de `Catalog` usa el nuevo control de flujo: `@if` para loading/error, y `@for (...) { } @empty { }` para la grilla — el caso "no hay resultados" lo resuelve el propio `@empty`, sin lógica extra. 

#### Decisiones 

- **Signals en vez de BehaviorSubject** para representar el estado de carga y del catálogo. Es más simple de leer, no requiere manejar suscripciones/desuscripciones a mano, y se integra directo con la detección de cambios moderna de Angular.
- **`ngOnInit` para disparar el fetch**, no el constructor: en el constructor el componente todavía no terminó de inicializarse, y `ngOnInit` es justo el punto del ciclo de vida pensado para hacer llamadas a APIs e inicializar datos.
- **Grid simple**, sin sidebar ni layout elaborado cumple el objetivo de HU-01 sin sumar complejidad que no pedía la historia.
- **Sin backend propio**: el `CardService` le pega directo a la API pública de YGOPRODeck desde el front, tal como está definido en el challenge.

### HU-02 — Buscar cartas por nombre

Un campo de búsqueda arriba de la grilla, con foco automático al entrar. A medida que se escribe, la grilla se filtra en tiempo real por nombre (coincidencia parcial, sin importar mayúsculas/minúsculas). Si no hay resultados, se avisa explícitamente qué término no encontró coincidencias.

#### Cómo funciona

- `Catalog` suma un signal `searchTerm` (lo que hay escrito en el input) y un `computed` `filteredCards`, que deriva de `cards()` y `searchTerm()`: sin término devuelve todo, con término filtra el catálogo ya cargado con `Array.filter()` + `includes()`. Al ser `computed`, se recalcula solo cuando cambia alguno de esos dos signals.
- El input usa binding simple: `[value]="searchTerm()"` para mostrar el valor actual y `(input)="onSearch($event)"` para reaccionar a cada tecla. `onSearch` extrae `event.target.value` (con un cast a `HTMLInputElement` en TypeScript) y actualiza `searchTerm`.
- El `@for` de la grilla ahora itera `filteredCards()` en vez de `cards()`; el bloque `@empty` distingue si no hay resultados por la búsqueda (muestra el término) o porque no hay cartas cargadas.

#### Decisiones

- **Búsqueda en el front, no contra la API**: se filtra sobre las cartas que ya están en memoria (`cards()`), sin disparar una nueva petición HTTP por cada letra escrita.
- **`[value]` + `(input)` en vez de `[(ngModel)]`**: evita agregar `FormsModule` solo para esto.
- **`autofocus` en el input**: cumple el criterio de que el campo quede listo para escribir apenas se entra a la pantalla, sin pasos adicionales.

### HU-03 — Ver detalle de una carta

Al hacer click en una carta se abre un modal con más información: imagen a la izquierda, y a la derecha nombre, tipo, atributo/nivel/ATK-DEF (si aplica, según el tipo de carta) y la descripción. Se cierra con el botón ✕ o haciendo click afuera del modal, y la búsqueda y el catálogo quedan como estaban.

#### Cómo funciona

- `Catalog` suma un signal `selectedCard` (`Card | null`). `CardItem` emite un evento `select` con la carta al hacer click, y `Catalog` lo escucha y hace `selectedCard.set(card)`.
- `CardDetail` (`catalog/card-detail/`) es el componente del modal: recibe la carta por `input.required<Card>()` y emite `close` cuando hay que cerrarlo. No sabe nada de la API ni del resto del catálogo.
- El modal se muestra con un `@if (selectedCard(); as card)` en el template de `Catalog`. Cerrar (click en ✕ o en el fondo) dispara `close`, que hace `selectedCard.set(null)`.
- El modelo `Card` se extendió con `desc`, `atk?`, `def?`, `level?` y `attribute?`. Los últimos cuatro son opcionales porque la API solo los devuelve para cartas de tipo Monstruo (las de Magia/Trampa no los traen), así que el template los muestra con `@if` solo cuando existen.

#### Decisiones

- **Modal superpuesto en vez de una ruta nueva**: no se usó el Router. Al no navegar a otra pantalla, el estado de búsqueda y el catálogo cargado nunca se pierden — abrir y cerrar el detalle no reinicia nada.
- **Imagen a la izquierda, info a la derecha**: prioriza que la carta se vea grande y clara, con el texto acompañándola sin tener que scrollear para llegar a la imagen.
- **Campos opcionales según tipo de carta**: en vez de asumir que toda carta tiene ATK/DEF/Nivel/Atributo, se muestran solo si vienen en la respuesta de la API, evitando mostrar campos vacíos o `undefined` en cartas de Magia/Trampa.

### HU-04 — Organizar el detalle en secciones

Dentro del modal de detalle, la información se organiza en 3 pestañas: Efecto, Estadísticas y Precio, en vez de un solo bloque de texto.

#### Cómo funciona

- `Tabs` (`shared/tabs/`) es un componente genérico que no sabe nada de cartas: recibe `labels` (un array de strings) y expone `activeIndex` como binding de dos vías (`model()`). Solo dibuja los botones de las pestañas y marca cuál está activa.
- `CardDetail` lo usa con `[(activeIndex)]="activeTab"` y un `@switch (activeTab())` que muestra el contenido correspondiente a cada pestaña (Efecto → `desc`, Estadísticas → atributo/nivel/ATK-DEF, Precio → `prices`).
- El modelo `Card` se extendió con `prices?` (tomado de `card_prices`, otro campo real de la API). Si una carta no tiene estadísticas (Magia/Trampa) o no tiene precios cargados, la pestaña muestra un mensaje en vez de quedar vacía.

#### Decisiones

- **Pestañas en vez de acordeón**: solo se ve una sección a la vez, lo cual mantiene el modal corto y evita que crezca mucho de alto con las tres secciones abiertas juntas.
- **`Tabs` reutilizable**: no depende de `Card` ni de nada de Yu-Gi-Oh — solo recibe etiquetas y un índice activo. Cualquier otro componente de la app podría usarlo para organizar contenido en pestañas.
- **`model()` para el índice activo**: es el mecanismo de two-way binding de Angular con signals; `CardDetail` mantiene el estado (`activeTab`) y `Tabs` solo lo lee/actualiza, sin duplicar esa información en dos lugares.

### HU-05 — Mantener el estado de búsqueda de forma consistente

No hubo que agregar código nuevo para esta historia: ya quedó resuelta por cómo se armó todo desde HU-01.

#### Cómo funciona

- Todo el estado relevante (`cards`, `loading`, `error`, `searchTerm`, `selectedCard`) vive como signals en un solo lugar: `Catalog`. Ningún otro componente (`CardItem`, `CardDetail`, `Tabs`) tiene estado propio — solo reciben datos por `input()` y avisan cosas por `output()`.
- `Catalog` nunca se destruye mientras estás en la pantalla, así que sus signals se mantienen vivos todo el tiempo. `CardDetail` sí se crea y destruye (entra y sale detrás de un `@if`), pero no es dueño de ningún estado de búsqueda, así que no hay nada que perder al abrirlo o cerrarlo.

#### Decisiones

- **Una sola herramienta (signals) para todo el estado de búsqueda**, no una mezcla de signals en un lado y variables sueltas en otro.
- **El estado vive en el componente que persiste**, no en los que se crean y destruyen (`CardDetail`): así abrir y cerrar el modal nunca resetea la búsqueda ni el catálogo cargado.

### Posibles mejoras

- No traer todas las cartas de una al inicio: buscar por API con paginación en vez de cargar el catálogo completo.
- Debounce en la búsqueda si en algún momento se pasa a buscar contra la API, para no pegarle en cada tecla.
- Tests de componentes: hoy solo existe `card.spec.ts` del service, faltan `Catalog`, `CardItem`, `CardDetail` y `Tabs`.

## Mejoras

Cambios hechos entre el Challenge 1 y el Challenge 2

- **Buscador como componente propio** (`components/search-bar/`): se sacó el input de `Catalog` a `SearchBar`, con `term` como `model()` (two-way binding, mismo patrón que `Tabs`). La lógica de filtrado no cambió, sigue en `Catalog`.
- **Carpetas reorganizadas**: `catalog`, `card-item`, `card-detail` y `shared/tabs` ahora son hermanos dentro de `components/`, en vez de tener `card-item`/`card-detail` anidados adentro de `catalog/`.
- **Placeholder para cartas sin imagen**: si `card_images` viene vacío, `CardService` devuelve un SVG simple ("Sin imagen") en vez de dejar un `<img>` roto.
- **Modo oscuro**: fondo oscuro global (`styles.css`) y colores ajustados en `catalog`, `card-item`, `card-detail`, `tabs` y `search-bar` para mantener contraste. Sin toggle, siempre oscuro.

## Challenge 2 — Duelist Codex: Navegación y Datos Resilientes

### HU-01 — Navegar la app por URL

El catálogo y el detalle de cada carta tienen su propia URL. `/` muestra el catálogo, `/card/:id` el detalle de esa carta puntual — se puede entrar directo por URL, refrescar estando en el detalle, o usar atrás/adelante del navegador, y funciona en todos los casos.

#### Cómo funciona

- `app.routes.ts` define `Catalog` en la ruta `''`, con `CardDetail` como ruta hija en `card/:id`. `Catalog` tiene su propio `<router-outlet>` en el template, en el mismo lugar donde antes estaba el `@if (selectedCard(); as card) { ... }` del modal.
- `CardItem` ya no emite un evento al hacer click: usa `[routerLink]="['/card', card().id]"` para navegar directo.
- `CardDetail` ya no recibe la carta por `input()` desde `Catalog`. Lee el `id` de la URL con `ActivatedRoute` + `toSignal(route.paramMap)` (convierte el observable en signal, sin suscribirse a mano) y un `computed()` que lo extrae del `paramMap`. Con ese `id` pide su propia carta con el nuevo método `CardService.getCard(id)`, que filtra la API por `id` en vez de `fname`. Tiene sus propios signals `card`, `loading` y `error`, con el mismo patrón `ngOnInit` + try/catch/finally que ya usaba `Catalog`.
- Cerrar el modal (✕ o click afuera) pasó de emitir `close` a navegar con `[routerLink]="['/']"`.

#### Decisiones

- **`CardDetail` como ruta hija de `Catalog`, no hermana**: así `Catalog` nunca se destruye al entrar o salir del detalle — se mantiene el mismo efecto de modal sobre el catálogo, y la búsqueda/estado de HU-05 del Challenge 1 siguen intactos, ahora con URL real de regalo.
- **`CardDetail` busca su propia carta por `id`** en vez de recibirla de `Catalog`: si se entra directo por `/card/123` (sin pasar por el catálogo primero), `Catalog` recién está arrancando su propio fetch y no se puede asumir que esa carta ya esté cargada.

### HU-02 — Explorar secciones del detalle como sub-vistas

Efecto, Estadísticas y Precio dejaron de ser un `@switch` local y ahora son 3 rutas hijas de `card/:id` (`effect`, `stats`, `price`), cada una con su propia URL. Entrar directo a `/card/123/price` funciona igual que entrar a `/card/123` y clickear la pestaña.

#### Cómo funciona

- `app.routes.ts`: `card/:id` ahora tiene `children`, con una ruta vacía que redirige a `effect` (`{ path: '', redirectTo: 'effect', pathMatch: 'full' }`) para que `/card/123` siempre caiga en una sección concreta.
- `CardDetail` agregó su propio `<router-outlet>` (importando `RouterOutlet`) donde antes estaba el `@switch (activeTab())`. Las 3 secciones viven en `components/card-detail/effect|stats|price/`, como subcarpetas de `card-detail` — reflejando la jerarquía de rutas. Cada una es un componente propio (`CardEffect`, `CardStats`, `CardPrice`) con el HTML que antes vivía en cada `@case` del switch.
- `Tabs` dejó de manejar un `activeIndex` local (`model<number>`) y ahora recibe `tabs: TabLink[]` (`{ label, link }[]`), renderizando cada uno como `<a [routerLink]="tab.link" routerLinkActive="active">`. Sigue sin saber nada de `Card`, `effect`/`stats`/`price` ni de esta app en particular — solo sabe renderizar una lista de links con su estado activo, igual que antes solo sabía renderizar labels con un índice activo.
- **Compartir la carta con las 3 secciones**: como ahora son 3 componentes propios detrás de un `<router-outlet>` (no se les puede pasar un `@Input()` — el router-outlet no permite bindear inputs custom a un componente que decide en runtime), `CardDetailStore` (`services/card-detail-store.ts`) es el dueño único de `card`/`error` y de cómo se cargan (`load(id)`, con `CardService.getCard(id)`). Se provee a nivel de la ruta `card/:id` (`providers: [CardDetailStore]` en `app.routes.ts`), no del componente. Como `CardEffect`/`CardStats`/`CardPrice` son descendientes de esa ruta, la inyección jerárquica les da la misma instancia — leen `store.card`/`store.error` directo, sin volver a pedir nada a la API.
- `CardDetail` ya no dispara el fetch en `ngOnInit`: la ruta `card/:id` tiene un `resolve: { card: cardResolver }` (`resolvers/card.resolver.ts`) que llama `store.load(id)` y espera a que termine antes de activar la ruta. `CardDetail` quedó sin `ActivatedRoute`, sin `toSignal`/`computed` ni `ngOnInit` — solo inyecta `CardDetailStore` y expone `card`/`error`.

#### Decisiones

- **`Tabs` se mantiene domain-agnostic a propósito**: en vez de que `Tabs` conozca las 3 secciones de una carta, `CardDetail` es quien arma el array `TabLink[]` y se lo pasa. `Tabs` solo entiende "lista de (label, link)", por lo que serviría igual para cualquier otro conjunto de sub-vistas en rutas de esta o de otra app.
- **Rutas relativas (`'effect'`, no `'/effect'`)**: como estas rutas son hijas de `card/:id`, `routerLink` las resuelve relativas a esa ruta activa. Si se navega desde `CardItem` a otra carta, no hace falta reconstruir el path completo.
- **Sin `effect()` para "sincronizar" estado**: una primera versión tenía a `CardDetail` con su propio signal `card`, copiándolo al store con un `effect()`. Es el anti-patrón que se remarcó en clase (`effect()` como último recurso, no para propagar estado). Se corrigió: `CardDetailStore` es el único dueño del signal, `CardDetail` expone una referencia directa (`card = this.store.card`), no una copia.
- Se agregó `{ path: '**', redirectTo: '' }` como última entrada del array de rutas (nivel raíz, hermana de la ruta `''` de `Catalog`) — cualquier URL que no matchee ninguna ruta redirige al catálogo, en vez de romper o quedar en blanco.
- **El resolver no devuelve la carta por `route.data`, llama al store directo**: en vez de que `cardResolver` retorne el `Card` y `CardDetail` lo lea de `route.data`, el resolver llama `store.load(id)` y no devuelve nada. Evita tener el mismo dato en dos lugares.
- **Se sacó `loading` del store y de `card-detail.html`**: con el resolver bloqueando la navegación hasta tener los datos, `CardDetail` nunca llega a renderizarse con `loading() === true` — era código muerto. Mientras se resuelve, lo que se ve es la pantalla anterior (el catálogo, que no se destruye) sin ningún indicador.

### HU-03 — Guard para "Mi colección"

Se agregó una ruta nueva, `/collection`, que muestra las cartas marcadas como favoritas. Si no hay ninguna favorita, la ruta queda bloqueada — no se puede navegar a `/collection` directo por URL ni por el link.

#### Cómo funciona

- `FavoritesStore` (`services/favorites.ts`): un signal `ids: number[]` con los IDs marcados como favoritos, persistido en `localStorage`. Expone `has(id)`, `toggle(id)` y `count` (computed). Es `providedIn: 'root'` (vía `@Service()`), a diferencia de `CardDetailStore` que es scoped a una ruta — acá sí necesitamos una única instancia para toda la app.
- `CardItem` ganó un botón de favorito (★/☆) que llama `favorites.toggle(card().id)` con `stopPropagation()` para no disparar el `routerLink` del `<article>`. Se reutiliza tal cual en el grid del catálogo y en `/collection`.
- `Collection` (`components/collection/`): pide con `CardService.getCard(id)` cada carta favorita (`Promise.all`), y filtra ese resultado contra `favorites.has(...)` con un `computed()` — así, si sacás una carta de favoritos estando en `/collection`, desaparece al toque sin tener que recargar.
- `hasFavoritesGuard` (`guards/has-favorites.guard.ts`): `CanActivateFn` que revisa `favorites.count() > 0`; si no hay favoritos, hace `router.navigate(['/'])` en vez de dejar entrar.
- `app.routes.ts`: `collection` es una ruta hermana de `''`, con `canActivate: [hasFavoritesGuard]`.
- `Catalog` muestra un link "Mi colección (N)" con el conteo en vivo (`favorites.count`).

#### Decisiones

- **La condición del guard es "cero favoritos"** — es la más simple de verificar y no depende de nada más que ya no tengamos.
- **`FavoritesStore` es `root`, no scoped**: a diferencia de `CardDetailStore` (pensado para compartirse solo entre una carta y sus 3 secciones), acá necesitamos que el catálogo, el detalle y la colección vean siempre los mismos favoritos — por eso va a nivel de toda la app.

### HU-04 — Abrir el detalle de una carta

Al navegar al detalle de una carta, los datos ya están listos antes de que se termine de activar la vista — no hay pantalla vacía ni a medio cargar, ni importa si se llega ahí desde el catálogo o entrando directo por URL.

#### Cómo funciona

- El fetch lo dispara `cardResolver` (`resolvers/card.resolver.ts`), que corre **antes** de activar la ruta `card/:id` y llama `store.load(id)` esperando (`await`) a que termine. Como es parte de la configuración de la ruta (no de un click en particular), corre siempre — llegues por `routerLink` desde `CardItem` o pegando la URL directo en el navegador.
- **Carta no encontrada**: `CardDetailStore.load(id)` distingue dos casos de fallo. Si `CardService.getCard(id)` resuelve con `null` (la API respondió bien pero no hay ninguna carta con ese id), se setea `error` con "No se encontró la carta solicitada.". Si la petición en sí falla (`catch`), se setea el mensaje genérico de error de red. Antes de este ajuste, el caso de "no encontrada" no seteaba ningún error y el modal quedaba completamente en blanco.
- `card-detail.html` ya tenía el `@if (error())` con el mensaje — no hizo falta tocar el template, solo que `CardDetailStore` cubriera el caso que le faltaba.

#### Decisiones

- **El resolver es lo que garantiza la consistencia catálogo-vs-URL-directa**, no algo que haya que armar aparte: al estar en la configuración de la ruta, Angular lo corre en cualquier forma de llegar a `card/:id`. Esto ya estaba resuelto desde HU-02 (cuando se agregó el resolver junto con las secciones hijas); esta historia lo que sumó fue el caso de "carta no encontrada" que faltaba cubrir.

### HU-05 — Identificar cartas destacadas de un vistazo

Las cartas con ATK mayor a 1200 se resaltan visualmente (borde + resplandor naranja) en cualquier lugar donde se listen cartas — catálogo y colección — sin que cada componente tenga que implementar esa lógica por su cuenta.

#### Cómo funciona

- `HighlightCardDirective` (`directives/highlight-card.directive.ts`): una directiva de atributo, `[appHighlightCard]`, que recibe la carta (`input.required<Card>({ alias: 'appHighlightCard' })`) y calcula `isHighlighted = computed(() => (card().atk ?? 0) > 1200)`. Vía `host: { '[class.highlighted-card]': 'isHighlighted()' }` le agrega o saca la clase `highlighted-card` al elemento donde se aplica.
- Se aplica una sola vez, en `card-item.html` (`<article [appHighlightCard]="card()">`), no en cada lugar que renderiza cartas. Como `CardItem` ya se reutiliza en `Catalog` y en `Collection`, ambos quedan resaltando cartas destacadas gratis, sin tocarlos.
- El estilo (`.highlighted-card`) vive en `card-item.css`, junto a la clase `.card-item` que ya estaba — la directiva solo pone/saca la clase, el cómo se ve queda en el componente dueño del elemento.

#### Decisiones

- **`computed()` + host binding, no `effect()` + `Renderer2`**: Alcanza con un `computed()` atado a un binding de clase en el host es menos código, no toca el DOM a mano.
- **Es una directiva de atributo, no estructural**: no crea ni destruye elementos (como si eran `qzRow` o el `*appCustomIf` de clase), solo le agrega/saca una clase CSS a un elemento que ya existe.