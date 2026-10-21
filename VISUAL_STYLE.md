# Sugar Clash — guía visual compartida

## Dirección vigente: Renacer · El Cristal Vivo

Jose pidió reconstruir el juego desde cero conservando concepto y filosofía, y después estudiar el mercado y mejorarlo. Esta decisión sustituye la antigua restricción de no reiniciar el diseño. La continuidad emocional y artística permanece. Referencia conceptual: [CONCEPT.md](CONCEPT.md). La guía histórica de Atlas y Ecos se conserva en [legacy/VISUAL_STYLE.md](legacy/VISUAL_STYLE.md).

### Identidad

Fantasía de confitería melancólica: restauración, memoria, cristal fracturado y un hogar que vuelve a encenderse. Confite mantiene el SVG y los cinco estados expresivos originales. Dulce Roja sigue siendo sanadora; los ochenta guardianes recuperan su luz. La revelación de Confite se reserva al final de T8.

Paisajes cinematográficos locales, niebla violeta mineral, rosa cálido, oro contenido y luz cyan. No reiniciar el arte como tarjetas con emojis, neón generalizado o mascotas sustitutas. La portada `title-world-v3-hd.jpg` sigue siendo la referencia de materiales. Los atlas existentes se reutilizan con su geometría real, documentada en [ART_ASSETS.md](docs/ART_ASSETS.md).

### Composición nueva

- Desktop: navegación lateral discreta, cabecera de recursos y paisaje protagonista con texto editorial. Móvil: cabecera compacta y navegación inferior; campaña, Guerra y Royale accesibles desde portada.
- Una acción principal clara. Prólogo opcional. Tutorial contextual con combinación de cuatro preparada, sin bloquear el tablero.
- Partida: guardián/nombre, objetivo legible, luz/niebla, movimientos, tablero y Pulso manual de Confite. El escenario recupera saturación con progreso real; la miniatura de Confite permanece también en móvil.
- Atlas: panorama del territorio, progreso real y ruta de diez criaturas con próximo/completado/bloqueado distinguibles. Ningún render cambia estrellas.
- Aldea: escena vertical, camino y diez edificios. Selección inspecciona; panel explica efecto/precio y acción explícita. Resultados conectan miel ganada con la próxima construcción.
- Diario: mismo tablero por fecha local, acceso gratuito y sin rachas castigadas. Guerra/Royale contra IA se identifican claramente como locales.
- Modales de vidrio oscuro, bordes finos y tipografía legible. Cerrar uno de recursos mantiene la arena pausada hasta que el jugador continúe.

### Base visual

| Uso | Valor |
|---|---|
| Fondo | `#120e1b` |
| Superficie | `#221b2d` |
| Texto | `#f6eddf` |
| Acento | `#e8c795` |
| Secundario | `#b4a8bc` |
| Rosa / cyan | `#ed94af` / `#9ce2df` |
| Títulos | Fraunces400–600 |
| Controles/datos | Karla400–800 |

Las fuentes están incrustadas como WOFF2 con licencias OFL en `docs/FONT_LICENSE_*.txt`; no se solicitan a Google en runtime. Todo el motor y CSS permanecen en `index.html`.

### Geometría de arte

- `worlds-cinematic-v1.webp`:2×4, panorama888×222. Conservar proporción4:1 y recortar al encuadrar.
- `monsters-t1-v18.webp`…`t8`:5×2, celda320×320. Nivel`n` usa`n-1`; jefe usa9.
- `combatants-v18.webp`, `buildings-v18.webp`:5×2. Cinco aliados/cinco rivales; diez edificios en orden.
- `candies-v18.webp`:4×2. Rosa, verde, azul, dorado, violeta, coral, cristal y bloque. Mantener formas/colores distinguibles.
- Arena/Aldea/HEX: escenas verticales locales. El arte no define colisiones ni concede premios.

### Movimiento y comprobaciones

Intercambios, caídas, cadenas y respuesta del guardián acompañan acciones reales. No hay animaciones ambientales perpetuas. Respetar movimiento reducido, visibilidad y limpieza de sesiones. Canvas DPR≤2 y coordenadas lógicas independientes del tamaño CSS.

Comprobar320×640 y390×844: sin scroll horizontal, tablero completo y controles alcanzables. No confundir navegador emulado con iPhone físico. Cada edición exige`SYNTAX OK`, pruebas y revisión visual pertinente; cambios de reglas añaden recorrido real. Los informes comerciales siguen siendo hipótesis hasta probar con jugadores. Esta reconstrucción se entrega local; publicar exige comprobar por separado el destino y la versión servida.
