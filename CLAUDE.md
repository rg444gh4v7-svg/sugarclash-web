# Sugar Clash: Dulcelandia — CLAUDE.md
## Contexto completo del proyecto para nuevas sesiones de Claude

> **Última actualización:** Julio 2026 — archivo generado tras múltiples sesiones de desarrollo autónomo.
> El creador (Jose) no es programador. Claude escribe todo el código. Jose toma las decisiones creativas.

---

## Estado actual del archivo

```
sugarclash-web/index.html
Tamaño: ~181KB | Líneas: ~3536 | Sintaxis: válida (node -e "new Function(js)")
```

**Un solo archivo HTML/CSS/JS vanilla — intencional. No romper esta arquitectura.**

---

## Cómo validar cada cambio

```bash
# Extraer JS y validar sintaxis (correr después de CADA edición)
node -e "new Function($(cat index.html | python3 -c "
import sys, json
txt = sys.stdin.read()
start = txt.find('<script>') + len('<script>')
end = txt.rfind('</script>')
print(json.dumps(txt[start:end]))
"))" && echo "SYNTAX OK"
```

Si el comando falla, hay un error de sintaxis. Nunca entregar una sesión sin que diga `SYNTAX OK`.

---

## Stack técnico

- **HTML5 + CSS3 + JS vanilla** — sin frameworks, sin bundler
- **Audio:** Web Audio API sintetizada (sin archivos externos). Funciones: `tone()`, `playPop()`, `playWin()`, `playLose()`, `playBuild()`, `playCrystal()`, `playShuffle()`, `playBomb()`
- **Persistencia:** `localStorage` con clave `"sugarclash_save_v1"`
- **Gráficos Confite:** SVG inline generado por `confiteSVG(mood, skin?)`
- **Gráficos caramelos:** SVG `<defs>` en el HTML, referenciados con `<use href="#candy-N">`
- **Fuente:** Fraunces (Google Fonts, cargada en el `<head>`)

---

## Arquitectura de pantallas

Cada pantalla es una `<section class="screen" id="screen-NAME">`. `goTo(name)` activa la correcta.

| ID pantalla | Función render | Descripción |
|---|---|---|
| `screen-title` | (estático) | Título principal |
| `screen-intro` | `startIntro()` / `showIntroSlide(n)` | Intro narrativa (4 slides) |
| `screen-world` | `renderWorld()` | Mapa mundial con 8 territorios |
| `screen-map` | `renderMap()` | Mapa de niveles del territorio actual |
| `screen-game` | `buildGrid()` + `renderGrid()` | Pantalla de juego match-3 |
| `screen-village` | `renderVillage()` | Aldea de Confite |
| `screen-achievements` | `renderAchievements()` | 21 logros |
| `screen-settings` | `renderSettings()` | Ajustes + estadísticas |
| `screen-minigames` | `renderMinigames()` | Hub de minijuegos |
| `screen-moba` | `startMoba()` | MOBA 5v5 en canvas |
| `screen-br` | `startBR()` | Battle Royale en canvas |
| `screen-survival` | `startSurvival()` | Modo Supervivencia |
| `screen-skins` | `renderSkins()` | 5 skins de Confite |
| `screen-heroes` | `renderHeroes()` | 7 héroes |
| `screen-memories` | `renderMemories()` | 8 fragmentos narrativos de Confite |
| `screen-epilogue` | `startEpilogue()` / `showEpilogueSlide(n)` | Epílogo territorio 8 (7 slides) |
| `screen-daily` | (diario en world) | Desafío diario (integrado en world) |

### Overlays importantes
- `#overlay` — resultado de nivel (win/loss)
- `#pause-overlay` — menú de pausa con power-ups
- `#boss-intro-overlay` — intro dramática al tocar nivel jefe
- `#territory-complete-overlay` — overlay al completar un territorio
- `#tutorial-overlay` — tutorial primera vez

---

## Sistema de guardado

