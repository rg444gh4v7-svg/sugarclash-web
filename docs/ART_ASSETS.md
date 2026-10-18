# Arte integrado · El Cristal Vivo · Mundo Vivo 18

17 de octubre de 2026. Método: generador de imágenes integrado de Codex/ChatGPT
(`image_gen`, built-in); sin plugin externo ni clave API adicional. Las imágenes
usan la generación integrada de la cuenta. Referencia aprobada por Jose: `title-world-v3-hd.jpg` y su captura de
portada. Producción carga únicamente archivos empaquetados en el repositorio.

## Contrato del lote Mundo Vivo 18

| Recurso | Geometría | Uso y fallback |
|---|---:|---|
| `monsters-t1-v18.webp` … `monsters-t8-v18.webp` | Ocho atlas RGBA, cada uno 1600×640, 5×2, celdas 320×320 | Diez criaturas distintas por territorio; nivel `n` usa celda `n-1`. Son **80 criaturas en ocho archivos atlas**, no 80 archivos individuales. `guardianSVG()` y `guardians-cinematic-v1.webp` son fallback. |
| `combatants-v18.webp` | RGBA 1600×640, 5×2 | Fila superior: Dulce Roja + cuatro aliados. Fila inferior: cinco rivales HEX de Guerra. El fallback conserva iconos/formas canvas. |
| `arena-war-v18.webp` | RGB 941×1672 | Fondo de Guerra, recortado dentro del canvas estático de `minigameArenaArt()` y reutilizado en su shell global. Fallback: arena canvas nativa. |
| `arena-royale-v18.webp` | RGB 941×1672 | Fondo de Royale dentro del canvas estático y shell global. Fallback: arena canvas nativa. |
| `village-cinematic-v18.webp` | RGB 941×1672 | Paisaje vertical de Aldea y fondo contextual. Fallback: escena/terreno nativo. |
| `hex-realm-v18.webp` | RGB 941×1672 | Fondo contextual de las seis vistas HEX. Fallback: `dgLandscapeSVG()` y fondos nativos. |
| `hex-enemies-a-v18.webp`, `hex-enemies-b-v18.webp` | Dos atlas RGBA 1600×640, 5×2 | Veinte adversarios HEX distintos. Fallback: símbolos y siluetas nativas. |
| `buildings-v18.webp` | RGBA 1600×640, 5×2 | Las diez construcciones de `BUILDINGS`, en el mismo orden. Fallback: `villageBuildingSVG()`. |
| `candies-v18.webp` | RGBA 1280×640, 4×2 | Ocho piezas pintadas. Fallback: símbolos/SVG y piezas canvas existentes. |
| `guardians-cinematic-v1.webp` | RGBA 1776×888, 4×2 | Primera capa histórica de ocho familias; ya no es la fuente de las 80 criaturas. |
| `worlds-cinematic-v1.webp` | RGB 1776×888, 2×4 | Ocho panoramas; `cinematicScene()` recorta sin deformar. |
| `icon-crystal-512.png`, `icon-crystal-192.png`, `icon-crystal-ios-180.png` | Iconos cuadrados | Emblema de instalación; Manifest y Apple Touch Icon usan estos nombres. |

Royale usa la celda 0 de `combatants-v18.webp` para Dulce Roja y las celdas 0–8
de `monsters-t5-v18.webp` para nueve rivales distintos. Las arenas raster se
pintan una vez en el canvas cacheado: unidades, vida y efectos continúan en el RAF
existente. Ningún recurso concede recompensas, cambia hitboxes/colisiones, escribe
el save, altera números o inicia un RAF adicional.

La cobertura global de las 22 pantallas usa el fondo pertinente —mundo, Aldea,
Guerra, Royale o HEX— detrás de superficies translúcidas. Es ambientación, no una
nueva pantalla o ruta. Mantener `prefers-reduced-motion`, 320×640 y fallbacks.

