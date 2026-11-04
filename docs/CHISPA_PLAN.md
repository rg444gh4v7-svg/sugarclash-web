# CHISPA · plan de cambio del juego

**Fecha:** 3 de noviembre de 2026 · **Estado:** P01–P04 implementados y validados técnicamente; P05 pendiente. [Informe actual](CHISPA_PROTOTYPE_QA.md).

Jose pidió cambiar el juego y «planea todo» después de la propuesta de CHISPA. Esta decisión sustituye la ampliación de Renacer como siguiente trabajo. Este plan se redactó antes de implementar. Jose autorizó después continuar: el prototipo de doce escenas ya existe. El nombre comercial, las pruebas humanas y los ingresos siguen pendientes.

## 1. Qué vamos a crear

**Un puzzle de un dedo en el que cada disparo despierta una máquina y cambia las posibilidades del siguiente.** Apuntas y sueltas una chispa. Rebota en superficies legibles, enciende lámparas y activa mecanismos que giran espejos o abren compuertas. El mundo casi monocromo recupera color y movimiento por esas acciones reales.

Ejemplo: el primer tiro enciende la rueda de un molino y gira un espejo. El segundo utiliza ese espejo para entrar por una ventana y encender una casa. Resolver ese pequeño sistema es la experiencia que debe sostener el juego.

**Hipótesis central:** anticipar una transformación y aprovecharla produce satisfacción suficiente para querer otra escena. El contraste oscuro/color comunica y recompensa esa transformación. Todavía no se ha probado con personas.

Público inicial a contrastar: personas que disfrutan puzzles breves, accesibles y con algo de planificación. Formato vertical, una mano, ratón o teclado como alternativas. Idioma inicial español; instrucciones cortas y estructura preparada para inglés antes de una prueba internacional. Duración deseada de escena: 45–90 segundos una vez entendido el gesto; se medirá, no es un límite de tiempo.

**CHISPA es un nombre de trabajo.** No se ha comprobado disponibilidad comercial, dominio o marca. Jose decide el nombre y la identidad finales después de ver una prueba jugable; la programación no depende de resolver ahora la marca.

## 2. Decisiones cerradas y decisiones que requieren evidencia

| Decisión para el próximo desarrollo | Estado y motivo |
|---|---|
| Sustituir el núcleo match-3 por puntería y transformación de geometría | Cambio de rumbo solicitado por Jose; validar la nueva experiencia antes de reemplazar producción. |
| Conservar oscuridad/descolorido frente al color recuperado, tono sobrio y Confite | Decisiones creativas previas que siguen vigentes. |
| Conservar Dulcelandia, memoria y restauración como universo disponible | El prototipo no reescribe la historia ni muestra la revelación final de Confite. Los ocho territorios no obligan a producir 80 niveles nuevos. |
| Motor determinista, sin reloj, vidas ni consumo de moneda por intentar | Hace legibles los errores y permite repetir por dominio. |
| Deshacer y reiniciar gratis; objetivo claro de lámparas | Aprender y experimentar forman parte del juego. |
| Primer prototipo de doce niveles con geometría provisional | Primero verificar la acción central. Arte final y campaña grande dependen del resultado. |
| Prototipo web separado del runtime publicado | Mantiene datos y una versión utilizable durante la transición. |
| Nombre final, compras, plataforma comercial, presupuesto y campaña final | Pendientes de evidencia y de decisiones concretas de Jose. No son trabajos ya autorizados a gastar dinero. |

Las mejoras tácticas de Renacer que quedaron en propuesta, incluido `docs/art/TACTICAL_HINTS.js`, se conservan como material histórico. No son una dependencia de CHISPA ni el siguiente encargo.

## 3. Contrato de juego

La especificación de los doce encuentros vive en [CHISPA_LEVELS.md](CHISPA_LEVELS.md). Este contrato prevalece sobre una ilustración o una animación que sugiera otra regla.

