# Renacer · recorrido automatizado del motor

Fecha: 21 de octubre de 2026. Semilla reproducible: `20261021`. Ejecutar `node scripts/renacer-playthrough.cjs`. Solo usa módulos incluidos en Node.

El script carga el JavaScript real de `index.html` en una VM y sustituye únicamente pintura, audio, ventanas y esperas de animación. Entra por `requestLevel()`, confirma el diálogo real de cada jefe (también prueba doble toque), y juega mediante `attemptSwap()`. Las victorias, estrellas, recursos y accesos los concede `finishBoard()`; no se modifica el guardado para avanzar.

El bot elige la jugada con mayor efecto inmediato sobre la meta y el valor aproximado de un poder creado. No anticipa caramelos nuevos ni cascadas. Usa el Pulso de Confite al cargarlo. No usa martillos, barajados manuales, construcciones, gemas, continuaciones ni ayudas externas. La entrada reserva una vida; ganar la devuelve una sola vez y perder o abandonar la consume. Cuando no quedan vidas, avanza el reloj simulado 25 minutos y ejecuta la regeneración real. Cada nivel admite hasta diez intentos.

Resultado: **80/80 niveles**, 108 intentos y 28 derrotas. 68/80 victorias al primer intento. 24 esperas simuladas de 25 minutos (600 minutos), 277 Pulsos y 0 jugadas rechazadas. Guardado antiguo escrito: no.

| Territorio | Victorias | Intentos | Primer intento | Derrotas |
|---|---:|---:|---:|---:|
| 1 | 10/10 | 10 | 10/10 | 0 |
| 2 | 10/10 | 10 | 10/10 | 0 |
| 3 | 10/10 | 10 | 10/10 | 0 |
| 4 | 10/10 | 10 | 10/10 | 0 |
| 5 | 10/10 | 12 | 8/10 | 2 |
| 6 | 10/10 | 17 | 7/10 | 7 |
| 7 | 10/10 | 23 | 6/10 | 13 |
| 8 | 10/10 | 16 | 7/10 | 6 |

Esto verifica que el motor y sus puertas permiten recorrer la campaña con estas decisiones y esta semilla. No es una prueba manual ni una medida de dificultad humana, retención, calidad comercial o rendimiento en un teléfono. La pintura y los controles reales requieren sus propias comprobaciones en navegador. El detalle de cada intento está en [RENACER_PLAYTHROUGH.json](RENACER_PLAYTHROUGH.json).