## Reempaquetado de atlas con alfa

Los originales built-in de criaturas llegaron como hojas RGBA de 1774×887. La
preparación local usa Sharp solo en desarrollo, no como dependencia del juego:

1. Leer RGBA y encontrar componentes conexos por píxeles cuyo alfa supera el
   umbral; conservar los diez componentes útiles de mayor área.
2. Ordenarlos por fila y centro horizontal, aislar cada componente y añadir un
   margen transparente pequeño.
3. Redimensionar cada criatura con `fit: contain` a 320×320, sin estirar.
4. Componer 5×2 sobre 1600×640 transparente y exportar WebP preservando alfa.

El umbral normal es alfa **24**. Solo `monsters-t5-v18.webp` usa alfa **120** para
separar sus partículas/halos translúcidos; no propagar ese valor a los otros atlas.
`candies-v18.webp` usa 4×2 (1280×640). No recortar por rejilla la fuente original:
las figuras no llegaban centradas de forma uniforme antes del reempaquetado.

## Procedencia built-in conocida

Directorio de contexto:
`/Users/jose/.codex/generated_images/01a0499a-337f-7911-8673-efae30763203/`.
Estos PNG son originales de trabajo; el runtime referencia los WebP del repo.

| Salida empaquetada | Original de contexto |
|---|---|
| `monsters-t1-v18.webp` | `exec-0580469a-6771-4af8-8222-7c08d53cc684.png` |
| `monsters-t2-v18.webp` | `exec-790c319a-ef8f-4897-9cfa-d72ce23c1201.png` |
| `monsters-t3-v18.webp` | `exec-571694ed-5c61-4746-bc5e-3caa96d28544.png` |
| `monsters-t4-v18.webp` | `exec-338abe9c-5ca7-4c88-a59c-b1d5d30dd7bb.png` |
| `monsters-t5-v18.webp` | `exec-aec5ea03-625a-47b4-9054-2ead7f9a80c8.png` |
| `monsters-t6-v18.webp` | `exec-870b2dd2-ffde-4c9f-8f53-b65ad08d51c9.png` |
| `monsters-t7-v18.webp` | `exec-d54cf42f-1847-4366-952f-e6c8f94192e6.png` |
| `monsters-t8-v18.webp` | `exec-83776fcb-6e09-4ee8-bffc-2537d3c48226.png` |
| `combatants-v18.webp` | `exec-44c1e6d8-cd99-4d9c-a40a-3f7abaff828b.png` |
| `village-cinematic-v18.webp` | `exec-cc999e59-0ae5-4fa2-b6b3-67024376f912.png` |
| `arena-war-v18.webp` | `exec-af0fdab7-cfe2-4897-87b4-a5de5dd135b3.png` |
| `arena-royale-v18.webp` | `exec-dd269c61-b870-42da-8c66-6466321ad7a5.png` |
| `hex-realm-v18.webp` | `exec-5ee9e766-d2ce-4dfc-bd61-64662a882658.png` |
| `hex-enemies-a-v18.webp` | `exec-a73ecc72-2855-43d3-9687-1b4c67fe5bea.png` |
| `hex-enemies-b-v18.webp` | `exec-7d383c76-17c2-4a4b-b6a8-61b6e46a6210.png` |
| `buildings-v18.webp` | `exec-f91ef05d-a273-45f9-a318-bdbb91cb0566.png` |
| `candies-v18.webp` | `exec-59b672e0-d041-4a32-a7d5-cf304a3c1f94.png` |

El worker v18 enumera el lote para precache. Esa enumeración y la existencia local
de archivos no certifican todavía QA completa, instalación actualizada en iPhone
ni publicación servida: comprobar carga, fallback, cache, 320×640/390×844 y versión
desplegada antes de declarar cierre.

## Prompt set exacto · 80 criaturas