1. **Preparar.** Fuente fija por nivel. Arrastrar define dirección; la distancia del gesto no cambia velocidad ni potencia. El mundo no avanza mientras apuntas. Una cancelación de puntero no dispara.
2. **Prever.** Mostrar la trayectoria bajo la geometría actual, hasta el primer actuador inactivo, absorbente, salida o límite del motor. La vista previa usa el mismo cálculo que el disparo. No muestra una ruta que suponga cambios futuros.
3. **Disparar.** El motor calcula el recorrido completo de forma pura; después se reproduce. Las superficies rebotables reflejan, las absorbentes detienen, las lámparas son sensores que dejan pasar. La geometría se mantiene fija durante ese tiro.
4. **Activar.** El primer actuador inactivo alcanzado absorbe y termina el tiro. Al resolver, aplica un cambio: un espejo pasa a su orientación final o una compuerta se abre. El actuador queda encendido y pasante en los siguientes tiros. No hay interruptores cíclicos en el prototipo.
5. **Resolver.** Las lámparas tocadas quedan encendidas. Aplicar la transacción una sola vez, actualizar contadores y mostrar brevemente el cambio. Reanudar/ocultar nunca repite activaciones.
6. **Ganar.** Encender todas las lámparas de la lista objetivo del nivel. No exigir actuadores decorativos ni un número exacto de tiros; una solución alternativa legítima cuenta. Se registra la mejor cantidad de tiros de una victoria.
7. **Experimentar.** Fallar no quita vida ni progreso previo a ese tiro. Deshacer restaura exactamente el estado anterior del nivel, contador y mecanismos. Reiniciar vuelve al estado inicial con confirmación sólo si hay un avance que perder. Salir pausa y conserva la sesión local cuando el guardado de sesión esté implementado.

El contador puede mostrar «Referencia: 3 tiros» sin presentar una derrota al superarla. Los reintentos no son un recurso comercial. La restauración permanente se concede al completar; el color parcial dentro de la escena refleja sólo el estado actual y retrocede al deshacer. La transformación entre tiros debe aparecer en los primeros dos encuentros: una prueba de CHISPA no puede comenzar con varios minutos dedicados sólo a rebotes.

La progresión de prueba será lineal: completar abre la siguiente escena, y las ya completadas se pueden repetir. No hay requisito de referencia de tiros, estrellas o pago para avanzar. El selector comunica disponible/completada/pendiente por texto y estado. Los recorridos de QA pueden probar datos individualmente, pero la evidencia de progresión debe recorrer también esta entrada real.

Para lámparas y colisiones casi simultáneas, esquinas, límites de rebote y distancias mínimas, se requiere orden total estable y tolerancias explícitas. Deben quedar especificados y probados en el hito P02; ninguna escena se aprueba por parecer resoluble en un boceto.

## 4. Qué incluye cada entrega

| Entrega | Incluye | Queda fuera |
|---|---|---|
| **Prototipo** | Doce escenas provisionales; fuente, paredes/espejos, lámparas, actuadores y compuertas; apuntar/vista previa/disparar; deshacer/reiniciar; selector sencillo; silencio/movimiento reducido; informe de soluciones y sesiones cualitativas. | Arte final, nueva marca, cuenta, monedas, vidas, anuncios, compras, ranking, reto diario y multijugador. |
| **Muestra de calidad** | Seis de esas escenas acabadas, un lugar con personalidad, Confite discreto, respuesta visual/sonora y navegación final propuesta. Conservar soluciones y motor comprobados. | Ampliación de campaña o sistemas económicos para compensar una mecánica débil. |
| **MVP para prueba ampliada** | 24 niveles en tres lugares de ocho; mismo núcleo, selección/progreso, guardado versionado, ajustes, ayuda contextual, rendimiento y accesibilidad revisados. Medición mínima sólo tras definir dónde y cómo se recoge. | Ocho mundos/80 niveles, aldea, Guerra/Royale, inventario de ayudas, tienda o generador procedural. |
| **Lanzamiento comercial candidato** | MVP validado, distribución elegida, implementación y QA del SDK si se acepta un portal; requisitos, privacidad, soporte y publicación verificada. Monetización sólo cuando esté técnicamente disponible y probada. | Promesas de selección del portal, ingresos, viralidad o equivalencia entre métricas web y móvil. |

No portar los cuatro destinos de Renacer al nuevo juego. Inicio tendrá Jugar/Continuar como acción dominante; selección de escenas y ajustes serán secundarios. Dentro de la escena: meta, deshacer, reiniciar y salir. El resultado ofrece siguiente escena o repetir. La navegación propuesta se detalla en [la dirección visual](CHISPA_VISUAL.md).

