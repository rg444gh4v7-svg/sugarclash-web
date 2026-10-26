# Navegación clara · propuesta del 25 de octubre de 2026

Estado: especificación para la iteración que Jose pidió al decir «la navegación es terrible, no se entiende». Auditoría de lectura del `index.html` vigente y comprobaciones aisladas de sus funciones. **Este documento no confirma integración, recorrido visual ni publicación.** El runtime publicado anterior conserva su evidencia en `DEPLOYMENT_PLAY_CHARM.md`.

La estructura principal tendrá cuatro destinos: **Inicio / Campaña / Otros modos / Aldea**. Recuerdos, historia, ayuda y ajustes serán secundarios. Se mantienen partidas, costes, acceso, recompensas, guardianes y guardados actuales.

## Problemas observables

| Código actual | Lo que ve o hace el jugador | Corrección concreta |
| --- | --- | --- |
| `renderNav()` usa Inicio / Territorios / Jugar / Mi aldea / Recuerdos. | «Jugar» abre los modos alternativos, aunque la campaña se juega desde Inicio. No explica dónde está el juego principal. | `world` se llama **Campaña**; `modes`, **Otros modos**; `village`, **Aldea**. Reservar «Jugar» para un botón que empieza una partida. |
| `renderHome()` tiene diez hitos que empiezan niveles, el botón de campaña, Atlas, cuatro modos, diario, aldea e historia. `renderWorld()` repite la ruta. | Inicio parece otro mapa completo y compite con muchos accesos de distinta importancia. «Atlas», «Territorios» y la campaña parecen destinos distintos. | Inicio resume la próxima partida; Campaña posee la ruta completa. Un solo botón principal para continuar. Conservar los accesos directos de Guerra/Royale aprobados; reunir el resto en Otros modos. |
| `renderWorld()` titula «Un color a la vez.» y `renderModes()`, «Entra. Juega. Vuelve.». | La frase ambiental ocupa el lugar del nombre de pantalla. | H1 **Campaña** y **Otros modos**. Las frases del mundo quedan como apoyo breve. |
| `renderWorld(tid)` permite inspeccionar otro capítulo, pero su «Continuar» llama a `campaignNext()` global. | El jugador puede estar mirando un territorio y empezar en otro sin saberlo. | El botón debe nombrar su destino: **Continuar · nivel N** con el capítulo correspondiente, o **Ir a mi siguiente nivel** cuando difiera del capítulo inspeccionado. No inferir que juega el capítulo visible. |
| `navigate()` sólo intercepta una partida activa de `screen==='game'`; `showScreen()` siempre ejecuta `stopArena()`. | Desde Guerra/Royale, tocar una pestaña o Ajustes termina la sesión directamente. En tablero sí se pide salir. | La misma protección de salida para ambos motores. Pausar antes de preguntar; cancelar vuelve a la misma sesión. |
| `arenaExit()` siempre va a `home`; `pauseBoard()` tiene `destination='home'`. No existe origen de entrada. | Se entra a un modo desde Otros modos y «volver» lleva a Inicio. En tablero, Salir y Pausa pueden perder el contexto de entrada. | Guardar origen transitorio por sesión; los botones dicen el destino concreto. |
| Los modos usan «El Latido», «Jardín en calma» y «Un color para hoy» como nombre principal. | El nombre de lore no explica el tipo de partida antes de entrar. | **Contrarreloj**, **Zen** y **Desafío diario** como nombre de juego; conservar los títulos de lore como subtítulo. Guerra 5v5 y Royale mantienen su nombre. |

## Destinos y contenido

| ID existente | Nombre visible y H1 | Contenido principal | Acción principal |
| --- | --- | --- | --- |
| `home` | Inicio | Escena actual, capítulo y próximo nivel, último cambio ganado, resumen de progreso. | **Jugar nivel N** al comenzar; **Continuar · nivel N** con progreso; **Volver a jugar** al completar la campaña. |
| `world` | Campaña | Ocho capítulos y ruta de diez niveles del capítulo elegido. Nombres y bloqueos legibles. | Próximo nivel nombrado; tocar un nivel mantiene `requestLevel()` y sus validaciones. |
| `modes` | Otros modos | Desafío diario, Guerra 5v5, Royale, Contrarreloj y Zen. | Un botón específico por modo. |
| `village` | Aldea | Escena de Confite, construcción seleccionada, beneficio, coste y requisito. | **Construir · N de miel** cuando corresponda. Seleccionar sólo inspecciona. |

La misma selección, orden, icono y nombre se usan en escritorio y móvil. El texto permanece visible; no depender de tooltips ni iconos solos. Cuatro zonas táctiles iguales caben a320px sin abreviaturas. Marcar la ubicación con estado activo y `aria-current="page"`, además del color.