Los ocho atlas se pidieron con las dos referencias
`title-world-v3-hd.jpg` (Image 1) y `guardians-cinematic-v1.webp` (Image 2), y
`transparent_background: true`. Cada prompt efectivo fue la concatenación literal
de esta base y uno de los ocho bloques territoriales siguientes.

### Base compartida

```text
Use case: stylized-concept
Asset type: production mobile-game monster atlas.
Input images: Image 1 is the world lighting and material reference; Image 2 is the established monster rendering reference.
Primary request: Create ONE exact sprite atlas containing TEN genuinely different full-body enemy creatures for Sugar Clash: Dulcelandia. They are corrupted candy-world beings, elegant dark fantasy rather than childish mascots. Every creature must have a clearly different silhouette, anatomy, face, pose, scale, and dominant material. The tenth is the unmistakable final boss, larger and more elaborate.
Composition/framing: exact 5 columns by 2 rows, row-major level order 1 through 10; one centered isolated full-body creature per equal cell; all feet/base fully visible; generous transparent padding; absolutely no overlap; consistent camera and scale except boss may be 12% larger.
Style/medium: premium painterly 3D game key art, crystalline sugar, mineral facets, confection textures, cinematic mobile-game polish, sharp readable silhouettes at 100px.
Lighting/mood: warm amber/cyan/magenta internal highlights against violet corruption, matching the references.
Constraints: genuinely transparent background; no scenery; no platforms; no panels; no borders; no grid lines; no labels; no numbers; no letters; no UI; no watermark; exactly ten creatures; each cell contains exactly one creature; no duplicate phoenixes and no recolors of one body.
```

### Conceptos territoriales, en orden de celdas

#### T1 · Las Tierras Carmesí

```text
Territory: Las Tierras Carmesí.
Level order and distinct creature concepts:
1 strawberry sugar hare with long candy-glass ears;
2 low six-legged taffy hound;
3 thorn-backed licorice stag;
4 flowing honey river serpent;
5 small village bell golem made of red boiled sweets;
6 broken-bridge troll with wafer slab shoulders;
7 thin watchtower mantis with telescope eye;
8 canyon scorpion made of rock candy;
9 twin-door armored ram;
10 El Último Carmesí, towering horned caramel knight with spiral shield. Crimson, coral, amber and ivory materials.
```

#### T2 · Los Jardines de Mochi

```text
Territory: Los Jardines de Mochi.
Level order and distinct creature concepts:
1 cherry-blossom moth with petal wings;
2 squat sugar-sumo tanuki;
3 folded mochi crane;
4 syrup koi-dragon with fin ribbons;
5 wagashi gallery fox with fan tail;
6 silent garden stone-lantern spirit;
7 many-eyed paper-lantern centipede;
8 crystal pagoda tortoise;
9 ancient-root white tiger entangled in pink vines;
10 La Flor de Mochi Eterno, regal many-petaled ivory and lavender blossom guardian with feline face. Pink, ivory, lavender, gold and cyan accents.
```

#### T3 · Las Torres de Tanghulu

```text
Territory: Las Torres de Tanghulu.
Level order and distinct creature concepts:
1 skewer-legged fruit beetle;
2 climbing red-glass gecko;
3 caramel plaza bull with fruit armor;
4 arched fruit-candy spider;
5 noon-sun falcon made of ruby berries;
6 ascending crack lightning eel;
7 broken-scaffold bamboo automaton;
8 floating-platform jellyfish with dangling skewers;
9 sky-vertex wyvern with needle wings;
10 La Aguja del Cielo, monumental celestial red dragon whose body forms a vertical tower. Ruby red, transparent fruit glaze, gold, sharp ivory.
```

#### T4 · Los Alpes de Cacao

