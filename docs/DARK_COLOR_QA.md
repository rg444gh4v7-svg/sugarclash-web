# Renacer · cierre visual oscuro/color

21 de octubre de 2026. Versión local. Dirección confirmada por Jose: mundo casi monocromo, color que regresa con el progreso y logo sobrio. No se publicó ningún despliegue.

## Cambios revisados

Portada de juego nueva con wordmark propio, siguiente nivel real, progreso del capítulo y accesos directos a Guerra, Royale, Latido y Zen. Base carbón/petróleo, texto hueso y CTA coral. Paisaje original `assets/renacer-restoration-v3.webp`; el filtro de la escena recibe `completed(chapter)/10`, sin filtrar botones ni texto. Los ocho paisajes del atlas conservan sus posiciones originales.

Atlas de caramelos nuevo de4×2, iconoS coherente en favicon/Manifest/Apple touch icon y superficies compartidas en todas las pantallas. La celda especial ahora se nombra «estrella», conforme a su silueta; las reglas del prisma y el Gran Cristal del relato permanecen. En la escena de aldea, los edificios sin construir se mantienen grises y los construidos conservan color.

Feedback cosmético breve de puntos, cadenas, poderes y victoria. Las partículas, clases, temporizadores y voces se limpian al navegar, sustituir sesión u ocultar la página. No añade RNG del motor, recompensas, campos de guardado, RAF de decoración ni dependencias de runtime.

## Comprobación automática

- JavaScript inline: **SYNTAX OK** tras cada edición de `index.html`.
- `node --test tests/*.test.cjs`: **69 aprobadas,0 fallos**. Incluye nueve pruebas nuevas de feedback, limpieza, callbacks antiguos, movimiento reducido, sonido y victoria validada.
- Caché actual `sugarclash-renacer-v3`; el catálogo incluye los recursos nuevos y todos existen. Pruebas de instalación, navegación canónica, fallback offline, aislamiento de legacy y fallos de escritura aprobadas.
- `git diff --check`: sin errores.

No se cambiaron reglas, metas, economía ni requisitos. Para cerrar la entrega se volvió a ejecutar `node scripts/renacer-playthrough.cjs` sobre el runtime final: **80/80 niveles,108 intentos,28 derrotas,24 esperas simuladas y0 jugadas rechazadas**. El motor concedió todas las victorias por jugadas legales; `legacyKeyWritten:false`. La nueva ejecución reprodujo exactamente el informe guardado. [Recorrido y método](RENACER_PLAYTHROUGH.md).

## Navegador y partida real

QA aislada en `127.0.0.1:4199`, distinto del origen de Jose en4177. Antes de jugar se abrió «Exportar mi viaje»: estrellas vacías,0 movimientos,0 miel,25 gemas,solo la choza inicial y `legacyImported:false`. No se importaron, borraron ni modificaron datos personales del otro origen.

Se revisaron portada, atlas, modos, aldea, recuerdos, ajustes, partida y arena. Emulación a **320×640**, **390×844** y escritorio **1280×720**; no corresponde a un teléfono físico. Las vistas de navegación a320px devolvieron `scrollWidth=innerWidth=320`. En la partida a320px, tablero284×284 y herramientas entre y557–598, completos dentro de640px.

El tutorial se jugó mediante dos celdas reales: creó rayo,138 puntos y21 movimientos restantes. Después se abandonó esa prueba por el diálogo normal. En otro intento real del nivel1 se hicieron tres intercambios legales elegidos a partir de las piezas visibles:120 →180 →992 puntos,19 movimientos restantes y victoria sobre la meta807. Se verificaron tres estrellas,+38 miel,+1 gema, devolución de una vida, ruta2 abierta y10% de capítulo restaurado. No se escribieron victorias ni se invocó una función de premio desde las herramientas.

Royale se abrió con diez combatientes, marcas de ataque legibles, controles de Pulso/Impulso y pausa explícita. Zen se abrió y cerró con el flujo normal de guardar marca, sin cobrar vidas. No se observaron errores ni advertencias JavaScript durante la revisión online.

Al terminar se apagó el servidor de QA y se recargó la portada: **HTML, logo, paisaje, recursos y progreso siguieron visibles offline**. Se restableció el viewport habitual y se dejó la pestaña de resultado. La versión servida del origen de QA mostró la dirección final; esto no verifica una publicación externa.

## Evidencia

- [Portada desktop](qa/renacer-dark-home-desktop.jpg), [390px](qa/renacer-dark-home-390.jpg) y [320px](qa/renacer-dark-home-320.jpg).
- [Tablero390px](qa/renacer-dark-board-390.jpg), [320px](qa/renacer-dark-board-320.jpg) y [victoria real](qa/renacer-dark-victory-390.jpg).
- [Atlas](qa/renacer-dark-world-390.jpg), [modos](qa/renacer-dark-modes-390.jpg), [aldea](qa/renacer-dark-village-390.jpg) y [arena pausada](qa/renacer-dark-arena-390.jpg).
- [Estudio de restauración](qa/restoration-states.html) y [captura comparativa](qa/renacer-restoration-states.jpg): fixture estático de saturación0/0,5/1 con el mismo tratamiento del arte. Estos estados ilustrativos no conceden progreso ni representan victorias adicionales de campaña.

Las capturas anteriores de `RENACER_QA.md` se conservan como historial visual. La diversión, retención y resultados comerciales requieren pruebas con jugadores; esta QA verifica implementación y comportamiento.

## Entrega cerrada

Se revisó la pestaña principal `http://127.0.0.1:4177/`: todavía contenía el runtime anterior. Estaba en Inicio y se recargó, sin iniciar partidas ni importar/borrar progreso. La portada nueva, el logo y la escena descolorida quedaron visibles. Antes y después se observaron los mismos5/5 vidas,10 miel y25 gemas, y0/80 guardianes. [Captura de la pestaña final](qa/renacer-final-main.jpg). La pestaña separada de QA se cerró y quedó una única pestaña de juego para la entrega.

Dos auditorías finales independientes, de jugabilidad y de recursos, no detectaron bloqueos. Se conservaron el estudio de mercado, las fuentes, los prompts y los informes. No quedan acciones necesarias para esta entrega local; publicar corresponde a una solicitud posterior.
