# Renacer · restauración jugable

Jose autorizó las cuatro prioridades de la crítica: arte coherente, restauración táctica, encuentros distintos y consecuencias visibles de victoria. Implementación del23 de octubre de2026; verificaciones en UTC24 de octubre.

## Resultado implementado

- Atlas SVG original de ocho piezas, con confitería mate, siluetas y orden compatibles. Logo sobrio y mundo oscuro/descolorido conservados.
- Diez encuentros de introducción con seis reglas: limpiar encima, junto al borde, con dorado, con poder/Pulso, por etapas y bajo una fila de luz alterna. Las variantes y geometrías rotan en los otros siete capítulos. No se presentan como80 mecánicas originales.
- Suelo fijo independiente de identidad, poderes y gravedad de piezas. Cada marca tiene una o dos capas. Despertarla libera un brote que limpia vecinos ortogonales y puede activar poderes; el daño de suelo se evalúa una vez por oleada.
- La victoria de campaña requiere completar las marcas y la meta original. El Pulso conserva su doble luz y permite abrir sellos. La fila alterna cambia una vez tras una jugada válida completa; los errores y martillos no la alternan.
- Resultado con lugar concreto, estado anterior/recuperado, reacción de Confite, premio y siguiente construcción explícita. El atlas, la portada y la aldea recuerdan lugares mediante estrellas ganadas; no se crea un segundo guardado ni se construyen edificios automáticamente.
- Diario, Zen, Latido y arenas siguen accesibles. Se conserva el misterio de Confite hastaT8.

## Reglas y regresiones

`SYNTAX OK` y **97/97** pruebas (`node --test tests/*.test.cjs`). Incluyen28 pruebas de restauración sobre motor real: seis reglas, no mutación, capas, propagación, cascadas, poderes, meta doble, posición fija, cancelación, replay, renders sin premios y aislamiento de diario/Zen.

La revisión independiente encontró y cubrió dos fallos: distinguir el combo explícito de dos estrellas de una cascada extensa con estrellas separadas, y hacer idempotente el cobro de25 gemas al continuar (también ignorar un callback de una sesión anterior).

Recorrido real del motor: **80/80,92 intentos,12 derrotas**,71 victorias al primer intento,8 esperas simuladas de regeneración,251 Pulsos y0 movimientos rechazados. Sin compras, continuaciones, construcciones, victorias forzadas ni escritura de la clave antigua. [Informe](RENACER_PLAYTHROUGH.md) y [detalle](RENACER_PLAYTHROUGH.json). El bot conoce las reglas nuevas; esto no mide diversión, dificultad humana ni retención y no permite comparar directamente con el bot anterior.

## Navegador

Origen aislado `http://127.0.0.1:4203/`; no se cambió el guardado de Jose en4177 ni el de producción. Revisión en navegador emulado, no teléfono físico. Movimiento reducido del dispositivo respetado; ambas variantes de feedback también tienen pruebas automáticas.

Se ganaron mediante controles reales los encuentros1,2 y3: tutorial, bordes y color. En el segundo se restauraron las cuatro zonas antes de reunir todos los dorados y la victoria esperó a completar ambas metas. En el tercero el Pulso abrió las dos marcas restantes y entonces se concedió la victoria. El guardado mostró3 guardianes y12 movimientos.

Para inspeccionar encuentros posteriores se importó, mediante Ajustes/Revisar/Importar, una copia anónima producida por el recorrido completo del motor; no se inyectó progreso en el navegador. Se revisaron sellos de poder, puente por etapas, fila alterna y presentación de jefe. La fila cambió de3 a5 tras una jugada real. Abrir la introducción del jefe mantuvo2 vidas; la confirmación y doble confirmación también están cubiertas por pruebas.

-320×640: sin desbordamiento horizontal; tablero termina en539px, herramientas en594px e instrucciones en623px. Guerra/Royale terminan en554px, antes de navegación. Resultado de victoria538px de alto dentro del viewport, sin scroll interno necesario en el ejemplo comprobado.
-390×844: tablero termina en651px y herramientas en708px. Regla del encuentro visible antes del tablero.
- El texto de cada marca informa zona, capas y estado activo/en espera. `aria-busy` refleja las cascadas; las piezas conservan teclado y foco.

Evidencia en `docs/qa/restoration-*.jpg`: tablero320/390, portada320, victorias320/390 y farol alterno390. Las imágenes con avance pertenecen al guardado aislado deQA.

## Validación humana pendiente

No se reclutaron jugadores ni se inventaron métricas. [Protocolo de cinco personas](RESTORATION_PLAYTEST.md). Revisar especialmente si se comprende la meta doble, si se prepara el siguiente sello y si la alternancia de luz se siente justa. Los jefes del bot salieron a la primera: el clímax humano aún necesita validación.

## Offline y publicación

Pendiente de la comprobación final de esta iteración. La última publicación anterior permanece documentada en DEPLOYMENT_EXPEDITION.md; un commit o push no acredita despliegue.