```javascript
// Clave localStorage
const SAVE_KEY = "sugarclash_save_v1";

// Estructura completa del save (ver defaultSave())
{
  stars: {1: {5: 3, 6: 2, ...}, 2: {...}},  // estrellas por territorio/nivel
  unlocked: {1: 6, 2: 1, ...},               // nivel desbloqueado por territorio
  coins: 0,
  buildings: {casa: true},
  tutorialSeen: false,
  stripeTutorialSeen: false,
  obstacleTutorialSeen: false,
  muted: false,
  lastTerritory: null,
  achievements: {},
  crystalsActivated: 0,
  bestCascade: 0,
  bestScores: {},                             // clave: "territoryId_levelN"
  dailyChallenge: null,
  dailyStreak: 0,
  lastDailyDate: null,
  lastLoginDate: null,
  loginStreak: 0,
  territoryComplete: {},
  introDone: false,
  survivalBest: 0,
  activeSkin: "default",
  unlockedSkins: {default: true},
  stripesCreated: 0,
  mobaWins: 0,
  brWins: 0,
  unlockedStories: {},                        // {key: "quote"} — Memorias de Confite
  epilogueSeen: false,
  chocolateDestroyed: 0,
}

// Siempre guardar con:
persistSave(); // llama localStorage.setItem(SAVE_KEY, JSON.stringify(save))
```

**Regla:** cada vez que se añada un campo nuevo a `defaultSave()`, también añadirlo a `migrateSave()` si puede existir en saves viejos sin el campo.

---

## Estado del juego (variable `cur`)

```javascript
cur = {
  n,            // número de nivel (o "D" para diario, "S" para supervivencia)
  type,         // "score" | "collect" | "crystals"
  goal,         // meta de puntuación (para type=score)
  target,       // meta de colectar/cristales
  color,        // tipo de caramelo a colectar (para type=collect)
  movesLeft,    // movimientos restantes
  movesMax,     // total de movimientos al inicio
  cols, rows,   // dimensiones del tablero
  score,
  progress,     // para collect/crystals
  cascade,      // contador de cascadas en turno actual
  done,         // true cuando terminó el nivel
  boostUsed,    // +5 movimientos ya usado
  rainbowUsed,  // arco iris ya usado
  bombUsed,     // bombazo ya usado
  isDaily,
  isSurvival,
}
```

---

## Tablero — arrays paralelos

```javascript
board[r][c]     // tipo de caramelo (0-5 = colores, 6 = SPECIAL/cristal, -1 = vacío)
stripes[r][c]   // null | 'H' | 'V' (caramelo rayado)
obstacles[r][c] // 0 | 1 | 2 (bloques de chocolate, HP)
```

**Regla:** cuando se añada un nuevo array paralelo, actualizarlo en `applyGravity()`, `fillEmpty()`, `shuffleBoard()` y `renderGrid()`.

---

## Territorios y niveles

```javascript
const TERRITORIES = [...]  // 8 territorios con id, name, icon, hue, desc, banner
const TOTAL_LEVELS = 10    // niveles por territorio (el 10 siempre es el jefe)

// Arrays de niveles por territorio:
LEVELS_BY_TERRITORY[1..8]  // cada uno con objetos {n, type, goal/target, moves, cols, color?}
```

Convenciones de niveles:
- Territorios 1-3: `cols: 7`
- Territorios 4-5: mix 7-8 cols
- Territorios 6-8: `cols: 8` desde nivel 3-6+
- Nivel 10 de cada territorio = nivel jefe (`BOSS_LEVEL_NAMES[territoryId]`)

---

## Confite — el personaje

```javascript
// Moods disponibles: "happy" | "excited" | "worried" | "sad" | "celebrate"
confiteSVG(mood, skin?)  // devuelve string de SVG

// Para cambiar lo que dice Confite en el juego:
setConfiteGame("texto")
setConfiteMood("mood")
bounceConfite()  // animación de rebote

// Los SVGs de Confite están en estos elementos:
// #confite-title, #confite-map, #confite-game-svg, #confite-skins-svg

// Líneas de Confite durante el juego:
CONFITE_LINES = {
  comboBig: [...],
  comboMed: [...],
  lowMoves: [...],
  stripeCreated: [...],
  stripeExplode: [...],
  bombUsed: [...],
  crystalBurst: [...],
}
```

---

## Power-ups (en menú de pausa)

| Nombre | Costo | Variable | Función |
|---|---|---|---|
| +5 Movimientos | 30 🍯 | `cur.boostUsed` | `buyMoves()` |
| Bombazo 3×3 | 40 🍯 | `cur.bombUsed` | `activateBomb()` → `useBombAt(r,c)` |
| Arco Iris | 60 🍯 | `cur.rainbowUsed` | `activateRainbow()` → `useRainbowOnColor(type)` |
| Continuar (+5 movs) | 50 🍯 | — | `continueGame()` (solo en derrota) |

`bombActive` y `rainbowActive` son booleanos globales — se verifican en `onCellClick()` antes del flujo normal.