```text
Territory: Los Alpes de Cacao.
Level order and distinct creature concepts:
1 cocoa snow hare with angular antlers;
2 hazelnut cave bat with shell armor;
3 ganache glacier walrus;
4 frozen-cascade chocolate salamander;
5 mountain-heart bear with amber core;
6 cocoa trail ibex;
7 white-chocolate vein mole with crystal claws;
8 nameless summit roc with slab wings;
9 hibernation-threshold mammoth;
10 El Corazón de Cacao, colossal dark chocolate golem with a blazing heart and layered mountain armor. Dark cocoa, cream, hazelnut gold, icy cyan highlights.
```

#### T5 · El Bosque de Gominolas

```text
Territory: El Bosque de Gominolas.
Level order and distinct creature concepts:
1 translucent gummy frog;
2 licorice-root centipede;
3 trio-bodied gummy bear chimera;
4 luminous mushroom snail;
5 central-tree owl with bark mask;
6 translucent den cave-lion;
7 gelatin corridor slug with many crystal eyes;
8 whisper-cavern bat made of jelly membranes;
9 licorice labyrinth minotaur;
10 El Árbol de Gominola Ancestral, colossal sentient tree guardian with gummy fruit, root claws, and amber eyes. Emerald, lime, ruby gummy glass, black licorice and honey gold.
```

#### T6 · Las Praderas de Malvavisco

```text
Territory: Las Praderas de Malvavisco.
Level order and distinct creature concepts:
1 cloud-marshmallow sheep with floating feet;
2 abandoned-camp raccoon with toasted sugar armor;
3 ember salamander made of charred marshmallow;
4 maple-path antlered fox;
5 central-fire bison with glowing coal mane;
6 stone-s'more crab with cracker shell;
7 star-sky owl with blue sugar constellations;
8 cloud-tent mimic with ribbon limbs;
9 last-warmth polar bear with molten caramel veins;
10 La Última Fogata, regal colossal fire-lion guardian made of toasted marshmallow, maple amber and flame crystals. Cream, toasted brown, maple gold, ember orange, midnight blue.
```

#### T7 · El Valle del Dulce de Leche

```text
Territory: El Valle del Dulce de Leche.
Level order and distinct creature concepts:
1 altar jaguar made of amber caramel;
2 marigold-winged hummingbird spirit;
3 ancestor-path xolo dog with candle flames;
4 stone sugar-skull armadillo;
5 memory-courtyard deer carrying tiny candles;
6 ownerless-candle moth queen;
7 memorial raven with papel-picado wings;
8 eternal-offering serpent crowned in marigolds;
9 sweet-threshold skeletal knight;
10 La Calavera de Azúcar Sagrada, majestic skeletal monarch guardian in violet cloak, marigold crown, ornate caramel bone. Marigold orange, cream bone, dulce-de-leche amber, deep violet and magenta gems.
```

#### T8 · La Capital de Cristal

```text
Territory: La Capital de Cristal.
Level order and distinct creature concepts:
1 crystal ruin beetle;
2 frozen-instant hourglass spider;
3 fractal prism stag;
4 opaque-mirror panther;
5 perfect-geometry floating dodecahedron beast with limbs;
6 lightless-prism cobra;
7 resonant-crystal bell golem;
8 suspended-fragment manta ray;
9 final-threshold six-winged obsidian sentinel;
10 El Cristal que se Rompió a sí Mismo, immense fractured cyan-magenta-violet crystal warden with luminous amber heart, crown-like shards, tragic regal silhouette. Cyan, magenta, violet, black crystal, white refraction and amber core.
```

## Prompt set exacto · cuatro escenas

Las cuatro escenas usaron `title-world-v3-hd.jpg` como única referencia,
`transparent_background: false` y la concatenación literal de esta base con la
petición correspondiente.

### Base compartida

