# Arte integrado · El Cristal Vivo

17 de octubre de 2026. Método: herramienta integrada de generación de imágenes; no CLI/API de pago ni cambio manual de modelo. Referencia aprobada por Jose: `title-world-v3-hd.jpg` y su captura de portada.

## Recursos finales

- `icon-crystal-512.png`, `icon-crystal-192.png`, `icon-crystal-ios-180.png`: derivados de tamaño del emblema nuevo, sin esquinas transparentes. Manifest y Apple Touch Icon apuntan a nombres nuevos.
- `guardians-cinematic-v1.webp`: atlas RGBA 1776×888, 4 columnas × 2 filas. Ocho familias territoriales, reutilizadas como ecos en niveles 1–9 y guardián completo en el 10; **no son 80 ilustraciones distintas**. Preserva alpha real. Fallback: `guardianSVG()`.
- `worlds-cinematic-v1.webp`: atlas RGB 1776×888, 2 columnas × 4 filas. Celdas panorámicas 4:1. `cinematicScene()` recorta con SVG y `preserveAspectRatio="xMidYMid slice"`, sin deformar el arte. No ampliar una celda panorámica a todo el fondo vertical: ahí se reutiliza el raster vertical original.

Los originales permanecen en `/Users/jose/.codex/generated_images/01a0499a-337f-7911-8673-efae30763203/`. Producción solo usa los archivos empaquetados del repositorio. Conversión/ajuste de tamaño con Sharp del runtime local, sin dependencia de juego. Los cinco recursos nuevos están precacheados por el worker v17. No se eliminó ningún recurso previo ni guardado.

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

