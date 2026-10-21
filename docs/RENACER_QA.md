# Renacer · comprobaciones de esta reconstrucción

Versión local del 21 de octubre de 2026. No es una publicación en Vercel/Poki/CrazyGames ni una prueba en teléfono físico.

## Motor

`node --test tests/*.test.cjs`: **69 pruebas aprobadas**. Cubren reglas de tablero, poderes/gravedad/cadenas, guardado y migración, vidas reservadas/devueltas, puertas y jefes, reto diario, cancelación de sesiones, combate, controles, pausa y caché offline. JavaScript de `index.html` y `service-worker.js` compila: **SYNTAX OK**. `git diff --check` pasa.

El recorrido real usa una semilla reproducible y decisiones legales sobre el motor actual: **80/80 niveles, 108 intentos, 28 derrotas, 24 esperas simuladas y cero jugadas rechazadas**. No se fuerzan victorias ni se compran ayudas. El bot utiliza el Pulso manual; el reloj avanza al agotarse vidas. [Método y resultados](RENACER_PLAYTHROUGH.md).

## Revisión visual vigente

El cierre oscuro/descolorido y color recuperado está en [DARK_COLOR_QA.md](DARK_COLOR_QA.md), con logo/paisaje nuevos,69 pruebas, partida ganada real, capturas320/390/desktop y recarga offline. Las capturas siguientes conservan el historial de la primera reconstrucción.

## Navegador

Se usaron orígenes de prueba separados del origen de los datos anteriores de Jose. No se borró almacenamiento. El guardado antiguo se lee únicamente para migrar; las pruebas automatizadas confirman que no se escribe su clave.

Comprobaciones observadas en el navegador integrado:

- Portada desktop1280×720 y móvil320×640/390×844. Navegación, comienzo de campaña, accesos directos a Guerra/Royale y Ajustes.
- En320×640: ancho del documento320, sin desbordamiento horizontal. Confite termina en y546 y la navegación empieza en y574; permanece visible. Tablero y controles caben tras compactar cabecera/escena.
- Primera partida por el botón real: reserva una vida. Dos toques sobre las piezas enseñadas crean un rayo persistente; un movimiento consumido, luz y Pulso actualizados. Confite se conserva dentro del botón Pulso.
- Diario real: entrada sin gastar vida, ocho movimientos visibles elegidos desde el tablero y Pulso manual; victoria con1518/1500 de luz. Entrega40 de miel y5 gemas, y portada cambia al estado completado.
- Con esa miel ganada: inspección del Puesto de Caramelos, construcción explícita por40, saldo0, segundo edificio construido y Fuente de Miel como siguiente requisito. No se editó el guardado para conceder recursos.
- Guerra5v5 y Royale: render real en canvas, controles visibles, estados de vida/tiempo, marcas de ataque, pausa explícita y Confite. Instrucciones móviles y teclado adaptadas al tamaño. Los resultados de combate se prueban adicionalmente con simulaciones del motor.
- Exportación/importación, límite de vidas, diarios repetidos y puertas se cubren con pruebas automatizadas; no todos sus casos extremos se recorrieron manualmente en la UI.
- Sin errores o avisos de consola durante el recorrido inspeccionado. La app nueva no contiene solicitudes remotas de fuentes; Fraunces/Karla están empaquetadas.

La caché offline se verifica con pruebas del service worker y respuestas de red simuladas, incluyendo aislamiento del HTML antiguo. No se afirma una sesión offline manual completa de todos los modos.

## Pendiente

Sesiones observadas con jugadores según el [estudio de mercado](MARKET_STUDY_RENACER.md), rendimiento en teléfonos físicos, aceptación/integración del SDK de un portal y comprobación del despliegue cuando se solicite publicar. Las victorias de un bot y una inspección de navegador no miden diversión, retención ni ingresos.

## Cierre del pase visual

Integrado el CSS del agente visual y comprobado en320×640,390×844 y desktop1280×720 con la versión realmente servida. El indicador de portada utiliza una veladura localizada; los bloqueos conservan texto legible. Se confirmó que el documento sigue midiendo320px en320px y que Confite termina antes de la navegación. Una combinación realizada con Enter en Jardín en calma conserva el foco dentro del tablero tras eliminar/caer piezas; los atajos de arena respetan botones enfocados.

Capturas de esta versión: [desktop](qa/renacer-desktop.jpg), [móvil390](qa/renacer-mobile-390.jpg) y [tablero320](qa/renacer-board-320.jpg). La inspección del guardado de prueba se realizó mediante su copia visible exportada y confirmó que no importó datos antiguos.