```text
Use case: stylized-concept
Asset type: full-bleed vertical mobile-game environment background, no UI.
Input images: Image 1 is the exact world style, palette, material and lighting reference.
Style/medium: premium cinematic painterly 3D fantasy game environment; crystalline sugar, mineral facets, confection architecture, believable depth in foreground/midground/background; mature and wondrous, not childish.
Composition/framing: portrait 9:16, strong depth, important landmarks around the upper and side thirds, a calmer darker center/lower area so mobile UI and gameplay remain readable.
Lighting/mood: warm amber/cyan/magenta light resisting deep violet corruption, atmospheric fog and volumetric light.
Constraints: no characters, no monsters, no text, no logo, no HUD, no interface, no watermark, no borders.
```

### Aldea

```text
Primary request: Confite's restored village. A winding honey river and serpentine path connect ten unique candy-and-crystal buildings: cottage, candy stall, honey fountain, sugar garden greenhouse, watchtower, workshop, crystal dock, forge, dojo and crystal lighthouse. The village is inhabited in feeling but empty of visible people. Warm windows and moving-looking water; distant violet storm beyond the mountains.
```

### Guerra 5v5

```text
Primary request: Guerra 5v5 arena. A symmetrical tactical battlefield in the Tanghulu sky towers, with two opposing fortified ends, a readable central lane and side paths, broken ruby fruit-glass bridges, candy crystal cover and distant vertical spires. Warm clan light below, corrupted violet citadel above. Must read clearly beneath moving combat units.
```

### Royale

```text
Primary request: Battle Royale arena in the Gominola forest. A broad circular clearing seen from a slightly elevated game camera, licorice roots and translucent gummy trees framing the edges, ruined crystal shrines and a safe glowing amber center, encroaching violet corruption beyond. Keep the center uncluttered for ten combat units and a shrinking-zone ring.
```

### Reino HEX

```text
Primary request: HEX CLASH realm. Gothic crystalline capital ruins under a fractured violet vortex, monumental dark crystal arches, suspended prisms, black mineral terraces, thin cyan fracture-light and a distant amber core. Dramatic but legible behind menus and a match-3 board; no living figures.
```

## Prompt exacto · combatientes de Guerra

Este atlas usó `title-world-v3-hd.jpg` como Image 1,
`guardians-cinematic-v1.webp` como Image 2 y `transparent_background: true`.

```text
Use case: stylized-concept
Asset type: transparent production mobile-game combatant atlas.
Input images: Image 1 is the world style reference; Image 2 is the established creature rendering reference.
Primary request: ONE exact 5 columns by 2 rows atlas with TEN full-body combatants, one centered figure per equal cell, no overlap. Top row are five heroic Dulcelandia fighters: 1 Dulce Roja, courageous adult candy knight in crimson crystal armor; 2 Mochi-ko, elegant adult blossom mage in ivory-lavender robes; 3 Tang Wei, agile adult Tanghulu swordsman in ruby fruit-glass armor; 4 Bastión, massive adult chocolate guardian with shield; 5 Kenshi, adult licorice forest ninja with gummy-bear mask. Bottom row are five genuinely different corrupted Fragment enemies: prism beetle bruiser, licorice wraith, ruby spear mantis, faceted violet hound, floating broken-crystal sorcerer.
Style/medium: premium painterly 3D mobile action-game character art, same crystalline sugar/mineral material as references, mature heroic proportions, strong readable silhouettes.
Composition/framing: exact 5x2 grid, row-major, full bodies and weapons visible, equal cell centers and transparent padding.
Constraints: genuinely transparent background; no scenery, no panels, no grid lines, no text, no labels, no numbers, no UI, no watermark; exactly ten distinct characters.
```

Los cuatro prompts finales adicionales (HEX 1–10, HEX 11–20, edificios y piezas)
se conservan literalmente en [art-prompts-v18.json](art-prompts-v18.json).
Sus salidas fueron inspeccionadas y reempaquetadas con el mismo método.

## Prompt final · emblema

