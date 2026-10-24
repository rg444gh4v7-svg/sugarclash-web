# Sugar Clash — guía visual compartida

## Dirección vigente · 23 de octubre de2026

**Descolorido y oscuro frente al color recuperado; casual para público amplio, «tampoco tan infantil».** Jose corrigió la propuesta clara: «se está saliendo de la línea de lo que es descolorado, lo que era dark y lo que era color. Mantente en esa línea». Esta es la última decisión creativa y prevalece sobre el tema marfil y sobre la presentación histórica de cristal/morado genérico.

Jose confirmó después la base casi monocroma, el regreso progresivo del color y el logo «sobrio». Conservar el logo nuevo, la estructura nueva de entrada al juego y el tono cuidado. La base es carbón y petróleo, con color localizado y una restauración perceptible del paisaje. La referencia conceptual sigue siendo [CONCEPT.md](CONCEPT.md). Esta es la única guía visual vigente para Claude y Codex; [VISUAL_REBOOT.md](docs/VISUAL_REBOOT.md) registra la iteración clara superada y [legacy/VISUAL_STYLE.md](legacy/VISUAL_STYLE.md) conserva el contexto de Atlas y Ecos.

Jose pidió después «sigue mejorando, se ve genérico». La iteración de expedición expresa la identidad mediante cartografía de la ruta real, guardianes y una huella de color que nace en el río. Conserva el logo y el tono sobrio; sustituye el panel central y los accesos como tarjetas iguales. [Implementación y pruebas](docs/EXPEDITION_QA.md).

### Nueva etapa autorizada · 23 de octubre · en validación

Jose autorizó cuatro mejoras conectadas: **coherencia visual, restauración táctica del tablero, guardianes con condiciones propias y consecuencias concretas al ganar**, priorizando los primeros diez niveles. Esta autorización permite cambiar esas reglas de juego; no debe confundirse con una mera capa cosmética. No añade pagos, monedas, cobros de vida o premios nuevos. La implementación, el equilibrio y la experiencia humana de esta etapa siguen en validación; las publicaciones e informes anteriores no la acreditan.

La identidad dark/descolorido frente al color recuperado y el logo sobrio se mantienen. En el tablero, las marcas son **casillas del suelo**: permanecen en su sitio, no bloquean intercambios y no caen con las piezas. Capas restantes, casilla ordenada y fila activa deben distinguirse de caramelos, hielo y selección. La regla del guardián se comunica con una instrucción breve y una señal visible, sin un tutorial modal obligatorio.

Hay seis condiciones: **direct** (limpiar encima), **adjacent** (encima o vecino ortogonal), **power** (poder o Pulso activo que alcance la casilla), **ordered** (primera pendiente, una etapa por cascada), **color** (dorado 3 encima/adyacente; poderes o Pulso también cuentan) y **tide** (marcas de la fila activa; T1 alterna dos filas tras jugadas válidas). Cada casilla agotada libera un brote que limpia vecinos y puede activar poderes. Como máximo una condición nueva por encuentro; la diferencia debe cambiar decisiones, no limitarse a pedir más puntos. Datos y textos: [RESTORATION_ENCOUNTERS.json](docs/RESTORATION_ENCOUNTERS.json).

La campaña exige **cumplir su meta y restaurar todas las zonas**; `campaignWon(g)` valida ambas. Mostrar cantidades separadas y evitar que una barra llena parezca victoria si falta la otra condición. Los estados del guardián y del paisaje dependen del progreso real, nunca de una animación de entrada. El resultado muestra lugar, cambio y frase de Confite; la portada/atlas/aldea pueden recordar lugares ganados, sin conceder construcciones ni alterar el guardado por renderizar.

El atlas `assets/candies-restoration-v1.svg` está **en preparación**, con el contrato lógico de 4×2 del atlas vigente. Aún no se afirma que esté terminado, integrado, cacheado o probado; ese cierre necesita revisar siluetas, colores, geometría, carga y fallback. No generar o anunciar nuevos recursos por el solo hecho de que el nombre esté previsto aquí.

La prueba humana propuesta está en [RESTORATION_PLAYTEST.md](docs/RESTORATION_PLAYTEST.md): cinco personas, diez minutos iniciales, comprensión de reglas, intentos sin salir, aburrimiento y ganas de otra partida. Es un protocolo sin jugadores ni resultados registrados. La validación automática, el recorrido real y las comprobaciones móviles/offline de esta etapa necesitan su evidencia propia.

### Identidad y tono

Dulcelandia es un reino de confitería que perdió su color. Dulce Roja y Confite restauran guardianes, caminos y un hogar. La escena oscura o descolorida muestra lo perdido; el color que vuelve es una consecuencia de jugar. El misterio, la memoria y la revelación final de Confite conservan su lugar en la historia.

Un acabado casual cuidado significa formas legibles, ilustración con intención, respuesta clara y una siguiente acción comprensible. El tono es expresivo sin lenguaje de bebé ni apariencia general de juguete. Confite mantiene su SVG y emociones como compañero pequeño dentro del juego; el logo se sostiene por sus letras. No incorporar mascotas, letras de burbuja o glaseado inflado a la marca.

