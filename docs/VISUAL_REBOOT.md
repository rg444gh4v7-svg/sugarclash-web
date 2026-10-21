# Sugar Clash · oscuro y color recuperado

21 de octubre de 2026. Registro del agente visual. La fuente compartida de dirección sigue siendo [VISUAL_STYLE.md](../VISUAL_STYLE.md).

## Decisión vigente de Jose

Conservar la oposición entre mundo oscuro/descolorido y color recuperado. Jose confirmó una base casi monocroma, color progresivo y un logo sobrio. Se mantienen la nueva estructura de portada, el wordmark adulto, Confite y el concepto narrativo. El tema global marfil y el valle luminoso quedan descartados; no representan la dirección actual.

## Tema integrado

Fondo carbón azul `#141820`, piedra `#20262e`, superficie elevada `#29323c`, texto hueso `#eee7db`, secundario `#adb5b5` y borde `#414b56`. Coral `#cf9279`, oro `#c8ab7d` y teal `#7ba9a6` aparecen en lugares concretos. Karla700, radios de12–16px y sombras discretas; sin neón, verde lima, biseles de juguete ni morado global.

El coordinador integró el override del agente visual desde `/private/tmp/sugarclash-dark-color.css`, después de las reglas anteriores. El código de producción sigue inline en `index.html`; los archivos temporales no son dependencias del juego. El pase abarca portada, recursos, navegación, atlas, aldea, modos, recuerdos, ajustes, tablero, arena, resultados y mensajes. No modifica economía, progreso, hitboxes, handlers ni guardados.

La portada es un panel nativo de juego: logo, escena, siguiente nivel real, progreso, Confite y accesos cortos a modalidades. Conserva `.play-home`, `.home-wordmark`, `.play-world`, `.play-world-copy`, `.play-level`, `.play-progress`, `.play-companion` y `.play-modes`. La navegación móvil declara ancho100% y permanece separada de la partida.

## Restauración visual real

`assets/renacer-restoration-v3.webp` es la escena principal1536×1024, con puente, valle descolorido, río teal y flores coral. Su prompt exacto se conserva en [RESTORATION_V3_PROMPT.txt](art/RESTORATION_V3_PROMPT.txt). La imagen vive en un pseudo-elemento de `.play-world`; solo el arte recibe `saturate(var(--restored,0))`. `renderHome()` conecta `--restored` con los guardianes recuperados del capítulo,0–1. Texto y CTA mantienen contraste estable.

Los ocho territorios conservan paisajes distintos del atlas `worlds-cinematic-v1.webp`, con tamaño200%400% y posiciones `--px`/`--py`. `.battle-landscape` vuelve a un plano4:1, ancho automático y recorte central para evitar deformación o mezcla de celdas. La partida conserva el filtro `--grey`, actualizado por el progreso real del intento. La pintura no concede restauración ni escribe guardados.

## Marca y recursos

El wordmark actual es `assets/sugar-clash-logo-v2.webp`,1100×653 con alfa, generado con [LOGO_MATURE_V2_PROMPT.txt](art/LOGO_MATURE_V2_PROMPT.txt). El iconoS es secundario; no sustituye la marca principal. Los caramelos nuevos conservan el atlas4×2 y las posiciones lógicas originales. Su celda6 es una estrella, coherente con la nueva etiqueta visible y accesible del poder. El Gran Cristal conserva su lugar en el relato.

Fuentes, selección y descartes se registran en [art/README.md](art/README.md).

## Lectura y comprobaciones

Contrastes calculados en la paleta base: hueso/fondo14,47:1, secundario/piedra7,30:1 y texto carbón/CTA coral6,44:1. Los nombres/requisitos bloqueados siguen legibles; se apaga la criatura y su ornamento, no todo el botón.

El coordinador revisó la portada integrada a320×640 y390×844, y comprobó el tutorial real a320px con tablero y herramientas completos. El cierre de QA y las capturas finales están en [DARK_COLOR_QA.md](DARK_COLOR_QA.md):69 pruebas aprobadas, partida ganada real y recarga offline. Estas comprobaciones de navegador no sustituyen una prueba en iPhone físico ni confirman publicación. No se añadieron loops de decoración; se conserva movimiento reducido.

## Iteraciones sustituidas

- El primer logo de letras infladas con mascota se descartó por resultar demasiado infantil.
- El tema cálido claro se afinó primero a marfil/verde bosque, pero Jose lo consideró genérico y pidió volver al contraste dark/descolorido frente al color recuperado.
- `assets/renacer-meadow-v2.webp` permanece como archivo de esa iteración descartada; no es la portada vigente.
