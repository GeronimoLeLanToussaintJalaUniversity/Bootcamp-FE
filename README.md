# Unidades de CSS: vh, dvh, rem y fr

---

## vh (viewport height)

1vh es el 1% de la altura de la ventana del navegador. Se usa para que algo ocupe toda la pantalla o una parte de ella. El problema es que en celulares no considera la barra de dirección.

Se usa para: secciones hero fullscreen, menús laterales, fondos que ocupen toda la pantalla.

---

## dvh (dynamic viewport height)

Igual que vh pero se adapta cuando la barra de dirección del celular aparece o desaparece. Siempre es exactamente lo que el usuario ve en ese momento. Es la versión corregida de vh para móviles.

Se usa para: lo mismo que vh pero cuando necesitás que funcione bien en celulares.

---

## rem (root em)

Relativo al tamaño de fuente del elemento html. Por defecto el navegador usa 16px, entonces 1rem = 16px. Si cambiás el font-size del html a 10px, 1rem = 10px.

Se usa para: tipografía, paddings, margins y todo lo que necesite ser consistente y escalable en el sitio. Es el estándar hoy para casi todo lo que no sea layout. Si el usuario agranda la fuente del navegador, todo lo que esté en rem se agranda con él.

---

## fr (fraction)

Exclusivo de CSS Grid. Representa una fracción del espacio disponible. Si hacés `grid-template-columns: 1fr 2fr`, la primera columna ocupa un tercio y la segunda dos tercios. No funciona fuera de Grid.

Se usa para: dividir el espacio en CSS Grid. Sidebars, columnas iguales, layouts asimétricos.