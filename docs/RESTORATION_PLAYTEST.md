# Restauración · prueba humana de los primeros diez minutos

Protocolo para **cinco personas que no conozcan esta edición**. Está preparado para ejecutar; no registra participantes, sesiones ni resultados realizados. La prioridad de producto son los primeros diez niveles, pero cada sesión inicial dura diez minutos: no se presupone que alguien llegue al jefe.

## Preparación

- Usa la misma versión identificada por commit, dispositivo y viewport. Cada persona empieza en un perfil nuevo o un origen de QA propio, separado del puerto 4177 y de producción. Conserva los guardados personales de Jose.
- Asigna P1–P5 y anota experiencia previa con match-3: ninguna, ocasional o frecuente. No hacen falta nombres.
- Un observador registra tiempos y decisiones. No describe reglas antes de entrar, no recomienda intercambios y no cambia recursos, vidas o progreso. Si ayuda a desbloquear una confusión, anota momento y frase exacta; lo posterior ya no cuenta como comprensión sin ayuda.
- Comprueba antes que el dispositivo puede jugar, que no hay zoom accidental y que la versión es la correcta. Un fallo técnico durante la sesión se registra como tal, no como aburrimiento o dificultad.

## Sesión de diez minutos

1. **Inicio, minuto 0:** «Empieza y juega como lo harías si acabaras de encontrar este juego. Puedes parar cuando quieras». No sugieras que debe gustarle.
2. **Minutos 0–8:** deja jugar. Registra tiempo hasta la primera jugada válida, niveles e intentos, aperturas de ayuda, abandono y decisiones ante las marcas. Al aparecer una regla que la persona todavía no ha visto, pregunta una sola vez «¿Qué crees que tienes que hacer aquí?»; no corrijas la respuesta. Anota también si una jugada posterior demuestra que la comprendió.
3. **Minutos 8–10:** deja terminar el turno y pregunta «¿Qué faltaba para ganar ese nivel?», «¿Qué cambió en el mundo al ganar?» y «¿En qué momento te aburriste, si ocurrió?». Pide aburrimiento de 1 (nada) a 5 (mucho), sin interpretar una pausa de planificación como aburrimiento.
4. **Al cerrar los diez minutos:** ofrece una elección neutral: «¿Prefieres otra partida, cambiar de modo o dejarlo aquí?». Si elige otra y dispone de tiempo, observa si inicia voluntariamente un intento adicional; esa extensión se registra aparte. Una respuesta amable no equivale a una partida repetida.

No fuerces acceso a un nivel avanzado para completar la tabla. Las reglas que no aparezcan se marcan **NV: no vista**. Si nadie alcanza una regla del nivel 5–10, esa parte del diseño sigue sin prueba humana; necesita otra sesión, sin mezclarla con las métricas de inicio.

## Registro por persona

| Dato | Qué registrar |
|---|---|
| Versión y contexto | Commit, P1–P5, experiencia, dispositivo, viewport y origen de QA. |
| Primera acción | Segundos hasta pulsar Jugar y hasta la primera jugada válida. Confusión concreta, si la hay. |
| Regla de cada encuentro visto | Respuesta literal y puntuación 0–2: **0** no la explica o explica otra cosa; **1** reconoce marcas/meta pero no cómo actuar; **2** explica dónde y con qué acción restaurar y lo demuestra sin ayuda. |
| Meta doble | Si distingue entre completar las zonas y cumplir la meta de luz/recolección/hielo. Anota si cree haber ganado al llenar sólo una. |
| Intentos sin salir | Por nivel: entradas, victorias, derrotas y abandonos. Tras una derrota, cuenta reintentos iniciados por voluntad propia antes de salir a Inicio/Atlas/otro modo. Si no hubo derrota, escribe NA; no inventes una decisión de reintentar. |
| Táctica observada | Una decisión concreta relacionada con marcas, color, poder, orden o fila activa. No contar como táctica una explicación sugerida por el observador. |
| Consecuencia de ganar | Qué lugar o cambio recuerda sin volver a leer el resultado. «Gané monedas» se anota distinto de reconocer una restauración. |
| Aburrimiento | Valor 1–5, momento, comentario literal y si provocó abandono o cambio de modo. |
| Ganas de otra partida | Elección final y si inició realmente otro intento. Separar intención expresada de conducta observada. |
| Intervenciones y fallos | Ayuda dada, pérdida de foco, controles inaccesibles, errores o pausas técnicas. |

## Criterios para decidir la siguiente corrección

Son umbrales de una prueba pequeña para orientar trabajo, no estimaciones de retención ni aprobación comercial.

- **Entrada comprensible:** al menos 4/5 hacen su primera jugada válida antes de 60 s sin ayuda de reglas. Si fallan 2 o más, corrige el punto de entrada observado antes de añadir contenido.
- **Reglas comprensibles:** por cada regla, informa `comprenden / personas que la vieron`, incluyendo NV aparte. Si 2 personas tropiezan en el mismo significado o superan 90 s sin entender cómo afectar una marca, corrige esa señal/instrucción y vuelve a probar. No atribuyas al balance un objetivo que no se entendió.
- **Victoria comprensible:** al menos 4/5 de quienes vean ambas metas pueden explicar que hacen falta las dos; informa el denominador real. Una barra completa con zonas pendientes no debe parecer un error del juego.
- **Consecuencia recordable:** al menos 3 personas que hayan ganado identifican un lugar o cambio, además del premio. Si no, revisa la comunicación de ese resultado concreto.
- **Ritmo y deseo de seguir:** anota cuántos reintentan tras perder y cuántos eligen/inician otra partida al terminar. Tres inicios voluntarios de cinco son una señal favorable para seguir probando, no prueba de retención. Si 2 o más valoran aburrimiento 4–5 o abandonan por repetición en el mismo tramo, vuelve a ese tramo; no lo tapes con más premios.
- **Bloqueos:** cualquier fallo que impida jugar, continuar o conservar progreso se arregla antes de interpretar diversión o dificultad.

Después de las cinco sesiones, resume sólo lo observado: reglas vistas, confusiones repetidas, conductas de reintento, comentarios y el cambio que se probará a continuación. Conserva celdas vacías o NV cuando falten datos. Este archivo no debe completarse con jugadores o resultados simulados.