---

## Mecánicas especiales

### Caramelo rayado (stripes)
- Se crea con match de 4+ en fila → `stripes[r][c] = 'H'` (horizontal)
- Se crea con match de 4+ en columna → `stripes[r][c] = 'V'` (vertical)
- Al combinarse en un match, limpia toda su fila o columna
- CSS: `.cell.stripe-h::after` y `.cell.stripe-v::after`

### Caramelo especial / Cristal (SPECIAL = 6)
- 5% de probabilidad en `randType()`
- Al incluirse en un match, limpia toda su fila (burst)
- Necesario para tipo de nivel `"crystals"`

### Bloques de chocolate (obstacles)
- Solo aparecen en territorios 4+ desde nivel 5
- HP 1 (territorio 4-5) o HP 2 (territorio 6+)
- Matches adyacentes los dañan → `processObstacleDamage(allCells)`
- Al destruirse: +200 pts, `save.chocolateDestroyed++`
- CSS: `.cell.obstacle-1::after` y `.cell.obstacle-2::after`

### Hint system
- Si el jugador no mueve en 8 segundos → `showHint()` pulsa 2 celdas
- `resetHintTimer()` se llama en cada click
- CSS: `.cell.hint-pulse`

---

## Minijuegos

### MOBA 5v5 (canvas)
- Variables globales con prefijo `moba*`
- `mobaRunning`, `mobaRAF` para el game loop
- El jugador controla un héroe, derrota 5 enemigos
- `finishMoba(won, enemiesDefeated)` → guarda `save.mobaWins`

### Battle Royale (canvas)
- Variables globales con prefijo `br*`
- `brRunning`, `brRAF` para el game loop
- 20 jugadores, el jugador sobrevive hasta el final
- `finishBR(placement)` → guarda `save.brWins`

### Supervivencia
- Sin límite de movimientos, con timer que baja
- Matches añaden tiempo: `addSurvivalTime(matchCount, cascade)`
- `SURVIVAL_START_TIME = 15000ms`, `SURVIVAL_MAX_TIME = 30000ms`
- `finishSurvival()` → guarda `save.survivalBest`

---

## Narrativa implementada

### Historia de Confite (REVELACIÓN FINAL)
Confite es el quinto fragmento del Gran Cristal, que se partió a sí mismo hace 500 años para no ser esclavizado. La revelación ocurre en el epílogo del territorio 8 (`startEpilogue()` → 7 slides).

### Fragmentos narrativos (Memorias de Confite)
8 niveles especiales disparan una cita al completarlos:
```javascript
STORY_MOMENTS = {
  "1_5": "Algo en este color...",
  "2_5": "Olí algo parecido...",
  "3_10": "Las Torres...",
  "4_5": "El frío del chocolate...",
  "5_7": "Las voces del bosque...",
  "6_5": "Las fogatas...",
  "7_7": "Este lugar honra...",
  "8_5": "Ya sé lo que pasó...",
}
```
Se guardan en `save.unlockedStories` y se ven en `screen-memories`.

### Greeting por territorio
`TERRITORY_CONFITE_GREET[1..8]` — Confite dice algo diferente al entrar a cada mapa.

### Boss intro
`BOSS_CONFITE_LINES[1..8]` — cita antes del nivel jefe de cada territorio.

### Territorio completo
`TERRITORY_COMPLETE_DATA[1..8]` — narrative + confite line al completar un territorio al 100%.

---

## Logros (ACHIEVEMENTS)

21 logros totales. Formato:
```javascript
{id, name, icon, desc, check: ()=>boolean, progress?: ()=>number, target?: number}
```

Llamar `checkAchievements()` después de cualquier cambio que pueda desbloquear uno.
Cada logro desbloqueado da `ACHIEVEMENT_REWARD = 50` monedas.
Toast de logro: `achvToastQueue` + `showNextAchvToast()`.

---

## Skins de Confite

```javascript
const CONFITE_SKINS = [
  {id:"default", name:"Confite", icon:"🩷", cost:0},
  {id:"golden",  name:"Confite Dorado", icon:"✨", cost:200},
  {id:"crystal", name:"Confite Cristal", icon:"💎", cost:300},
  {id:"dark",    name:"Confite Oscuro", icon:"🖤", cost:250},
  {id:"sakura",  name:"Confite Sakura", icon:"🌸", cost:180},
]
```

`activateSkin(id)` → `save.activeSkin = id` → `refreshAllConfite()`.