Use case: logo-brand. Asset type: production square app icon for Sugar Clash: Dulcelandia, NOT a mockup.
Reference image: the provided title-world-v3-hd.jpg defines the game's actual world: warm amber/coral candy citadels opposed by dark violet crystalline corruption, a fractured luminous sugar crystal between them.
Create one distinctive, premium fantasy-game emblem: a single tall fractured faceted crystal, cyan and rose translucent faces, a small brilliant warm golden core held between separated fragments. Suggest a subtle circular dark mineral setting, not a shield. Restrained carved gold detail. The mark should have a powerful readable silhouette at 48px, with very few large shards, crafted jewel material, convincing depth and cinematic reflected light matching the reference. Centered with generous 18% safe margins. Background fills the entire square in deep plum obsidian with a restrained violet halo; opaque edge-to-edge square, NO rounded-corner clipping. No letters, no wordmark, no UI, no characters, no candy emoji, no pentagon badge, no generic gaming shield, no watermark. Sophisticated storybook fantasy, not childish clipart.

## Prompt final · atlas de guardianes

Use case: stylized-concept. Asset type: one production transparent game character sprite atlas, 4 columns by 2 rows, exactly eight equal square cells, no gutters. Reference image is the game's cinematic candy-fantasy world and sets materials, palette, detail and lighting; DO NOT reproduce its scenery.
Exactly ONE creature per cell, full body facing viewer in three-quarter heroic stance. Consistent scale, feet near bottom, 12% transparent padding inside every cell. No overlap, no frames, no labels, no text, no background or ground. The alpha background must be truly transparent.
Left to right, top row: (1) horned crimson caramel guardian with amber molten seams, (2) elegant violet mochi flower monster with a large ivory-and-golden blossom mane, (3) winged red tanghulu crystal sentinel, (4) broad dark chocolate armored golem with a small amber heart.
Left to right, bottom row: (5) ancient moss-green gummy root/tree guardian, (6) toasted ivory marshmallow fire beast with ember mane, (7) refined sugar-skull guardian with violet cloak and marigold details, (8) formidable dark violet crystalline warden with cyan fractured armor.
All eight must be distinct, expressive mysterious adversaries from the same world. Semi-realistic stylized fantasy game rendering, hand-painted sculptural detail, jewel-like materials, cinematic amber rim light on one side and violet reflected light on the other; match reference sophistication, not flat SVG, not emoji, not baby mascots. Strong readable silhouette, clear face and eyes. No weapons extending outside cells, no gore, no extra creatures. This is an atlas texture to be consumed by the app, not a presentation sheet.

## Prompt final · atlas de paisajes

Use case: stylized-concept. Asset type: one production environment texture atlas for a fantasy mobile game, 2 columns and 4 rows, eight equal WIDE rectangular scene cells, seamless edge-to-edge cells, no gutters, no labels, no UI.
Reference image is the exact visual quality benchmark: cinematic hand-painted candy fantasy, rich material depth, light scattering through sugar crystal, atmospheric perspective, warm amber against violet corruption. Bring this quality INSIDE the game, not a flat vector approximation.
Each cell is a landscape view with layered distant architecture, paths/river into depth, foreground edges, a quieter open middle to place legible game controls. Environments, not maps drawn on parchment. No characters, letters, numbers, frames, interfaces.
Order row-major:
row1 left crimson caramel citadel and golden river; right Japanese mochi gardens, cherry blossom, ivory pagoda, violet mist.
row2 left Chinese tanghulu crystalline red towers; right alpine dark chocolate mountains with molten amber stream.
row3 left mysterious green gummy/licorice forest with luminous root path; right toasted marshmallow prairie, ember campfire glow, amber dusk.
row4 left Latin American sugar valley with marigolds, distant decorated arch and warm lanterns; right frozen violet crystal capital with cyan fracture and obsidian towers.
Coherent painterly premium fantasy game art, crisp sculptural details, restrained dramatic lighting matching reference. Distinct environments but same art direction. No childlike clipart, no flat shapes, no oversized candy emojis. This single atlas is runtime scenery with exact cell geometry.
