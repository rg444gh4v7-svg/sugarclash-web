# Un lugar que responde durante la partida

El diorama sustituye el fondo de la cabecera de campaña. No añade otra tarjeta ni reduce el tablero. Su lienzo nativo es360×120: título y regla conservan aire arriba; el lugar ocupa el suelo del encuadre; guardián y Confite se integran fuera del SVG. La interfaz sigue oscura y el color vuelve sólo en el lugar reparado.

`playSceneArt(kind, progress)` es puro: recibe `path`, `water`, `garden` o `home`, y progreso0..1. No contieneIDs SVG, recursos externos, aleatoriedad ni animaciones. Las fases son: nada restaurado, primera zona recuperada, dos tercios y completo. La primera zona siempre produce una diferencia aunque el nivel tenga cuatro o más zonas. El progreso se deriva sólo de `g.restoration.restored / g.restoration.total`.

| Lugar | Primera zona | Dos tercios | Completo |
|---|---|---|---|
| Camino | Vuelve corriente bajo el puente | Se une el arco roto | Baranda continua y flores en las orillas |
| Agua | Se retira la primera roca y fluye el cauce | Se libera el bloqueo y vuelve el paso | Juncos y flores ocupan las orillas |
| Jardín | Aparecen hojas en los tallos | Vuelven ramas, hojas y brotes | Abren las flores y florece el borde |
| Hogar | Techo reparado y muro cálido | Ventanas libres, luz y puerta habitable | Humo quieto, flores y camino de entrada |

La respuesta opcional `.sc-place-awake` dura700ms y debe invocarse desde el ciclo de feedback existente sólo al aumentar el número de zonas restauradas. No hay timers ni RAF propios. Con movimiento reducido, la geometría ganada aparece quieta. `updatePlayScene(g,host)` mantiene el host y sustituye el SVG sólo al cambiar de fase; devuelve `advanced` para que el integrador decida la señal finita. La primera pintura no celebra.

El CSS se aplica mediante `.battle-scene.has-play-scene`. Respeta los IDs de progreso y los textos existentes, incluidos los cambios de instrucción de la marea. En móvil la cabecera mide132px; a320×640,109px. Guardián a derecha, Confite pequeño a izquierda, barra y porcentaje al pie. En escritorio se amplía la escena dentro del mismo encuadre; no se estira el SVG.

Validación del recurso: sintaxis JS,16 estados SVG rasterizados y revisión visual independiente sin bloqueo concreto. La integración final en navegador y el ajuste al tablero completo corresponden al archivo principal; este recurso no modifica `index.html` ni reglas.
