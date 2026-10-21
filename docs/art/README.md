# Arte de Sugar Clash · oscuro y color recuperado

21 de octubre de 2026. Inventario de los recursos integrados para la dirección confirmada por Jose: base casi monocroma, color progresivo y logo sobrio. Esta selección no equivale a publicación. La guía compartida de [estilo](../../VISUAL_STYLE.md) recoge la decisión vigente; [VISUAL_REBOOT.md](../VISUAL_REBOOT.md) describe el tema de interfaz.

## Selección actual

| Archivo empaquetado | Geometría | Fuente y uso |
|---|---:|---|
| `assets/renacer-restoration-v3.webp` |1536×1024,RGB| Generación integrada con [RESTORATION_V3_PROMPT.txt](RESTORATION_V3_PROMPT.txt). Puente, valle gris, río teal y flores coral; escena principal integrada. Solo su arte se desatura según progreso real0–1. |
| `assets/sugar-clash-logo-v2.webp` |1100×653,RGBA| Generación integrada con [LOGO_MATURE_V2_PROMPT.txt](LOGO_MATURE_V2_PROMPT.txt). Wordmark seleccionado después de rechazar la versión de burbuja/mascota. Letras marfil/coral, contorno petróleo y cinta discreta. Usar`contain`, sin recortar ni deformar. |
| `assets/candies-toon-v2.webp` |1280×640,RGBA,4×2| Generación integrada, prompt`candies` de [AMERICAN_V2_PROMPTS.json](AMERICAN_V2_PROMPTS.json). Atlas empaquetado en celdas320×320; posiciones lógicas conservadas. |
| `assets/icon-sugar-v2.svg` |viewBox256×256| Vector local: inicialS marfil, fondo petróleo y acento coral. Icono secundario para instalación/favicon; el wordmark completo es la marca principal. |
| `assets/icon-sugar-v2-512.png`, `-192.png`, `-180.png` |512²,192²,180²| Versiones raster del icono vectorial. Comprobar Manifest y Apple Touch Icon al cerrar la integración para evitar que siga apareciendo el emblema de cristal anterior. |

En el atlas de caramelos el orden es: bombón rosa, osito verde, rombo azul, piruleta dorada, espiral violeta, corazón coral, **estrella crema/turquesa**, bloque de chocolate. Cada pieza mantiene su índice anterior. La presentación no cambia intercambios, efectos ni colisiones. Las etiquetas visibles/ARIA del poder de la celda6 corresponden a la nueva estrella; el Gran Cristal del relato conserva su identidad narrativa.

## Descartado o sustituido

- El prompt`logo` original dentro de`AMERICAN_V2_PROMPTS.json` se conserva por trazabilidad, **no es la fuente del wordmark elegido**. Pedía letras infladas, brillos de confitería y una mascota asomada; Jose lo rechazó como demasiado infantil. Su reemplazo exacto está en`LOGO_MATURE_V2_PROMPT.txt`.
- Los emblemas geométricos/cristalinos anteriores y la antigua portada violeta no deben volver a actuar como marca o escena principal de esta dirección. Permanecen en el repositorio para continuidad y la edición archivada; no se eliminan datos ni recursos históricos por este cambio.
- Los temas de lima/biseles y, después, marfil/verde bosque quedaron sustituidos. La dirección actual es carbón/piedra con color progresivo; el tono adulto y el logo sobrio permanecen.
- `assets/renacer-meadow-v2.webp` (1536×1024,RGB) es la escena luminosa **descartada** como portada. Su fuente es el prompt`meadow` de [AMERICAN_V2_PROMPTS.json](AMERICAN_V2_PROMPTS.json); se conserva por trazabilidad. Fue reemplazada por `renacer-restoration-v3.webp`.

## Inspección realizada

El agente visual abrió los cuatro recursos principales y verificó sus dimensiones/alfa. El wordmark muestra ambos términos completos y legibles; el icono conserva unaS reconocible sin pentágono; el paisaje tiene foco y respiración; el atlas mantiene ocho siluetas diferenciadas. Esto no certifica todavía que el navegador esté sirviendo esos recursos en todas las pantallas.

Al integrar: comprobar logo a160px, icono a32/48px, caramelos a tamaño real de celda,320×640 y390×844, contraste de controles y caché/Manifest. El arte final se carga desde archivos del repositorio, sin URLs temporales de generación ni dependencias nuevas.