El cristal y la niebla pertenecen al lore. No teñir cada pantalla de violeta ni añadir minerales, neón y brillos para comunicar oscuridad. Carbón, petróleo y pizarra sostienen la interfaz; coral, oro y teal destacan acciones y acontecimientos concretos. Las referencias de mercado enseñan claridad y respuesta: no son una instrucción para copiar el estilo de Royal Match o Toon Blast. «Casual americano» no describe edad, etnia o nacionalidad del público.

### Recursos y geometría

| Recurso | Uso vigente y geometría |
|---|---|
| `assets/renacer-restoration-v3.webp` | Paisaje original de **1536×1024**: puente de confitería, reino descolorido, río teal y flores coral. Fuente vigente de la escena; una capa de color con máscara muestra restauración real. `renacer-meadow-v2.webp` queda descartado. No determina colisiones. |
| `assets/sugar-clash-logo-v2.webp` | Wordmark **SUGAR CLASH**, transparente, **1100×653**. Lettering ancho crema/coral, contorno petróleo y detalle dorado; sin mascota incorporada. Conservar proporción y aire alrededor con `object-fit:contain`. |
| `assets/icon-sugar-v2.svg` | Emblema **S**, lienzo **256×256**, petróleo/crema/coral; marca compacta y favicon. |
| `assets/icon-sugar-v2-192.png`, `-512.png`, `-180.png` | Variantes de **192×192**, **512×512** y **180×180** para manifest y Apple touch icon. Mantener coherencia con el SVG. |
| `assets/candies-toon-v2.webp` | Atlas RGBA **1280×640**, **4×2**, celdas **320×320**. Orden lógico: rosa, verde, azul, dorado, violeta, coral, especial y chocolate. Mantener colores/siluetas distinguibles y la correspondencia del motor. |
| `monsters-t1-v18.webp` … `monsters-t8-v18.webp` | Ochenta guardianes, atlas **5×2**, celdas **320×320**. Nivel `n` usa `n-1`; jefe usa la celda 9. Nombre y número permanecen legibles. |
| `combatants-v18.webp`, `buildings-v18.webp` | Atlas **5×2** de combatientes y diez edificios, con su orden existente. La pintura y los marcos no cambian hitboxes, estados o premios. |

El paisaje y el atlas nuevos conviven con los retratos y edificios existentes. [ART_ASSETS.md](docs/ART_ASSETS.md) documenta los recursos históricos; conservarlos para compatibilidad y fallbacks. No presentar una reutilización de paisaje como ocho ilustraciones nuevas ni la inclusión en caché como QA completa.

### Color y tipografía

Paleta coordinada para la capa final dark/color:

| Uso | Valor |
|---|---|
| Fondo carbón | `#141820` |
| Superficie | `#20262e` |
| Superficie elevada | `#29323c` |
| Texto hueso | `#eee7db` |
| Texto secundario | `#adb5b5` |
| Borde | `#414b56` |
| Acción principal coral | `#cf9279`, texto carbón |
| Acento oro | `#c8ab7d` |
| Acento teal | `#7ba9a6` |
| Nombres del mundo | Fraunces450–500 en territorios y guardián próximo |
| Controles y datos | Karla; peso700 habitual y variantes legibles según función |

La pizarra del tablero deja que sus piezas conserven color. Acentos localizados, radios de 12–16 px, superficies mates y sombras de contacto. Evitar resplandor generalizado, sobrecarga de cápsulas y bordes de juguete. Un foco principal por vista.

Karla y Fraunces están incrustadas como WOFF2; los controles usan Karla y los nombres del mundo, Fraunces. Licencias OFL: [Karla](docs/FONT_LICENSE_KARLA.txt) y [Fraunces](docs/FONT_LICENSE_FRAUNCES.txt). No solicitar fuentes a Google en runtime. Todo el motor, HTML y CSS sigue en `index.html`, sin framework ni dependencias nuevas de runtime.

### Restauración y progreso real

La escena recibe un estado `--restored` entre **0 y 1**, derivado del progreso real: sin restaurar, descolorida; al avanzar, recupera color. En la portada, `restorationVisual()` deriva los bordes de una máscara radial que nace en el río y descubre una segunda capa de color. La capa base permanece gris. En atlas/partida se mantienen los filtros ligados a la sesión y al capítulo. No filtrar textos, recursos, botones, foco accesible ni piezas del tablero. El jugador debe poder leer y actuar desde el estado inicial.

En portada y atlas, usar victorias demostradas del capítulo; en partida, el objetivo real de la sesión. Revisar los estados inicial, intermedio y completo. La transición acompaña una diferencia real, no una animación que finge progreso al abrir la página. No escribir guardado ni conceder color permanente desde un render. Un paisaje recuperado puede seguir rodeado de interfaz oscura.

### Composición de pantallas

