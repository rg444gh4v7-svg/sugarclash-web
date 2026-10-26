# Trabajar en Sugar Clash con Claude Code

Guía operativa, actualizada el 23 de octubre de 2026. `CLAUDE.md` carga las instrucciones del proyecto, su concepto y la única guía visual vigente. Este documento y los informes enlazados se consultan según la tarea.

## Empezar en la carpeta correcta

Abre `/Users/jose/Downloads/sugarclash-web` en Claude Code. Si ya tienes su comando disponible, puedes iniciarlo desde Terminal:

```sh
cd /Users/jose/Downloads/sugarclash-web
claude
```

El proyecto no requiere instalar paquetes ni compilar. Todo el juego nuevo está en `index.html`: HTML, CSS y JavaScript vanilla. Imágenes en la raíz y `assets/`, fuentes OFL incrustadas y sonido Web Audio. `manifest.json` y `service-worker.js` completan la PWA.

Antes de editar, revisa `git status --short` y los cambios existentes. Coordina quién modifica `index.html` si Codex y Claude trabajan a la vez. Conserva los cambios ajenos; no uses reset, checkout, limpieza o stash para apartarlos sin una instrucción de Jose.

## Qué versión continuar

La fuente actual es el runtime de la raíz, no `legacy/index.html`. `legacy/` conserva la edición anterior, sus instrucciones, pruebas e informes; su API histórica no describe Renacer. Tampoco son instrucciones vigentes los comentarios o documentos históricos de la etapa marfil/clara. La autoridad visual está en [VISUAL_STYLE.md](../VISUAL_STYLE.md): mundo dark/descolorido, color recuperado por progreso real y logo sobrio. Las decisiones nuevas de Jose prevalecen.

El 23 de octubre Jose autorizó cuatro mejoras: **coherencia visual, restauración táctica en el tablero, guardianes con reglas propias y consecuencias concretas al ganar**, con foco en los primeros diez niveles. La implementación de esta etapa pasó97 pruebas y un recorrido80/80. La evidencia actual está en [RESTORATION_QA.md](RESTORATION_QA.md); no extrapoles las pruebas anteriores ni declares publicación sin su informe. La expedición previa, con ruta real y regreso orgánico del color, tiene su evidencia en [EXPEDITION_QA.md](EXPEDITION_QA.md).

