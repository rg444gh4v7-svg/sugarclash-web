# Mundo Vivo · V18 — cierre de integración

18 de octubre de 2026. Fuente verificada SHA-256:
`a1947554ea73a29548838747e36cec9f65af049becbed701393a1242de104a63`.

La dirección de la portada alcanza las 22 pantallas, las arenas dentro del canvas,
las escenas de modos y las capas de resultado. Campaña utiliza 80 monstruos
distintos (ocho atlas de diez); HEX utiliza otros veinte. Guerra muestra cinco
aliados y cinco adversarios distintos; Royale, nueve rivales distintos. Se añaden
diez edificios pintados, piezas de caramelo y materiales de cristal para HEX.
Los escenarios, retratos, selección y resultados mantienen los fallbacks nativos.

## Verificación

- 113/113 pruebas pasan, incluida compilación del script inline, progresión,
  recompensas, prácticas, celebraciones, geometría de atlas, cache y guardado.
- Recorrido automatizado del motor real: 80/80 niveles ganados, 8/8 entradas de
  jefe, 97 intentos, 17 derrotas y 471 intercambios legales. El informe completo
  está en [campaign-playthrough-v18.json](campaign-playthrough-v18.json).
- Navegador con origen local aislado y progreso de prueba: jefe de Mochi,
  tablero, ruta, Aldea y edificios, Guerra, Royale y HEX (intro, ruta y tablero).
  No se modificó el guardado de Jose ni el almacenamiento de producción.
- A 390×844 y 320×640 el tablero principal cabe completo. En 320×640 el tablero
  principal ocupa 248×283.75 y termina en y=614.625; HEX termina en y=560.76;
  el canvas de Royale termina en y=622.37. Sin desbordamiento horizontal.
- Sin errores de JavaScript en la revisión de navegador. Los 17 recursos v18
  están incluidos en el precache del worker `sugarclash-v18`.

La prueba de campaña es automatizada con reloj virtual y guardado en memoria;
no significa que se hayan jugado manualmente 80 niveles en un iPhone físico.
La mejora es visual: no acredita balance comercial, multijugador ni animación
esquelética de cada criatura. El movimiento usa las respuestas finitas y los
bucles de juego existentes, con movimiento reducido y pausas por visibilidad.

Arte, procedencia y prompts: [ART_ASSETS.md](ART_ASSETS.md). Preparación local de
atlas: `scripts/repack-atlas.cjs` (solo desarrollo, sin dependencia de runtime).