El universo admite más mecanismos y lugares después. Cada mecanismo nuevo necesita una decisión distinta y pruebas propias; no se añade por completar una lista de características. Un reto diario curado y una repetición compartible son experimentos posteriores, no condiciones para empezar.

En el MVP, al menos ocho de las24escenas deben proponer más de una secuencia o ruta significativa, sin exigir un único camino oculto. Es un objetivo de diseño a comprobar, no una cantidad de soluciones demostrada. La prueba debe distinguir satisfacción al resolver por primera vez de interés por dominar o repetir.

## 5. Arquitectura y límites técnicos

### Desarrollo aislado

- Mantener `index.html`, `manifest.json`, `service-worker.js` y el runtime de Renacer sin cambios durante el prototipo.
- Próximo runtime propuesto: **`prototypes/chispa/index.html`**, un único HTML/CSS/JS vanilla. La ruta **ya existe** y está validada técnicamente; conservarla como punto de partida. Sin framework, bundler ni dependencias nuevas de runtime.
- Servir esa carpeta como raíz de un origen QA nuevo, por ejemplo `http://127.0.0.1:4211/`, después de comprobar que está libre. No usar 4177 ni producción para fixtures, importaciones o pruebas.
- No registrar service worker en el prototipo. Así se evalúa la versión servida y se evita heredar el worker de Renacer al servir la carpeta aislada. PWA/offline se incorporan en P09, al candidato comercial; tampoco son una dependencia del MVP de observación P07–P08.
- Arte inicial con SVG/canvas propio y recursos locales. Reutilizar fuentes con sus licencias y utilidades de audio pertinentes; no arrastrar tableros, economía, sesiones de Arena o código sin uso.

### Separación interna, sin módulos de runtime externos

| Bloque propuesto | Responsabilidad y límite |
|---|---|
| `CHISPA_LEVELS` | Datos con id/revisión, límites, fuente, superficies, lámparas, actuadores y vínculos por id. Coordenadas lógicas; validación de referencias y estados iniciales. |
| `CHISPA_GEOMETRY` | Barrido del círculo de la chispa contra superficies con grosor/extremos redondeados, reflexión, sensores y desempates. Radio físico y visual coherentes, no sólo un rayo central. Sin DOM, reloj, audio, RNG ni guardado. |
| `CHISPA_RULES` | `traceShot(level,state,angle)` produce recorrido/eventos; `applyShot` produce estado siguiente. Congelación de geometría y resolución única. |
| `CHISPA_SESSION` | Estado de apuntado/reproducción/resolución/pausa/completado, historial para deshacer y token de sesión. Salir/ocultar invalida tareas antiguas y pausa sin duplicar efectos. |
| `CHISPA_VIEW` | Dibujo y presentación del mismo recorrido calculado, transformación CSS↔coordenadas lógicas, controles DOM accesibles, foco y entrada alternativa. |
| `CHISPA_SAVE` | Valor por defecto, normalización, validación de versión y escritura protegida. Ningún render concede progreso. |
| `CHISPA_AUDIO` | Web Audio iniciado por interacción, límites de voces, pausa/silencio y cierre de recursos; nunca decide reglas. |

API y nombres son una propuesta de implementación, no funciones ya existentes. Un solo implementador integra el HTML; otros agentes entregan datos, arte o auditorías en archivos separados para evitar sobrescrituras.

**Presupuestos iniciales a medir:** marco lógico de presentación 360×480 adaptable sin estirar, DPR≤2, con campo físico cuadrado de 100×100 unidades y aire ilustrativo fuera del campo. El borde del campo es salida; paredes interiores/espejos reflejan y una compuerta cerrada absorbe. Máximo seis reflexiones y 300 unidades de recorrido por tiro, con terminación exacta definida en CHISPA_LEVELS; detención estable sin bucles infinitos. El tiempo visual del tiro será acotado, con alternativa breve de movimiento reducido. Ningún objetivo depende de fotogramas o del refresco del dispositivo. Si las pruebas de geometría requieren cambiar los límites, actualizar contrato, niveles y pruebas conjuntamente.