La última publicación documentada es el commit **`e94f27a7e6e69e702f8e35efe812bb5690b46ed1`**, servido en [sugarclash-web.vercel.app](https://sugarclash-web.vercel.app/), con despliegue READY y archivos comprobados byte por byte. Esa evidencia corresponde a esa versión, no a cambios posteriores. Consulta [DEPLOYMENT_EXPEDITION.md](DEPLOYMENT_EXPEDITION.md) al verificar o publicar; DEPLOYMENT_RENACER conserva la publicación inicial36aba63.

## Mapa del runtime

Busca las funciones por nombre con `rg`; los números de línea cambian.

| Área | Fuentes de verdad en `index.html` |
|---|---|
| Pantallas y sesiones | `state`, `showScreen()`, `navigate()`, `stopBoard()`; secciones `screen-home`, `world`, `modes`, `village`, `memories`, `settings`, `game`, `arena`. |
| Portada y ruta | `renderHome()`, `expeditionRoute()`, `restorationVisual()`, `renderWorld()`, `campaignNext()`, `continueCampaign()`, `TERRITORIES`, `LEVEL_NAMES_ALL`, `CAMPAIGN_ARCS`. |
| Entrada de campaña | `requestLevel()` → diálogo de jefe → `tryStartLevel()` → `spendLife()` → `startBoard()`. No saltarse esta cadena desde la UI o las pruebas. |
| Reglas puras | `newPiece()`, `runGroups()`, `legalMoves()`, `powerCreation()`, `expandEffects()`, `gravity()`, `reshuffle()`. Tablero plano con piezas `{id,color,power}`; hielo fijo en `g.ice`. |
| Encuentros y restauración | Bloque `RESTORATION_START` / `RESTORATION_END`: `RESTORATION_ENCOUNTERS`, `RESTORATION_CHAPTERS`, `encounterConfig()`, `makeRestoration()`, `restorationTargets()`, `restorationStep()`, `restoreWave()` y `campaignWon()`. |
| Comunicación de restauración | `renderRestoration()`, `restorationHint()`, `restorationRatio()`, `restoredPlaceArt()`, `restorationReceipt()` y `restoredPlaces()`. Marcas, regla activa, progreso doble y consecuencias derivadas de victorias. |
| Partida | `startBoard()`, `renderGame()`, `renderPieces()`, `bindBoard()`, `attemptSwap()`, `resolveBoard()`, `finishBoard()`. `state.run` e `isActive(g)` invalidan esperas antiguas. |
| Poderes y ayudas | `armPulse()`, `pulseNeed()`, `armHammer()`, `useHammer()`, `shuffleGame()`. La pieza y su poder conservan identidad al caer. |
| Diario, Latido y Zen | `dailyConfig()`, `dailySeed()`, `seededRandom()`, `startDaily()`, `launchMode()`. El diario usa fecha local y premio limitado a una vez por fecha. |
| Guerra y Royale | Bloque `ARENA_START` / `ARENA_END`: `arenaState`, `startArena()`, `stopArena()`, `pauseArena()`. IA local, canvas lógico 390×570, DPR máximo 2. |
| Respuesta cosmética | Bloque `FEEDBACK_START` / `FEEDBACK_END`: `feedbackHit()`, `feedbackCombo()`, `feedbackVictory()`, `feedbackCancel()`. Sin RNG del motor, premios ni persistencia. |
| Aldea | `BUILDINGS`, `buildingOpen()`, `renderVillage()`, `inspectBuilding()`, `buildStructure()`. Inspeccionar no compra; construir valida requisitos y miel. |
| Persistencia | `defaultSave()`, `normalizeSave()`, `loadSave()`, `persistSave()`, `syncLives()`, `livesMax()`. |

Reglas que conviene comprobar antes de tocar la progresión: ocho capítulos de diez niveles; nueve victorias de una estrella abren al jefe. Una vida se reserva al entrar en campaña y vuelve una sola vez al ganar; perder o abandonar la consume. Los otros modos no gastan vidas. Los renders no conceden progreso y una celebración no concede premios.

## Restauración integrada

La especificación legible está en [RESTORATION_ENCOUNTERS.json](RESTORATION_ENCOUNTERS.json): diez encuentros T1 y cuatro líneas de consecuencias por capítulo T2–T8. El runtime empaqueta sus datos en `RESTORATION_ENCOUNTERS` y `RESTORATION_CHAPTERS` dentro del único HTML; no los descarga durante la partida. Si cambias datos, mantén sincronizados la especificación y el runtime y valida el comportamiento real.

`g.restoration` contiene casillas del **suelo** con índice, capas y estado: no se intercambian ni caen con los caramelos. No son obstáculos nuevos al movimiento. `restorationStep(rest,board,size,cleared,{powered,pulse,protectedIndex})` calcula el nuevo estado y los brotes; `restoreWave()` lo aplica a la cascada y permite encadenar poderes. La protección de un especial recién creado debe seguir respetándose.

Las seis condiciones son `direct` (limpiar encima), `adjacent` (encima o vecino ortogonal), `power` (alcanzar con poder o Pulso activo), `ordered` (primera casilla pendiente, una etapa por cascada), `color` (dorado 3 encima/adyacente; poderes o Pulso también cuentan) y `tide` (fila activa que cambia tras una jugada válida; T1 usa dos filas). Cada encuentro introduce como máximo una condición nueva; no sustituir diferencias tácticas por metas más altas.

La victoria de campaña requiere **meta habitual y todas las zonas restauradas**. Usa `campaignWon(g)` tanto al terminar turnos/ayudas como en `finishBoard()`; comprobar sólo puntos permite victorias incompletas. `restorationRatio()` comunica ambas dimensiones, pero una proporción visual no concede victoria. El diario y los otros modos conservan su acceso/economía y no reciben zonas de campaña por defecto.

Los lugares recuperados se derivan de las victorias existentes con `restoredPlaces()`. `restorationReceipt()` comunica lugar, cambio y frase de Confite al ganar; no concede construcciones ni un premio adicional. No persistas progreso por dibujar escenas o mostrar consecuencias.

El recurso `assets/candies-restoration-v1.svg` está integrado y cacheado en renacer-v5: atlas original1280×640/4×2, colores0–5, estrella y chocolate. Revisado en320×640/390×844 y después de apagar el servidor. Las escenas Antes/Recuperado usan geometrías distintas, no sólo otro filtro de color.

[RESTORATION_PLAYTEST.md](RESTORATION_PLAYTEST.md) contiene el protocolo humano de cinco personas y diez minutos iniciales. Es un plan sin resultados; las reglas que los participantes no alcancen no se consideran probadas.

## Guardados y pruebas sin tocar los datos de Jose

- Renacer escribe **`sugarclash_renacer_v1`** mediante `persistSave()`. Campos nuevos requieren valor por defecto y normalización.
- **`sugarclash_save_v1`** pertenece a la edición antigua. `loadSave()` puede leerla para recuperar progreso compatible; nunca escribirla, borrarla ni reemplazarla para actualizar.
- El puerto **4177** ya se ha usado como origen personal de Jose. No borres sus datos, importes fixtures ni escribas progreso de prueba allí. La producción también conserva datos del jugador.
- Usa un origen de QA separado, por ejemplo **`http://127.0.0.1:4199/`**, o un perfil de navegador aislado. Un puerto distinto tiene almacenamiento separado. Comprueba que estás en ese origen antes de jugar pruebas o revisar offline.
- Recorre las entradas reales. No invoques funciones de victoria, escribas estrellas o alteres monedas para presentar una partida como jugada. El script de recorrido ya usa guardado y reloj aislados.

Servidor local sin dependencias de proyecto:

```sh
python3 -m http.server 4199 --bind 127.0.0.1
```

Abre `http://127.0.0.1:4199/`. Si el navegador muestra una edición antigua, comprueba la versión del worker y la respuesta servida en ese origen de QA; no resuelvas una actualización borrando el progreso personal.

## Validación

Después de cada edición de `index.html`:

```sh
node -e "const h=require('fs').readFileSync('index.html','utf8');new Function(h.slice(h.indexOf('<script>')+8,h.lastIndexOf('</script>')));console.log('SYNTAX OK')"
node --test tests/*.test.cjs
git diff --check
```

Si `node` no está en PATH en este Mac:

```sh
export PATH="$HOME/.nvm/versions/node/v26.5.1/bin:$PATH"
```

Para cambios de reglas, metas, acceso, economía o guardado, ejecuta además:

```sh
node scripts/renacer-playthrough.cjs
```

El cierre histórico previo a las reglas tácticas registró **69 pruebas aprobadas y 80/80 niveles**, 108 intentos y 28 derrotas, sin escribir la clave antigua. Es una referencia reproducible, no una validación de la restauración nueva. Vuelve a ejecutar suite y recorrido sobre el runtime actual, incluyendo la meta doble y las seis reglas, y usa su resultado real al informar. [Método y límites anteriores](RENACER_PLAYTHROUGH.md).

Revisa las pantallas afectadas a **320×640**, **390×844** y escritorio: tablero y controles completos, foco de teclado, restauración real a 0/intermedia/1 y ausencia de scroll horizontal. En arenas, prueba pausa, regreso y limpieza; con efectos, movimiento reducido, ocultación y silencio. Los cambios de recursos o PWA necesitan comprobar carga, manifest, catálogo de caché y recarga offline en QA. [Evidencia anterior](DARK_COLOR_QA.md) solo cuando resulte pertinente; emular móvil no equivale a probar un teléfono físico.

## Publicar cuando Jose lo pida

1. Termina y valida el cambio local; revisa el diff y conserva la identificación del commit que vas a publicar.
2. Usa la cuenta y la herramienta Vercel disponibles para ti. El proyecto existente es **`sugarclash-web`**, organización **`pulsarproyects`**. Confirma ese destino y la vinculación local antes de desplegar; `.vercel/` es configuración local ignorada por Git.
3. Con Vercel CLI estándar disponible en PATH y el proyecto ya vinculado, una publicación de producción se ejecuta desde esta carpeta con `vercel deploy --prod --scope pulsarproyects`. Si tu entorno requiere vincular o autenticar, usa su flujo normal; no copies credenciales ni dependas de binarios dentro de cachés privadas de Codex. No crees otro proyecto por defecto.
4. Un push o la salida inicial de un comando no confirman publicación. Comprueba estado READY/production, alias público y versión realmente servida en [la URL existente](https://sugarclash-web.vercel.app/). Verifica HTML, worker, manifest y recursos cambiados; identifica la versión y contrasta contenido o hashes.
5. Actualiza la evidencia de publicación con el resultado real. No atribuyas a un nuevo cambio las verificaciones de commits anteriores ni anuncies pruebas comerciales, ingresos o teléfono físico sin haberlas realizado.

Estos pasos no envían mensajes a Claude ni cambian permisos, cuentas o datos privados. Cada herramienta mantiene su autenticación habitual.

## Prompt listo para Jose

Después de abrir esta carpeta en Claude Code, pega esto y sustituye la última línea por tu encargo:

```text
Trabaja en este proyecto Sugar Clash · Renacer. Lee CLAUDE.md y sus instrucciones importadas. Consulta docs/CLAUDE_HANDOFF.md solo para localizar el arranque, las funciones, las pruebas o la publicación que necesites.

Conserva Dulcelandia, Confite, el logo sobrio y la dirección actual dark/descolorido frente al color que vuelve por progreso real. El juego vigente es index.html de la raíz; no uses legacy ni la etapa marfil como base. La restauración táctica del23 de octubre está integrada y validada técnicamente: revisa RESTORATION_QA.md y sus límites; usa campaignWon() para la meta doble. No cambies reglas o economía como parte de un ajuste visual.

Revisa git status y respeta cambios existentes de Codex. Prueba en un origen aislado distinto del puerto 4177 y de producción; no alteres mis guardados. Implementa y valida mi encargo, indica qué comprobaste y no afirmes que está publicado sin verificar un despliegue de esa versión.

Mi encargo: [escribe aquí el cambio que quieres].
```

El combo global de dos estrellas se comunica explícitamente mediante `globalPrism` en `resolveBoard()`/`restoreWave()`; no inferirlo por el número de casillas limpiadas. El callback de continuar cobra gemas una sola vez y rechaza sesiones obsoletas. Hay regresiones para ambos casos.

## Publicación anterior de restauración · 24 de octubre de2026

El runtime de restauración está publicado como `fb9388f` en https://sugarclash-web.vercel.app/. EstadoREADY, raíz y ocho archivos críticos comprobados (la raíz se verifica aparte);40 recursos de precachéHTTP200. [Informe](DEPLOYMENT_RESTORATION.md). La guía y los informes pueden tener commits documentales posteriores sin cambiar el runtime publicado. Las comprobaciones humanas siguen pendientes. No volver a desplegar sólo para repetir la evidencia.

## Iteración posterior · El mundo responde

Jose pidió más gracia y cerrar la mejora. Está integrada en el runtime con110 pruebas aprobadas. El informe [PLAY_CHARM_QA.md](PLAY_CHARM_QA.md) distingue las partidas reales de QA, las medidas de320×640/390×844/1280×720 y la recarga sin servidor. [DEPLOYMENT_PLAY_CHARM.md](DEPLOYMENT_PLAY_CHARM.md) identifica la publicación de esta etapa; fb9388f y su informe anterior permanecen como historial.

- `PLAY_SCENE_START/END`: `playSceneState(g)`, `playSceneArt(kind,progress)`, `playScene(g)` y `updatePlayScene(g,host?)`. Geometría por restauración real; el host conserva identidad y sólo reemplaza SVG cuando cambia fase o tipo. `renderGame()` coloca escena/Confite y `updateGameHUD()` actualiza su estado. Sin guardar ni conceder progreso.
- `FEEDBACK_START/END`: `feedbackBeginTurn(g)` captura la jugada válida o martillo; `feedbackHit()` recoge hechos antes de la caída; `feedbackTurn(g,quiet=false)` genera un único resumen y una reacción elegible al terminar. `finishBoard()` llama a la variante quiet después de validar y antes de cerrar. `feedbackPower()` y `feedbackRestoration()` dibujan efectos finitos; `feedbackCancel()` descarta turno, historial, clases, partículas, timers y voces al abandonar/cambiar/ocultar.
- `PLAY_LINES` contiene39 reacciones y `PLAY_OPENINGS` diez aperturas de T1. Selección determinista sin RNG; tres apartes por tramo activo y separación de dos jugadas. Completar el lugar puede añadir una observación si falta la otra meta. No se integró el catálogo propuesto de frases de derrota.
- La voz se muestra en `board-tip` y se identifica con `data-speaker`. `setTip()` lo limpia para instrucciones/pistas posteriores; la regla del encuentro permanece en la cabecera. Ocultar la página descarta también el historial efímero. No persistir frases vistas.
- Los archivos `docs/art/PLAY_*` conservan arte, CSS y texto de integración. El runtime no los solicita por red. El worker usa **renacer-v6**; se conserva el catálogo anterior de40 recursos. No se añadieron dependencias, reglas, premios ni campos del guardado.

Mantén el reinicio de `g.restoredThisTurn` al empezar martillo; evita atribuir al intento actual el brote de una jugada anterior. Las13 pruebas nuevas en `tests/feedback.test.cjs` cubren separación de creación/activación, HP parcial, resumen quiet, categorías agotadas, silencio, movimiento reducido y limpieza. El recorrido80/80 anterior valida sus reglas y su versión; no se ha repetido ni presentado como una nueva prueba de diversión para esta capa.

La etapa El mundo responde está publicada como e484ffb en la URL existente, READY/production, con raíz y ocho archivos críticos idénticos y 40 recursos disponibles. Consulta DEPLOYMENT_PLAY_CHARM.md y su JSON. Los commits posteriores de documentación no requieren otro despliegue si no cambian el runtime.


## Etapa posterior · Navegación e interfaz

La composición vigente es Inicio/Campaña/Modos/Aldea. Consulta NAVIGATION_QA.md y DEPLOYMENT_NAVIGATION.md para evidencia y publicación; e484ffb queda como la publicación anterior. NAV_ITEMS/SCREEN_LABELS/renderNav definen nombres y contexto. navigate valida destinos propios, protege sesiones activas y enfoca/anuncia la vista tras renderizar. navigationOrigin captura la vista de entrada; g.returnTo y arenaState.returnTo son transitorios, nunca campos de save. Reintentar y seguir campaña conservan el origen.

Campaña usa renderWorld con selector chapter-select y niveles del capítulo mostrado. Inicio usa NAV_HOME.js integrado, sin diez hitos clicables. Modos y Aldea se han reconstruido en la capa inline; docs/art/NAV_* guarda las fuentes y decisiones. El primer detalle de Aldea selecciona la siguiente construcción disponible, sin comprarla. settingsReturn es sólo estado de UI.

pauseBoard y arenaExit rechazan callbacks de sesiones reemplazadas. Arena pide confirmación al navegar; cancelar respeta su pausa anterior. Salir de Zen guarda la marca y llega al destino solicitado. Los modales dejan #app inerte y su trap contempla foco inicial o externo. Mantener limpieza de sesiones, validación de entrada y cobro de vidas existentes.

125 pruebas, incluidas 15 de navegación, y recorrido 80/80 actualizados. Worker renacer-v7, mismos 40 recursos. No cambiar reglas, costes o premios como parte de estas pantallas. El servidor QA usado fue 4205; no toca 4177 ni producción.