---

## Desafío diario

- Clave: `getDailyKey()` → fecha ISO (`YYYY-MM-DD`)
- Config: `getDailyConfig()` → usa LCG seeded con la fecha (determinista)
- Guardado en `save.dailyChallenge`, `save.dailyStreak`, `save.lastDailyDate`
- Recompensa: 100 monedas al completar

---

## Login bonus

- `checkLoginBonus()` llamado al iniciar si `save.introDone`
- Bonus base: 10 monedas + 2 por día de racha (máx +20)
- Guarda `save.lastLoginDate` y `save.loginStreak`

---

## Patrones de código importantes

### Async/await en el tablero
`processCascade()`, `doSwap()`, `useRainbowOnColor()`, `useBombAt()`, `useRainbowOnColor()` son todas `async`. Usan `delay(ms)` para animar.

```javascript
// SIEMPRE: al terminar cualquier acción async
if(checkWin()){ finishLevel(true); return; }
if(cur.movesLeft<=0){ finishLevel(false); return; }
busy = false;
resetHintTimer();
```

### `busy` flag
`let busy = false` — se pone `true` durante animaciones. `onCellClick()` lo verifica primero. **Nunca olvidar poner `busy=false` al final de un flujo.**

### Confetti
`spawnConfetti()` — canvas temporal que se autodestrata. Llamar en victorias.

### `rnd(n)` vs `Math.random()`
Usar `rnd(n)` (alias de `Math.floor(Math.random()*n)`) para consistencia.

---

## Lo que falta (roadmap priorizado)

### Alta prioridad
1. **Exportar/importar guardado** — botón en settings para copiar/pegar JSON del save (si el jugador borra caché pierde todo)
2. **Caramelo envuelto** — match en L/T shape crea candy que explota 3×3 al combinarse (diferente del Bombazo power-up)
3. **PWA instalable** — `manifest.json` + `service-worker.js` básico para instalar como app en móvil

### Media prioridad
4. **Sistema de vidas** — 5 vidas, se pierde 1 al fallar, se recarga 1 cada 30 min (o gastar monedas)
5. **Cofre semanal** — bonus grande por completar X niveles en 7 días
6. **Transiciones animadas** entre pantallas (actualmente instantáneas)
7. **Frases de transición** cuando Confite pasa de un territorio a otro

### Baja prioridad
8. **Modo infinito post-epílogo** — algo que hacer después de completar los 8 territorios
9. **Partidas guardadas múltiples** (hoy solo hay un slot)
10. **Capacitor packaging** para Android/iOS (requiere separar en archivos)

---

## El universo narrativo (resumen)

**Mundo:** Dulcelandia — reino de dulces destruido hace 500 años.
**Protagonista:** Dulce Roja, sanadora del Clan Caramelo.
**Confite:** El quinto fragmento del Gran Cristal. Se partió a sí mismo para poder estar con el jugador. Su revelación completa ocurre en el epílogo del territorio 8.
**Antagonista:** El Confitero Oscuro — villano con razón en el diagnóstico, solución equivocada.

### Los 8 territorios
1. Las Tierras Carmesí — caramelo clásico, hogar de Confite
2. Los Jardines de Mochi — wagashi japonés, cerezos de azúcar
3. Las Torres de Tanghulu — fruta caramelizada china
4. Los Alpes de Cacao — chocolate suizo y belga
5. El Bosque de Gominolas — gomitas alemanas, regaliz nórdico
6. Las Praderas de Malvavisco — s'mores americanos, maple canadiense
7. El Valle del Dulce de Leche — dulces latinoamericanos, Día de Muertos
8. La Capital de Cristal — zona congelada, final del juego

### Tono narrativo
Dulce en la superficie, melancólico en el fondo. Confite sabe más de lo que dice. Cada territorio restaurado recupera color — literalmente en el CSS (`grayscale` → `grayscale(0)`).

---

## Principios que no se rompen

1. **Un solo archivo** — todo en `index.html`
2. **Sin frameworks** — vanilla JS
3. **Sin archivos externos de audio** — Web Audio API sintetizada
4. **El jugador nunca siente presión de pagar** — monedas se ganan jugando
5. **Confite siempre en pantalla** — es el corazón narrativo del juego
6. **Validar sintaxis después de cada cambio** — el comando `node -e "new Function(js)"` es obligatorio

---

*Este archivo debe actualizarse al final de cada sesión de desarrollo importante.*
