# Trabajar en Sugar Clash con Claude Code

Guía operativa, actualizada el 22 de octubre de 2026. `CLAUDE.md` carga las instrucciones del proyecto, su concepto y la única guía visual vigente. Este documento y los informes enlazados se consultan según la tarea.

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

Última petición: **«sigue mejorando, se ve genérico»**. La iteración de expedición implementa una ruta real y el regreso orgánico del color; [EXPEDITION_QA.md](EXPEDITION_QA.md) registra su validación. Revisa el estado del código y las indicaciones recientes antes de continuar; no presentes esta iteración como terminada o publicada por el hecho de estar en la carpeta.

La última publicación documentada es el commit **`36aba63f177f1bfaa611930cc7a24188a2ab8f9b`**, servido en [sugarclash-web.vercel.app](https://sugarclash-web.vercel.app/), con despliegue READY y comprobación de archivos byte por byte. Esa evidencia corresponde a esa versión, no a cambios posteriores. Consulta [DEPLOYMENT_RENACER.md](DEPLOYMENT_RENACER.md) solo si necesitas verificar o publicar.

## Mapa del runtime

Busca las funciones por nombre con `rg`; los números de línea cambian.

| Área | Fuentes de verdad en `index.html` |
|---|---|
| Pantallas y sesiones | `state`, `showScreen()`, `navigate()`, `stopBoard()`; secciones `screen-home`, `world`, `modes`, `village`, `memories`, `settings`, `game`, `arena`. |
| Portada y ruta | `renderHome()`, `expeditionRoute()`, `restorationVisual()`, `renderWorld()`, `campaignNext()`, `continueCampaign()`, `TERRITORIES`, `LEVEL_NAMES_ALL`, `CAMPAIGN_ARCS`. |
| Entrada de campaña | `requestLevel()` → diálogo de jefe → `tryStartLevel()` → `spendLife()` → `startBoard()`. No saltarse esta cadena desde la UI o las pruebas. |
| Reglas puras | `newPiece()`, `runGroups()`, `legalMoves()`, `powerCreation()`, `expandEffects()`, `gravity()`, `reshuffle()`. Tablero plano con piezas `{id,color,power}`; hielo fijo en `g.ice`. |
| Partida | `startBoard()`, `renderGame()`, `renderPieces()`, `bindBoard()`, `attemptSwap()`, `resolveBoard()`, `finishBoard()`. `state.run` e `isActive(g)` invalidan esperas antiguas. |
| Poderes y ayudas | `armPulse()`, `pulseNeed()`, `armHammer()`, `useHammer()`, `shuffleGame()`. La pieza y su poder conservan identidad al caer. |
| Diario, Latido y Zen | `dailyConfig()`, `dailySeed()`, `seededRandom()`, `startDaily()`, `launchMode()`. El diario usa fecha local y premio limitado a una vez por fecha. |
| Guerra y Royale | Bloque `ARENA_START` / `ARENA_END`: `arenaState`, `startArena()`, `stopArena()`, `pauseArena()`. IA local, canvas lógico 390×570, DPR máximo 2. |
| Respuesta cosmética | Bloque `FEEDBACK_START` / `FEEDBACK_END`: `feedbackHit()`, `feedbackCombo()`, `feedbackVictory()`, `feedbackCancel()`. Sin RNG del motor, premios ni persistencia. |
| Aldea | `BUILDINGS`, `buildingOpen()`, `renderVillage()`, `inspectBuilding()`, `buildStructure()`. Inspeccionar no compra; construir valida requisitos y miel. |
| Persistencia | `defaultSave()`, `normalizeSave()`, `loadSave()`, `persistSave()`, `syncLives()`, `livesMax()`. |

Reglas que conviene comprobar antes de tocar la progresión: ocho capítulos de diez niveles; nueve victorias de una estrella abren al jefe. Una vida se reserva al entrar en campaña y vuelve una sola vez al ganar; perder o abandonar la consume. Los otros modos no gastan vidas. Los renders no conceden progreso y una celebración no concede premios.

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

El cierre histórico de la versión publicada registró **69 pruebas aprobadas y 80/80 niveles**, 108 intentos y 28 derrotas, sin escribir la clave antigua. Es una referencia reproducible, no una garantía sobre modificaciones posteriores. Usa el resultado de la ejecución actual al informar. [Método y límites](RENACER_PLAYTHROUGH.md).

Revisa las pantallas afectadas a **320×640**, **390×844** y escritorio: tablero y controles completos, foco de teclado, restauración real a 0/intermedia/1 y ausencia de scroll horizontal. En arenas, prueba pausa, regreso y limpieza; con efectos, movimiento reducido, ocultación y silencio. Los cambios de recursos o PWA necesitan comprobar carga, manifest, catálogo de caché y recarga offline en QA. [Evidencia anterior](DARK_COLOR_QA.md) solo cuando resulte pertinente; emular móvil no equivale a probar un teléfono físico.

## Publicar cuando Jose lo pida

1. Termina y valida el cambio local; revisa el diff y conserva la identificación del commit que vas a publicar.
2. Usa la cuenta y la herramienta Vercel disponibles para ti. El proyecto existente es **`sugarclash-web`**, organización **`pulsarproyects`**. Confirma ese destino y la vinculación local antes de desplegar; `.vercel/` es configuración local ignorada por Git.
3. Con Vercel CLI estándar disponible en PATH y el proyecto ya vinculado, una publicación de producción se ejecuta desde esta carpeta con `vercel deploy --prod --scope pulsarproyects`. Si tu entorno requiere vincular o autenticar, usa su flujo normal; no copies credenciales ni dependas de binarios dentro de cachés privadas de Codex. No crees otro proyecto por defecto.
4. Un push o la salida inicial de un comando no confirman publicación. Comprueba estado READY/production, alias público y versión realmente servida en [la URL existente](https://sugarclash-web.vercel.app/). Verifica HTML, worker, manifest y recursos cambiados; identifica la versión y contrasta contenido o hashes.
5. Actualiza la evidencia de publicación con el resultado real. No atribuyas a un nuevo cambio las verificaciones del commit `36aba63` ni anuncies pruebas comerciales, ingresos o teléfono físico sin haberlas realizado.

Estos pasos no envían mensajes a Claude ni cambian permisos, cuentas o datos privados. Cada herramienta mantiene su autenticación habitual.

## Prompt listo para Jose

Después de abrir esta carpeta en Claude Code, pega esto y sustituye la última línea por tu encargo:

```text
Trabaja en este proyecto Sugar Clash · Renacer. Lee CLAUDE.md y sus instrucciones importadas. Consulta docs/CLAUDE_HANDOFF.md solo para localizar el arranque, las funciones, las pruebas o la publicación que necesites.

Conserva Dulcelandia, Confite, el logo sobrio y la dirección actual dark/descolorido frente al color que vuelve por progreso real. El juego vigente es index.html de la raíz; no uses legacy ni la etapa marfil como base. No cambies reglas o economía como parte de un ajuste visual.

Revisa git status y respeta cambios existentes de Codex. Prueba en un origen aislado distinto del puerto4177 y de producción; no alteres mis guardados. Implementa y valida mi encargo, indica qué comprobaste y no afirmes que está publicado sin verificar un despliegue de esa versión.

Mi encargo: [escribe aquí el cambio que quieres].
```
