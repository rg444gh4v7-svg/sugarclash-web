# Renacer · recorrido automatizado del motor

Fecha de generación UTC: 2026-10-24T02:19:50.354Z. Semilla reproducible: `20261021`. Ejecutar `node scripts/renacer-playthrough.cjs`. Solo usa módulos incluidos en Node.

El script carga el JavaScript real de `index.html` en una VM y sustituye únicamente pintura, audio, ventanas y esperas de animación. Entra por `requestLevel()`, confirma el diálogo real de cada jefe (también prueba doble toque), y juega mediante `attemptSwap()`. Las victorias, estrellas, recursos y accesos los concede `finishBoard()`; no se modifica el guardado para avanzar.

El bot elige la jugada con mayor efecto inmediato visible: meta pendiente, 40 puntos de valoración por capa de restauración retirada y 60 por marca completada, más el valor aproximado de un poder creado (20 adicionales si quedan sellos de poder). Usa las reglas reales de restauración y la extensión de los brotes; considera el Pulso si está disponible. No muta la partida durante la evaluación ni anticipa caramelos nuevos o cascadas de relleno. Usa el Pulso de Confite al cargarlo. No usa martillos, barajados manuales, construcciones, gemas, continuaciones ni ayudas externas. La entrada reserva una vida; ganar la devuelve una sola vez y perder o abandonar la consume. Cuando no quedan vidas, avanza el reloj simulado 25 minutos y ejecuta la regeneración real. Cada nivel admite hasta diez intentos.

Resultado: **80/80 niveles**, 92 intentos y 12 derrotas. 71/80 victorias al primer intento. 8 esperas simuladas de 25 minutos (200 minutos), 251 Pulsos y 0 jugadas rechazadas. Guardado antiguo escrito: no.

| Territorio | Victorias | Intentos | Primer intento | Derrotas |
|---|---:|---:|---:|---:|
| 1 | 10/10 | 10 | 10/10 | 0 |
| 2 | 10/10 | 10 | 10/10 | 0 |
| 3 | 10/10 | 10 | 10/10 | 0 |
| 4 | 10/10 | 13 | 8/10 | 3 |
| 5 | 10/10 | 11 | 9/10 | 1 |
| 6 | 10/10 | 12 | 8/10 | 2 |
| 7 | 10/10 | 15 | 7/10 | 5 |
| 8 | 10/10 | 11 | 9/10 | 1 |

Esto verifica que el motor y sus puertas permiten recorrer la campaña con estas decisiones y esta semilla. No es una prueba manual ni una medida de dificultad humana, retención, calidad comercial o rendimiento en un teléfono. La pintura y los controles reales requieren sus propias comprobaciones en navegador. El detalle de cada intento está en [RENACER_PLAYTHROUGH.json](RENACER_PLAYTHROUGH.json).
