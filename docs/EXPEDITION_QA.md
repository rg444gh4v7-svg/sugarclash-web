# Renacer · identidad de expedición

22 de octubre de2026. Jose pidió seguir mejorando porque el juego se veía genérico. Se mantiene su dirección aprobada: mundo oscuro/descolorido, regreso del color por progreso real y logo sobrio.

## Cambio aplicado

La portada ahora presenta una ruta de diez hitos reales sobre el paisaje. Cada uno usa `starsAt()` y `levelOpen()`; la entrada pasa por `requestLevel()` y mantiene jefes, validación y cobro. Completado se distingue con un check; bloqueado con candado; el siguiente muestra su guardián. La ruta tiene nombres accesibles, foco y áreas táctiles de al menos44px.

El panel central y las cuatro tarjetas iguales se sustituyeron por un paisaje libre, título de territorio, próximo guardián y botón de jugar en una franja inferior. Guerra/Royale tienen accesos propios; Latido y Zen conservan botones directos. Confite, próximo hogar y encargo diario cierran la vista.

El color deja de volver como una saturación uniforme: `restorationVisual()` deriva la huella de `completed(chapter)/10` y una máscara sobre una segunda capa ilustrada la extiende desde el río. La interfaz permanece legible. El guardián de campaña también recupera color con el objetivo real de la partida; Zen/Latido conservan su personaje a color. No hay nuevo RNG, premio, campo persistente ni animación ambiental.

No se generaron ni sustituyeron imágenes: se conservan el logo y el paisaje aprobados. La tipografía Fraunces diferencia los nombres del mundo; los controles siguen en Karla. Los bloques activos nuevos están delimitados por `EXPEDITION_HOME_START/END` y `EXPEDITION_STYLE_START/END` en `index.html`.

## Verificación

- **SYNTAX OK** tras cada edición de `index.html`.
- **69 pruebas aprobadas**. El worker y sus pruebas usan `sugarclash-renacer-v4`.
- Recorrido real del runtime final: **80/80 niveles,108 intentos,28 derrotas,0 jugadas rechazadas**, sin escribir la clave antigua. Reprodujo el informe existente; no se forzaron victorias.
- Importaciones de `CLAUDE.md` resuelven `AGENTS.md`, `CONCEPT.md` y `VISUAL_STYLE.md`. La [guía para Claude](CLAUDE_HANDOFF.md) contiene arranque, funciones, reglas, publicación y un prompt para Jose.
- `git diff --check` sin errores.

## Navegador

Origen aislado `http://127.0.0.1:4201/`. Antes de jugar se abrió Exportar:0 estrellas,0 jugadas,0 miel,25 gemas,5 vidas,solo choza y `legacyImported:false`. No se importaron datos, concedieron premios ni escribieron guardados desde herramientas.

Se verificó la portada a320×640,390×844 y1280×720. A320px: `scrollWidth=320`, hitos de44px o mayores, cero solapamientos; Jugar terminaba en y437, accesos de arena en y554 y navegación comenzaba en y572. Tabulador pasó del primer hito al siguiente con foco visible. El hito bloqueado2 mostró su requisito sin gastar una vida.

Se entró al nivel1 tocando su hito. La vida bajó de5 a4 y apareció la meta807. El tutorial creó un rayo mediante las dos piezas reales indicadas. Tras diez intercambios legales en total, la partida terminó con894 puntos,12 movimientos y tres estrellas. El motor concedió38 miel,1 gema y devolvió la vida. Al volver a Inicio: primer hito con check, segundo disponible,10% de capítulo y una huella visible de color en el río.

El filtro del guardián se comprobó en100% como `grayscale(0) brightness(1)`. Zen se abrió a320px: tablero284×284, herramientas hasta y598 dentro de640px y personaje a color. Se cerró por el flujo normal, sin cobrar vidas. Es emulación de navegador, no teléfono físico.

## Evidencia

- [Portada escritorio](qa/expedition-home-desktop.jpg), [320px](qa/expedition-home-320.jpg) y [390px inicial](qa/expedition-home-390.jpg).
- [Primer color recuperado](qa/expedition-restored-390.jpg), [guardián descolorido](qa/expedition-board-ash.jpg), [tablero320px](qa/expedition-board-320.jpg) y [victoria real](qa/expedition-victory-390.jpg).
- [Comparación0/5/10](qa/expedition-restoration.html) y [captura](qa/expedition-restoration-states.jpg): fixture visual estático que reutiliza el CSS y la función de presentación. No es progreso de campaña.

La evidencia de publicación se registra por separado con el commit y los archivos realmente servidos. Las pruebas de reglas no demuestran retención, diversión ni éxito comercial.