En partida, la pertenencia sigue siendo Campaña para campaña y Otros modos para diario/arenas/Contrarreloj/Zen; no dejar las cuatro pestañas sin selección por estar en `game` o `arena`. Si se mantienen accesibles, tocarlas pasa por la salida protegida. La cabecera de la partida tiene nombre claro y **Pausa**; no duplica un botón «Salir» y otro icono ambiguo con el mismo menú.

### Inicio con una jerarquía

1. Próxima partida: capítulo, **Nivel N · nombre del lugar**, progreso y un botón principal. El número global de nivel puede convivir con «Capítulo T · N/10» como contexto, sin alternar «Ruta» y «Nivel» en controles.
2. Enlace **Ver campaña** abre `world` en el capítulo de `campaignNext()`. Si se conserva la ruta en la escena de Inicio, funciona como resumen y enlace al mapa, no como un segundo selector completo de diez niveles.
3. Atajos **Guerra 5v5** y **Royale** conservan la entrada en un toque; subtítulo «Contra IA» en ambos. Un enlace **Ver otros modos** lleva al hub. Contrarreloj, Zen y diario viven allí para reducir accesos repetidos.
4. El último lugar recuperado y el siguiente edificio aportan contexto; **Ver aldea** lleva a inspeccionar, nunca construye. No introducir un segundo «Continuar» dentro de la voz de Confite.

El H1 de Inicio puede conservar el nombre del territorio; el destino «Inicio» ya está visible en la navegación. La escena sigue siendo parte del juego, con el estilo dark/color vigente. Este cambio no requiere arte nuevo ni otro sistema de tarjetas.

### Secundarios

- **Historia y recuerdos**: enlace de texto secundario en Inicio y Campaña, fuera de la barra principal. Abre el archivo existente; dentro están **Historia de Dulcelandia** y los recuerdos desbloqueados. No adelantar la revelación final de Confite.
- **Ajustes**: un acceso constante en la cabecera, con nombre accesible «Ajustes». No ocupa una quinta pestaña móvil. Desde una partida pasa por la misma pausa que otros destinos.
- **Cómo jugar**: dentro de Ajustes y disponible en Pausa. Mantener las pistas de tablero separadas de la navegación.
- Las pantallas secundarias incluyen **Volver a Inicio** o **Volver a Campaña**, según su origen. No usar sólo «Volver» cuando el destino pueda sorprender.

## Texto concreto

| Lugar | Texto |
| --- | --- |
| Barra principal | Inicio · Campaña · Otros modos · Aldea |
| Campaña, apoyo | «Restaura los caminos de Dulcelandia. Elige un nivel para jugar.» |
| Selector de capítulo | «Capítulo 1 de 8 · nombre del territorio»; cada control incluye nombre y estado accesibles. |
| Nivel abierto | «Nivel N · nombre» / «Disponible» |
| Nivel superado | «Nivel N · nombre» / «Restaurado · X estrellas» |
| Nivel bloqueado | «Completa el nivel N anterior»; para un capítulo, «Completa el capítulo anterior». No crear requisitos nuevos. |
| Otros modos, apoyo | «Partidas independientes. No gastan vidas. Guerra y Royale son contra IA.» |
| Diario | **Desafío diario** / «Un color para hoy» / **Jugar desafío** o **Volver a jugar** si ya está ganado. Mantener visible que el premio sólo se recibe una vez. |
| Guerra | **Guerra 5v5** / «Dos equipos contra IA» / **Jugar Guerra** |
| Royale | **Royale** / «Diez combatientes contra IA» / **Jugar Royale** |
| Contrarreloj | **Contrarreloj** / «El Latido · 60 segundos» / **Jugar Contrarreloj** |
| Zen | **Zen** / «Jardín en calma · Sin reloj ni límite de movimientos» / **Jugar Zen** |
| Aldea, apoyo | «Usa la miel que ganas para recuperar el hogar de Confite. Toca un edificio para verlo.» |
| Aldea, vuelta a jugar | **Ir a Campaña** abre el mapa. Si el botón empieza partida, **Continuar · nivel N** y entrada por `requestLevel()`. |
| Resultado de campaña ganado | **Jugar nivel N** y **Ver campaña**. El final T8 conserva **Escuchar a Confite**. El acceso actual a la aldea puede permanecer secundario. |
| Resultado de campaña perdido | Conservar costes reales: **Continuar · 25 gemas**, **Reintentar · 1 vida**, **Ver campaña**. Cambiar el nombre no altera la transacción. |
| Resultado de otro modo | **Jugar otra vez** y **Volver a Inicio/Otros modos**, según origen. |

## Volver al origen y salir con claridad

