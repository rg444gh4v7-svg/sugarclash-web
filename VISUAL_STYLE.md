# Sugar Clash — guía visual compartida

Referencia de continuidad para Claude y Codex. Actualizada el 17 de octubre de 2026.
Dirección vigente: **Atlas y Ecos**. Base publicada: commit `4590f94`.
Leer antes de modificar gráficos, pantallas, mapas, animaciones o modalidades.
Las decisiones nuevas de Jose prevalecen; no cambiar la dirección artística por iniciativa propia.

## Prioridad de usabilidad aprobada · 17.10

Jose indicó que el juego tenía demasiados menús y las modalidades no se encontraban.
La portada ahora ofrece **Jugar/Continuar historia, Guerra 5v5 y Royale** sin pasos
intermedios. «Todos los modos» muestra nombres de juego claros, instrucciones
breves y acciones jugables; «Archivo/Ecos» queda como contexto narrativo secundario.
En el mundo, los accesos a modos están arriba y Continuar aparece antes del paisaje.
No volver a ocultar los botones bajo panoramas, desplegables o nombres de lore.

Separar **acceso al juego** de **acceso al recuerdo**. Guerra/Royale pueden jugarse
en práctica gratuita antes de su requisito narrativo. `startMode(id,origin)` elige
práctica según `minigameUnlocked()` y recuerda desde dónde volver. Solo estado de
sesión: `minigamePractice`, `modeReturnScreen`; no añadir campos al guardado.
Práctica no entrega monedas, coronas, victorias, logros, anuncios de revivir ni
memorias. `showPracticeResult()` termina antes del flujo de premios. Reintentar
mantiene práctica; Volver regresa a su origen. `startMinigameChapter()` conserva
la entrada narrativa con requisitos. Cuando el recuerdo es accesible, el mismo
botón inicia el modo normal. La validación de usabilidad no demuestra todavía
que la jugabilidad pueda competir con Candy Crush.

## Qué conservar

Fantasía de confitería melancólica: dulce en la superficie, misterio y memoria en el
fondo. Un mundo ilustrado que se restaura, no una colección de minijuegos genéricos.
Jose rechazó la apariencia demasiado infantil, los logos genéricos y las pantallas
simples de tarjetas con emojis. Quiere profundidad, emoción y una historia coherente.

- Paisaje protagonista, interfaz discreta: relieve facetado, roca, arquitectura,
  vegetación, agua, niebla y luz en varios planos. Añadir detalle con intención,
  sin tapar fichas, enemigos, barras de vida ni zonas táctiles.
- Morados oscuros y minerales con oro cálido. No devolver toda la interfaz al
  neón amarillo/cian heredado. Los territorios conservan sus colores propios;
  el contraste sirve para leer el juego, no para hacer brillar todo a la vez.
- Confite es el ancla emocional: conservar silueta, aspectos, emociones y presencia.
  Usar `confiteSVG()`; no redibujarlo como otra mascota ni sustituirlo por un trofeo.
- Un panorama, un propósito narrativo y una acción principal clara por vista.
  Recursos y progreso deben venir del guardado real, nunca de cifras decorativas.
- Estados distinguibles: próximo, completado y bloqueado. El bloqueo puede apagar
  color, pero debe conservar legibilidad y explicar el requisito.

## Vocabulario visual

| Uso | Referencia actual en `index.html` |
|---|---|
| Fondo | `--dark: #0D0015` |
| Acento de interfaz | `--atlas-gold: #E8C795` |
| Texto secundario | `--atlas-muted: #AAA4B8` |
| Superficie | `--atlas-surface: #231D32` |
| Bordes | `--atlas-line: #443B55` |
| Títulos y frases emocionales | Fraunces, pesos 400–600 |
| Datos, instrucciones y controles | Karla |

Reutilizar las variables existentes; estos valores documentan la base, no crean
otro sistema de temas. Las variaciones de HEX y de cada territorio son deliberadas.
Paneles de borde fino, esquinas suaves, sombras contenidas; evitar rejillas de
tarjetas idénticas, emojis protagonistas, reflejos plásticos y adornos sin función.

## Dónde y cómo está implementado

Todo el runtime sigue en **`index.html`**, HTML/CSS/JS vanilla. Sin frameworks,
bundler ni dependencias nuevas. `title-world-v3-hd.jpg` es el raster protagonista
existente; el arte nuevo del atlas y de los modos es SVG inline o canvas nativo.