- **Portada de juego:** logo, contexto breve del capítulo, escena, siguiente nivel, Jugar/Continuar, progreso real y accesos directos a modos. `.expedition-home`, `.expedition-stage`, `.expedition-route`, `.expedition-dock` y `.expedition-restoration` son la estructura vigente. Los diez hitos salen de `starsAt()`/`levelOpen()` y llaman a `requestLevel()`; ningún hito concede progreso por sí mismo. El mapa es la escena, con la acción principal bajo él. No volver al titular editorial dominante de una landing. En móvil, comprobar que Jugar, Guerra y Royale sean alcanzables al entrar.
- **Fuente de acceso:** `campaignNext()` elige territorio/nivel y `continueCampaign()` entra por `requestLevel()`. Mostrar guardianes, recursos y marcas reales. La campaña reserva una vida al entrar y la devuelve una sola vez al ganar; perder o abandonar la consume. No alterar esa regla para una composición.
- **Partida:** guardián/nombre, objetivo y cantidad restante, movimientos, tablero y Pulso manual de Confite. Tutorial contextual con combinación de cuatro preparada, sin modal obligatorio. El paisaje y el guardián acompañan la restauración mediante el objetivo real; las piezas y poderes son el foco visual.
- **Atlas:** capítulo, paisaje, progreso y ruta de diez guardianes. Próximo/completado/bloqueado distinguibles; los estados bloqueados conservan nombres y requisitos legibles. Ningún render cambia estrellas.
- **Aldea:** escena y camino de diez edificios interactivos sobre fondo secundario. Seleccionar inspecciona; beneficio, precio y construcción explícita viven en el panel. El resultado conecta miel ganada con la próxima construcción sin obligar a visitarla.
- **Modos:** Guerra y Royale son locales contra IA. Diario mantiene tablero por fecha local, acceso gratuito y premio limitado a una reclamación. Supervivencia y Zen explican su ritmo. Nombres de juego antes que lore.
- **Recursos y modales:** cabecera compacta y navegación clara; superficies carbón/petróleo con texto hueso. Cerrar un modal de recursos conserva la arena pausada hasta continuar. Recursos, costes y controles deben seguir legibles en las tres fases de restauración.

La capa visual no cambia balance, guardados, costes, requisitos, premios ni acceso a modos. Los anuncios seguirían siendo voluntarios; no hay SDK publicitario ni pagos reales conectados. No prometer multijugador online.

### Respuesta y movimiento

Selección, intercambio, rechazo, creación de poder, impacto, caída y victoria reciben respuestas breves y claras. El bloque `FEEDBACK_START` concentra la capa cosmética: `feedbackHit()`, `feedbackCombo()` y `feedbackVictory()` acompañan resultados reales. `feedbackCancel()` limpia temporizadores, clases, partículas y voces al cambiar de sesión/pantalla u ocultar la página.

La celebración de victoria ocurre después de validar y guardar una victoria ganada. No celebrar por renderizar, visitar una pantalla o importar un guardado. Partículas finitas y acotadas, sin consumir RNG del motor ni modificar premios o campos persistentes. No añadir animación ambiental perpetua ni efectos que tapen piezas o retrasen la siguiente acción.

Respetar `prefers-reduced-motion`, visibilidad, pausa y silencio. La alternativa reducida conserva información con una señal quieta y legible. Canvas DPR máximo 2 y coordenadas lógicas independientes del tamaño CSS.

### Verificación y alcance

La versión integrada pasó69 pruebas, revisión de navegador a320×640,390×844 y escritorio, y recarga offline con el servidor de QA apagado. La evidencia y el alcance están en [DARK_COLOR_QA.md](docs/DARK_COLOR_QA.md). Mantener estas comprobaciones en futuras ediciones: logo sin deformación, acciones alcanzables, navegación sin colisión, textos/requisitos legibles, tablero completo y sin scroll horizontal. Revisar transparencia del logo, cada celda del atlas e iconos. Distinguir navegador emulado de teléfono físico.

Validar especialmente restauración a 0, intermedia y 1 sin teñir la interfaz ni desaturar fichas. Cada edición de código exige `SYNTAX OK`, pruebas pertinentes y revisión visual; las reglas requieren recorrido real del motor. Verificar manifest, versión de caché, carga y offline. Un catálogo o un push no prueban versión servida ni despliegue.

Las comparaciones y decisiones de producto están en [MARKET_STUDY_RENACER.md](docs/MARKET_STUDY_RENACER.md). Los recorridos automatizados comprueban reglas y acceso; no miden diversión, retención ni éxito comercial.

### Publicación verificada

Jose autorizó «Publica». La versión de expedicióne94f27a está publicada en https://sugarclash-web.vercel.app/, con despliegueREADY y archivos servidos comprobados byte por byte. [Destino, versión y evidencia](docs/DEPLOYMENT_EXPEDITION.md). La primera publicación36aba63 permanece documentada como historial. Mantener el contraste dark/descolorido frente al color recuperado y el logo sobrio en futuras ediciones.