La vista previa podrá recalcularse al cambiar el ángulo; no se mantendrá un RAF de decoración. Cualquier RAF de reproducción termina o se pausa al resolver, salir u ocultar. Teclado: apuntado incremental, ajuste fino, disparo y cancelación; botones con foco visible. Se verificará que el puzzle siga siendo utilizable sin distinguir colores y sin audio.

## 6. Datos y continuidad

**Nueva clave propuesta: `chispa_save_v1`.** No reutilizar `sugarclash_renacer_v1` ni `sugarclash_save_v1`. No transformar estrellas, miel, gemas, vidas o edificios en progreso nuevo: no tienen equivalencia demostrada. Los guardados anteriores permanecen íntegros.

Esquema mínimo del MVP: versión de esquema, revisión de contenido, niveles completados por id/revisión, mejor número de tiros, siguiente escena derivada, ajustes y sesión reanudable validada. Cualquier campo nuevo necesita valor por defecto y normalización. En el prototipo sólo guardar preferencias si se necesitan; el historial de pruebas debe poder exportarse sin tocar los datos personales del jugador.

- Conceder una victoria una vez por intento resuelto; repetir conserva la mejor marca y no duplica recompensas.
- Deshacer tras victoria no revoca un nivel legítimamente completado ni crea otra concesión; si se vuelve a jugar se abre una sesión nueva. Deshacer dentro de una sesión todavía abierta restaura únicamente esa sesión.
- La revisión de un nivel debe invalidar una sesión incompatible con mensaje claro. No borrar por ello las marcas históricas: distinguir revisión completada de revisión actual.
- Importar requiere validar tamaño, estructura, ids y rangos. Un error de guardado informa y permite seguir; no ejecutar `localStorage.clear()` ni limpiar otras claves.
- La medición, si se introduce, tiene configuración y límites propios. No convertir el guardado de progreso en un identificador publicitario.

## 7. Secuencia de trabajo y puertas de decisión

Las estimaciones son **horas de trabajo enfocadas para presupuestar**, no fechas prometidas ni autorización de gasto. No incluyen reclutamiento, espera de retorno D7, revisión del portal o una nueva producción de arte extensa. Se revisan al completar el primer motor. Paralelizar auditorías y arte puede reducir calendario, no hace desaparecer las horas ni las dependencias.

| Hito | Entrega verificable | Estimación inicial | Decisión al terminar |
|---|---|---:|---|
| **P00 · Plan** | Este plan, contrato/niveles, visual, validación/negocio, backlog y guías compartidas actualizadas | Entrega documental actual | Hay una dirección implementable, todavía sin prueba jugable. |
| **P01–P02 · Base y motor** | Origen separado, geometría pura, transacciones, vista previa consistente, pruebas de rayos/esquinas/actuadores/límites | 24–40 h | Continuar sólo si la simulación es estable y fácil de leer. |
| **P03–P04 · Prototipo completo** | Entrada real, deshacer, pausa/salida, doce escenas, soluciones reproducibles y QA móvil | 24–40 h | Se puede entregar a participantes sin explicación del desarrollador. |
| **P05 · Primera prueba** | 12–20 sesiones observadas, conteos y decisiones documentados; máximo dos rondas de corrección acotadas | 12–24 h + sesiones/esperas | Seguir, corregir o replantear según comprensión y deseo observado de continuar. |
| **P06 · Muestra de calidad** | Seis escenas acabadas y comparación con el prototipo, lectura de mecanismos y personalidad | 20–36 h | El acabado mejora la lectura y la experiencia sin esconder reglas débiles. |
| **P07–P08 · MVP y prueba ampliada** | 24 escenas, guardado, idioma, medición definida, QA/distribución de prueba y cohortes con D1/D7 maduros | 36–64 h + ≥7 días de observación | Elegir si invertir en más contenido y canal comercial. |
| **P09 · Comercial y relevo** | Integración del canal elegido, archivo navegable de Renacer, PWA, QA y publicación/rollback verificados | 16–32 h + tiempos externos | Sólo después de validar producto y preparar la transición. |

Orden inicial: **P01 → P02 → P03 → P04 → P05**. No producir los 24 niveles ni el arte completo mientras el núcleo esté en duda. Backlog ejecutable y responsables en [CHISPA_BACKLOG.md](CHISPA_BACKLOG.md).