| Área | Fuente de verdad visual y restricciones |
|---|---|
| Campaña | `renderCampaignMission()`, `campaignNext()`: territorio real, paisaje, hito, Confite y Continuar. El atlas completo sigue en `#world-atlas`. |
| Mochi | `MOCHI_ATLAS_ART`, `mochiLandscapeSVG()`: SVG exacto de Figma; 390×440 en campaña, encuadre 360×210 en vistas compactas. No reemplazar por un placeholder. |
| Otros territorios | `territoryLandscapeSVG()`, `territoryEmblemSVG()`, `atlasFeeling()`: ocho identidades, restauración y frases ambientales ligadas al progreso. |
| Aldea | `villageBuildingSVG()`, `renderVillage()`: escena con camino y diez construcciones. Tocar inspecciona; construir requiere acción explícita. No volver a una cuadrícula de iconos. |
| Modos y recuerdos | `renderQuickModes()`, `startMode()`, `renderMinigames()`: juego accesible con nombres claros; `echoSceneSVG()` conserva panoramas de cada Eco y los recuerdos van en un apartado secundario. |
| MOBA / Royale | `minigameArenaArt()`, `minigameDrawUnit()`, `mobaRender()`, `brRender()`: arenas distintas, fondos estáticos reutilizados, unidades legibles. Las ruinas decorativas no cambian las colisiones. |
| Supervivencia | Comparte `screen-game`; `goTo('survival')` llama a `startSurvival()` sin pantalla intermedia. `survival-mode`, panorama del Latido y temporizador en segundos; no mostrar los movimientos internos 9999. |
| HEX CLASH | `dgLandscapeSVG()`, `dgSymbolSVG()`, `dgSceneMarkup()`: ruinas minerales, arco, cristales, relicario y piezas facetadas. Ruta de 20 hitos, no cuadrícula. Confite también en resultados. |
| Liga / Diario / Lienzo | Mantener el lenguaje común sin borrar su propósito: rivalidad, regreso diario y recuperación de una ilustración. Reutilizar el tablero compartido y su `data-mode`. |

Referencia Figma de composición:
[Atlas móvil · nodo 2:40](https://www.figma.com/design/WAa4LmTJ9Cd3ZhS3WIpL3E?node-id=2-40).
El diseño original muestra Mochi; la app adapta esa composición al progreso real.
No usar enlaces temporales de assets de Figma en producción. Si Figma no está
disponible, conservar el SVG y la implementación existente; no bloquear un ajuste local.

## Movimiento, móvil y rendimiento

- Movimiento con significado: respiración de Confite, pétalos, agua, pulso,
  intercambios, caídas y respuestas a una acción. No animar todos los paneles.
- Respetar `prefers-reduced-motion`, `.page-hidden`, pantalla activa y visibilidad
  de escenas. Reutilizar `observeAtlas()` y `syncVisualVisibility()` donde corresponda.
- No añadir timers o RAF perpetuos para decoración. Reutilizar el loop de combate;
  conservar la cancelación por `boardRun` de las animaciones del tablero.
- Canvas Retina con DPR máximo 2. `minigameCanvasContext()` configura el buffer;
  punteros y dibujo usan MOBA_W/H o BR_W/H lógicos, no el tamaño físico del buffer.
- IDs SVG únicos por contexto y territorio/modo; todos los `url(#id)` deben resolver.
- Revisar 320×640 y 390×844: sin desbordamiento horizontal, controles alcanzables
  y fichas completas. Las pantallas HEX necesitan `position:absolute;inset:0`;
  `position:relative` hace crecer el contenido y puede dejar niveles fuera de alcance.

## Historia y reglas que un rediseño no puede alterar

Corrección funcional aprobada · 17.10: los jefes necesitan las nueve victorias
anteriores, no tres estrellas por nivel. `campaignUnlockedLevel()` reconcilia
victorias contiguas con el acceso ya guardado, sin quitarlo ni escribir desde un
render. `bi-sub` y `bi-access` deben existir en el diálogo; probar la entrada real,
no llamar `startLevel()` saltándose intro/vidas. Informe: `docs/PLAYTHROUGH_REPORT.md`.

Mejora táctica · 17.10: los ataques de IA de Guerra/Royale muestran una marca fija
de preparación y comprueban posición/rango al impactar. Esquivar puede evitar daño;
Pulso interrumpe enemigos cercanos. Mantener visibles las marcas sin tapar unidades
y conservar mouse/táctil. No confundir estos cambios con balance comercial probado.

Los recuerdos de los Ecos se desbloquean en orden: Latido (300 puntos) → Guerra
(victoria) → Grieta (podio). Esto no bloquea las partidas de práctica. Consultar
`MINIGAMES`; no revelar recuerdos bloqueados ni adelantar
la revelación final de Confite, reservada al epílogo del territorio 8.
No inventar historia, monedas, progreso o poderes para rellenar una composición.

No cambiar balance, guardados, costes o requisitos bajo la etiqueta «mejora visual».
Conservar `sugarclash_save_v1`, vidas y anuncios siempre opt-in. Nunca borrar datos
para actualizar. MOBA/Royale/Liga siguen siendo locales contra IA: no prometer
multijugador real, ingresos ni anuncios conectados.

## Ciclo de trabajo económico

1. Leer esta guía y solo las funciones/referencias relevantes. Reutilizar arte y
   componentes existentes; no generar imágenes, instalar plugins ni reconstruir
   Figma si el cambio se resuelve con el código nativo.
2. Hacer una mejora acotada y verificar el resultado; evitar loops abiertos de
   rediseño. No cambiar modelo sin avisar a Jose previamente.
3. Validar sintaxis del script tras cada edición y ejecutar
   `node --test tests/*.test.cjs`. Base al 17.10: 84 pruebas, no un límite fijo.
4. Revisar las pantallas afectadas en navegador. Usar progreso de prueba aislado,
   no sobrescribir el de Jose. Distinguir pruebas de navegador de iPhone físico.
5. Al publicar cambios de app: actualizar caché cuando corresponda, comprobar
   Vercel y versión servida. Un push no garantiza despliegue. Documentación sola
   no requiere desplegar ni cambiar el service worker.
6. Registrar una decisión visual nueva aquí y enlazar desde los archivos de agente;
   mantener una sola guía compartida en lugar de instrucciones divergentes.
