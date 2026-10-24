# Tablero como lugar restaurado

23 de octubre de2026. Pase del agente visual para los cambios autorizados por Jose. La dirección compartida sigue en [VISUAL_STYLE.md](../../VISUAL_STYLE.md): sobria, descolorida y con color ganado. Este documento define el componente preparado; no sustituye esa guía.

## Qué cambia

El soporte deja de parecer un tablero comercial azul de damero: se convierte en una superficie de piedra trabajada, con una línea de medición discreta y fragmentos de camino, cauce, jardín y hogar bajo las piezas. El soporte gana color con el estado real de restauración.

Los caramelos se redibujan como arte vectorial propio en `assets/candies-restoration-v1.svg`,1280×640,4×2 y celdas320×320. Se conserva el orden y las siluetas: envoltorio rosa, oso verde, rombo azul, piruleta dorada, espiral violeta, corazón coral, estrella crema y cacao. Los trazos incorporan pliegues, azúcar, surcos de corte y fracturas finas de cacao; el volumen es moderado, sin reflejos plásticos gruesos ni halos. El recurso usa gradientes y un patrón vectorial interno, sin filtros de ruido, fuentes, imágenes incrustadas ni referencias externas. Los filtros moderados del CSS acompañan la presentación, pero el cambio principal es el trazado nuevo.

La información del encuentro explica qué lugar se devuelve al mundo. El resultado muestra ese lugar y una breve constancia de lo recuperado, con el paisaje propio del territorio. No se generan imágenes nuevas, premios, estados persistentes, animaciones ambientales ni dependencias.

## Integración

Fuente: [RESTORATION_VISUAL.css](RESTORATION_VISUAL.css). El coordinador la copia al final del CSS inline de `index.html`. **No enlazar este archivo como dependencia del runtime:** las URLs de paisaje del CSS están pensadas para el HTML de la raíz.

Cada `span.restoration-cell` debe usar las mismas variables `--c` y `--r` de la celda, heredando `--size` del tablero. Es decoración fija con `aria-hidden="true"`; nunca un nuevo objetivo táctil. El wrapper `.restoration-layer` y la celda usan `z-index:auto`, sin opacidad, filtro ni transformaciones en los padres que creen otro contexto. Así los fondos quedan bajo hielo1/piezas2 y el marcador hijo `b`, con z-index3, permanece por encima. Los marcadores solo se muestran en`data-active="1"`, tienen14px y no capturan punteros. El render de piezas conserva sus identidades y el soporte no cae ni se baraja.

Se admite `data-restored="0|1"` y también `false|true`, `data-active="0|1"` y daño pendiente`data-hp="0|1|2"`. Clases de material acordadas: `data-kind="path|water|garden|home"`; el CSS admite además `river|flora|shelter`. Otros valores reciben el material neutro, por lo que un fallback no oculta la celda.

Markup mínimo del HUD:

```html
<div class="encounter-brief">
  <div class="encounter-copy">
    <span class="encounter-kicker">Contexto real del encuentro</span>
    <strong class="encounter-place">Nombre existente del lugar</strong>
    <p class="encounter-purpose">Una instrucción narrativa breve.</p>
  </div>
</div>
<div class="restoration-meter">
  <span class="meter-label">Meta real y unidad</span>
  <strong class="meter-value">Actual / objetivo</strong>
  <div class="progress-track"><i style="width:0%"></i></div>
</div>
```

La barra necesita su semántica de progreso y números actualizados por el motor; el ejemplo solo muestra la estructura visual. En móvil, sustituir las líneas actuales de objetivo/barra en vez de apilar paneles nuevos. Mantener nombre del guardián y números legibles; no duplicar información para rellenar.

El resultado usa `.restoration-receipt` con `.restored-place` de dos columnas: cada columna contiene un`span` de Antes/Recuperado y su SVG nativo de puente, cauce, jardín u hogar. Después aparecen`h3` con lugar,`p` con cambio real y`blockquote` con la frase de Confite. La primera viñeta queda gris y la segunda conserva color; el componente solo se presenta después de una victoria ganada. No depende de otro paisaje raster ni inventa restauración desde CSS.

## Límites de revisión

CSS, atlas y contrato preparados sin editar `index.html`. El SVG pasó validación XML y se rasterizó para inspección a1280×640; la vista temporal no es dependencia del juego. La integración debe comprobar320×640 y390×844 con tablero/herramientas completos y foco visible; no reducir áreas táctiles para ganar espacio. Revisar la diferencia entre0,parcial y100% restaurado, también con movimiento reducido. Los números y la victoria solo pueden proceder del motor. El coordinador valida la versión final y documenta capturas/pruebas.