Las puertas son explícitas: una suite verde demuestra reglas, no diversión; unas sesiones positivas no demuestran retención; retención web no demuestra rentabilidad móvil. El [plan de validación y negocio](CHISPA_VALIDATION_BUSINESS.md) fija muestra, métricas, hipótesis y límites.

## 8. Validación técnica requerida

**Motor:** reflexión conocida, sensores antes/después de una pared, primera colisión, actuador absorbente/pasante, geometría congelada, aplicación única, esquinas y empates, límite de rebotes, escenas inválidas e invariancia al framerate. Verificar un mismo estado/ángulo contra preview y resolución.

**Sesión:** toque/arrastre/ratón/teclado, puntero cancelado y multitouch, doble disparo, deshacer exacto, reinicio, salida durante reproducción, ocultación/reanudación, callbacks obsoletos y victoria al encender la última meta. No simular una victoria para afirmar que se resolvió una escena.

**Contenido:** cada nivel necesita solución con ángulos y revisiones exactos obtenida del motor real; repetirla desde cero en un recorrido aislado. Un explorador puede ayudar a encontrar atajos, pero una búsqueda angular finita no prueba que no existan otros. Reservar un margen de ángulo razonable y observar ejecución humana; un acierto de precisión extrema no cuenta como escena accesible.

**Datos:** valores por defecto, corrupción/versión incompatible, reanudación, mejores marcas, exportación/importación y no escritura de las dos claves históricas. **PWA, cuando exista:** catálogo real, actualización desde versión anterior, offline sin fallback al juego equivocado y worker limitado a su aplicación.

**Navegador:** 320×640, 390×844 y escritorio; luego al menos un teléfono físico Android y uno iOS si están disponibles. Separar emulación de prueba física en los informes. Objetivo, fuente y controles alcanzables sin scroll de la partida, sin desbordamiento horizontal, respuesta a 0/intermedio/completo, foco y zoom, movimiento reducido, silencio y pausa al ocultar. Registrar navegador/dispositivo y fallos, no declarar compatibilidad sin comprobarla.

Las pruebas nuevas vivirán en `tests/chispa-*.test.cjs` y el recorrido en `scripts/chispa-playthrough.cjs` cuando se implementen. La extracción del script para validar sintaxis se aplica al HTML del prototipo. Las instrucciones actuales de sintaxis/suite/recorrido de Renacer siguen siendo obligatorias si alguien modifica el runtime de la raíz. Durante el prototipo no hay motivo para hacerlo.

## 9. Distribución, monetización y operación

La prueba inicial será gratuita, sin tienda ni SDK comercial. Jose puede reclutar participantes; este plan no envía invitaciones ni autoriza mensajes a terceros. Para recopilar métricas remotas hay que elegir servicio, datos y comunicación al usuario, con su coste si lo hubiera. Sin servicio elegido, usar observación y exportación voluntaria de resultados.

Canal candidato: web directa y evaluación de portal. La publicación actual en Vercel no proporciona audiencia ni ingresos por sí misma. La aceptación y monetización del portal tienen requisitos y selección propios. Las apps nativas son una decisión posterior: requieren pruebas, costes y economía específicos.

Opciones para evaluar después del MVP: anuncio voluntario para una pista contextual, personalización estética y capítulos adicionales. Reintentar y deshacer siguen siendo gratis. Evitar inflar dificultad para vender la solución. El modelo económico se decide con datos y capacidad real del canal; no activar botones de compra o anuncios que no funcionen. No asumir que un portal admite todas las compras propuestas.

La operación mínima necesita: contacto de soporte que Jose elija, registro de errores sin datos innecesarios, proceso para recuperar guardados exportados, calendario de revisión y una persona que pueda arreglar una escena bloqueada o revertir una versión. No comprometer eventos semanales ni contenido infinito sin presupuesto de mantenimiento.

**Riesgo de contenido:** 24puzzles finitos pueden agotarse en una visita. Medir cuánto cuesta crear una escena, cuánto dura y cuánta gente termina todo. Mantener el D1/D7 general y añadir ese contexto, sin excluir a quienes terminaron para mejorar la cifra. Si la experiencia interesa una vez y nadie desea repetir, estudiar capítulos de precio fijo y su demanda; un modelo gratuito sostenido por anuncios necesitaría demostrar repetición o una cadencia de contenido económicamente viable. No rechazar una buena experiencia finita sólo porque se haya elegido el modelo de negocio equivocado.