Mantener el origen **sólo en memoria**, en la sesión de tablero/arena, sin campos nuevos en el save. Debe capturarse antes de `showScreen()` al entrar desde Inicio, Campaña, Otros modos o Aldea. Guardar también el capítulo seleccionado cuando el origen sea Campaña. Si no hay origen válido, usar Campaña para campaña y Otros modos para los demás juegos.

- **Reintentar** conserva el origen de la sesión anterior. **Jugar siguiente nivel** también lo conserva; no capturarlo como `game` por error.
- La flecha o la opción salir de Pausa vuelve a ese origen. Una pestaña tocada explícitamente pide salir hacia **esa pestaña**, no hacia el origen.
- `continueCampaign()` sigue eligiendo con `campaignNext()`; `requestLevel()` y `tryStartLevel()` siguen validando acceso/vida. La navegación no entrega acceso ni cobra vidas adicionales.
- Antes de salir, las arenas se pausan; `stopArena()` sólo ocurre al confirmar. Cerrar el diálogo conserva la pausa hasta **Continuar partida**, igual que los modales actuales de recursos.
- En tablero se respeta una cascada pendiente y su validación `state.run`; no detener a medias una jugada para cambiar pantalla. Mantener la protección contra callbacks antiguos y limpieza de feedback.
- Zen conserva el cierre que guarda la marca. No reemplazarlo por un `stopBoard()` directo que descarte el resultado. Salir de los demás modos mantiene sus reglas actuales; no inventar premios ni guardar una victoria por abandonar.

### Pausa

Título: **Partida pausada**. Mostrar el nombre del juego y, para campaña, su nivel.

- Principal: **Continuar partida**.
- Secundaria: **Salir a Campaña**, **Salir a Otros modos**, **Salir a Inicio** o **Salir a Aldea**, según destino.
- Campaña: «Si sales, esta partida terminará y se consumirá la vida reservada al entrar.»
- Arena/diario/Contrarreloj: «Tu partida está pausada. Si sales, esta partida terminará.» No mencionar vidas que el modo no gasta.
- Zen: **Terminar y guardar marca**; resultado con vuelta al origen.

Si el jugador tocó una pestaña durante la partida, título **¿Salir a [destino]?** y principal **Continuar partida**. No usar «Volvemos al camino» para salir de Royale hacia Ajustes.

## Auditoría de los dos posibles fallos

**Arena al navegar: confirmado.** La función real `navigate('world')`, con `state.screen='arena'` y sin tablero activo, llama a `showScreen('world')`, que ejecuta `stopArena()` sin mostrar diálogo. `arenaExit()` también fija Inicio. Se comprobó en una VM con stubs de DOM y funciones extraídas del HTML, sin tocar datos ni partida personal. Es una pérdida de contexto/sesión, no un fallo de economía.

**Niveles de `world` oculto: no se encontró un fallo de interacción normal.** `.screen{display:none}` oculta las pantallas inactivas; `.screen.active` las muestra. El único `onclick="renderWorld(...)"` está dentro del selector del propio mapa. Los hitos de Inicio y Campaña llaman directamente a `requestLevel()`, y `startBoard()` activa `game`; no requieren mostrar `world` primero. No añadir un paso artificial de mapa antes de cada nivel. Una llamada programática sobre un nodo oculto no demuestra que el jugador pueda tocarlo.

El navegador no tiene `pushState`/`popstate`; hoy «Atrás» del navegador no representa las pantallas internas. Esta propuesta define primero las vueltas dentro del juego. No incorporar una solución parcial de historial que permita abandonar una partida saltándose las validaciones.

## Comprobación de la integración

Sin alterar guardados personales: usar origen de QA aislado distinto de4177 y de producción.

- A320×640 y390×844 se leen los cuatro destinos completos, el activo y el nombre de pantalla; no hay scroll horizontal ni botón principal tapado.
- Desde Inicio se entiende qué botón continúa campaña y cuáles entran a Guerra/Royale. Desde Campaña se reconoce el capítulo visible y el destino exacto de continuar.
- Entrar desde Inicio a Guerra/Royale, pausar y volver: Inicio. Entrar desde Otros modos al mismo juego: Otros modos. Repetir para diario, Contrarreloj y Zen.
- En campaña, tocar otra pestaña conserva la partida al cancelar; confirmar consume sólo la vida ya reservada y vuelve al destino mostrado. Ganar/reintentar/siguiente nivel conservan acceso, costes y origen.
- La arena no desaparece por tocar Ajustes o una pestaña sin confirmar. Cancelar conserva posiciones/tiempo y requiere continuar explícitamente.
- Probar selección de capítulo, niveles bloqueados y jefe, regreso de Historia y recuerdos, y navegación por teclado con foco visible. Los nombres accesibles coinciden con las etiquetas visibles.
- Ejecutar sintaxis y pruebas pertinentes después de que el root edite el runtime. Este documento no atribuye a la navegación nueva las110 pruebas ni el despliegue de la versión anterior.
