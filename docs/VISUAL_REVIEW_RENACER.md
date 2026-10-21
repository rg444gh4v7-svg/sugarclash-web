# Renacer · revisión del agente visual

21 de octubre de 2026. Dirección: El Cristal Vivo. Leer junto a [CONCEPT.md](../CONCEPT.md) y [VISUAL_STYLE.md](../VISUAL_STYLE.md). Este pase conserva el paisaje cinematográfico, el Confite original, los atlas locales y las proporciones de la interfaz; no cambia reglas, economía, guardados, navegación ni identificadores.

## Hallazgos y cambios preparados

1. **Portada móvil.** La etiqueta «Una nueva aventura · Renacer» cruzaba una zona luminosa del cristal con cuerpo de ocho píxeles y contraste insuficiente. `.hero-copy .eyebrow` recibe una veladura pequeña, vinculada al ancho de las palabras, y nueve píxeles en390px. El cristal y el paisaje quedan libres. La descripción y el dato de capítulo ganan contraste y un punto de tamaño en390px;320px conserva su escala compacta. Los accesos directos a Guerra/Royale conservan ubicación y acciones, con una altura visual algo mayor.
2. **Atlas.** La opacidad aplicada al botón bloqueado apagaba también nombres y requisitos. `.route-stop.locked` mantiene texto legible y desplaza el apagado hacia la criatura, el aro y el icono. El siguiente sendero recibe un borde cálido más claro. El paisaje conserva su saturación ligada al progreso; no se finge una restauración.
3. **Un mismo material.** `.territory-preview`, `.village-detail` y `.settings-panel` comparten borde mineral y luz de superficie discretos. La unión del panorama con su panel es gradual. Los modales ganan contraste en el cuerpo del texto.
4. **Arte y lectura.** Las figuras de `.mode-feature-art` reciben sombra de separación. Los rótulos de edificios usan fondo oscuro más consistente, sin cajas nuevas sobre el paisaje. Las piezas con poder mantienen sus señales existentes; una sombra mínima sostiene los trazos claros sobre caramelos dorados y rosas. No se añade movimiento.

## Entrega e integración

El archivo preparado es `/private/tmp/renacer-visual.css`. Añadirlo **al final del `<style>` existente**, después de las reglas de arena y los últimos ajustes móviles. No requiere modificaciones de markup, atributos, IDs ni JavaScript. No debe enlazarse como una dependencia externa: el runtime permanece en un únicoHTML.

Selectores principales: `.hero-copy .eyebrow`, `.hero-copy>p`, `.chapter-note`, `.hero-quick button`, `.route-stop.locked`, `.route-stop.current`, `.territory-dot.locked`, `.village-node>small`, `.mode-feature-art .sprite`, `.modal-body` y las señales ya existentes de `.piece[data-power]`.

## Revisión realizada y cierre requerido

Antes del parche se inspeccionaron portada, atlas y Aldea en una pestaña independiente de Chrome con origen `http://localhost:4177`, distinto del origen127.0.0.1 usado por las pruebas principales. No se construyeron edificios, jugaron niveles ni modificaron guardados en esa revisión. A390×844 se confirmó que el paisaje y las criaturas cargan en sus geometrías reales; una captura tomada antes de terminar su carga puede mostrar temporalmente el fondo del panel.

El parche está preparado para que el coordinador lo integre y verifique en su navegador. Comprobar después de integrarlo:

- **320×640:** título y CTA completos, accesos Guerra/Royale alcanzables, etiqueta de portada sin corte, navegación inferior sin colisión y tablero entero. El parche no altera el tamaño del tablero ni su cálculo de altura.
- **390×844:** etiqueta legible sobre el cristal, descripción y capítulo distinguibles, nombres bloqueados legibles, edificios/rótulos separados y modales sin desbordamiento horizontal.
- **Desktop:** el hero conserva su composición editorial; veladura limitada a la etiqueta; estados hover y foco diferenciados; ruta y panel de Aldea alineados.
- **Movimiento reducido:** no se introducen animaciones ni loops. Las respuestas existentes conservan sus reglas de reducción de movimiento.
- Ejecutar `SYNTAX OK` y las pruebas existentes al integrar. Esta revisión en navegador no representa una prueba en iPhone físico.

## Integración confirmada

El coordinador integró el parche dentro de `index.html` y comprobó que el HTML servido lo incluye. Revisión final en320×640,390×844 y desktop1280×720: sin desbordamiento horizontal, etiqueta de portada legible, Confite visible y tablero completo. Se guardaron [capturas y resultados](RENACER_QA.md). La suite final pasa60/60 y el script compila: SYNTAX OK. No se modificaron costes, reglas ni guardados como parte del pase visual.