## 10. Cómo pasar de Renacer a CHISPA

1. **Durante el desarrollo:** Renacer sigue como juego publicado; CHISPA se prueba en un origen/preview aislado. Conservar el commit base y el despliegue inmutable documentado; no confundirlo con cambios nuevos.
2. **Antes del relevo:** empaquetar y comprobar una versión congelada de Renacer en `/renacer/`, con rutas de recursos, manifest y worker propios de alcance `/renacer/`. Esta ruta todavía no existe: no enlazarla hasta probarla. No reutilizar `legacy/`, que ya contiene otra edición. El almacenamiento local comparte origen entre rutas y seguirá usando la clave original de Renacer.
3. **Ensayo:** abrir ambas ediciones en el mismo origen QA, verificar sus guardados separados y la actualización desde renacer-v7. El worker de CHISPA limpiará sólo cachés con prefijo propio `chispa-`; el del archivo, sólo su prefijo propio. Nunca limpiar almacenamiento del usuario. Eliminar un worker/caché antiguo, si hace falta, requiere demostrar que no rompe el archivo ni el acceso offline.
4. **Publicación:** preparar versión candidata y rollback. Con la autorización de publicación que corresponda, verificar proyecto/organización/destino, desplegar, comprobar estado READY, URL pública y hashes de HTML/worker/manifest/recursos de esa versión. No afirmar publicación por un push.
5. **Después:** comprobar Inicio, primer nivel, continuar, guardado, enlace de Renacer y offline. Conservar evidencia de versión y rutas. Si falla el acceso o la integridad de datos, volver al despliegue anterior verificado y registrar el fallo; no forzar una migración de guardado para solucionarlo.

No cambiar el alias de producción durante el prototipo. Ningún éxito técnico de Renacer (125 pruebas o recorrido 80/80) valida niveles, controles, retención o ingresos de CHISPA.

## 11. Cómo sabremos si merece seguir

Se busca que una persona pueda describir **qué cambió por su disparo**, utilizar ese cambio y elegir otra escena por voluntad propia. Comprensión, ganas de seguir y regreso deben medirse separadamente. El protocolo y los umbrales internos propuestos están en [CHISPA_VALIDATION_BUSINESS.md](CHISPA_VALIDATION_BUSINESS.md).

Riesgos principales: quedar en un puzzle de rebotes con decoración; lectura confusa de materiales; ángulos de precisión excesiva; repetición de un truco; coste alto de crear escenas; adquisición que no se recupera con ingresos. Cada riesgo debe tener una prueba y una decisión, no resolverse añadiendo menús.

**Estado de ejecución:** P01–P04 completos técnicamente: motor, escena de molino y doce encuentros recorridos. Próxima acción: P05, observar participantes reales y registrar su comprensión e interés. [Evidencia](CHISPA_PROTOTYPE_QA.md).

## 12. Lectura para Codex, Claude y Jose

1. [AGENTS.md](../AGENTS.md), [CONCEPT.md](../CONCEPT.md) y [VISUAL_STYLE.md](../VISUAL_STYLE.md): autoridad y contexto vigente.
2. Este documento: alcance, orden y transición.
3. [CHISPA_LEVELS.md](CHISPA_LEVELS.md): reglas y doce encuentros propuestos.
4. [CHISPA_VISUAL.md](CHISPA_VISUAL.md): lectura visual y criterios de arte/interfaz.
5. [CHISPA_VALIDATION_BUSINESS.md](CHISPA_VALIDATION_BUSINESS.md): competencia, pruebas humanas, distribución y economía.
6. [CHISPA_BACKLOG.md](CHISPA_BACKLOG.md): tareas y criterios de aceptación.
7. [CHISPA_HANDOFF.md](CHISPA_HANDOFF.md): arranque y encargo listo para otro agente.

Las instrucciones históricas de Renacer conservan su alcance para ese runtime; la nueva decisión de Jose determina qué se desarrolla a continuación. No usar un informe de una versión anterior como evidencia de una entrega nueva.
