# CHISPA · backlog de ejecución

**3 de noviembre de 2026.** Todas las tareas de implementación están **pendientes**. Sólo P00 corresponde a la entrega documental actual. El orden y las puertas de inversión se rigen por [CHISPA_PLAN.md](CHISPA_PLAN.md); las estimaciones de ese documento son hipótesis de esfuerzo, no compromisos de calendario.

## Responsables y forma de trabajar

- **Jose:** decisiones creativas, disponibilidad de participantes, presupuesto/canales y aceptación de entregas.
- **Implementador principal, Codex o Claude:** motor, integración y documentación de versión. Sólo una persona/agente edita el HTML a la vez.
- **Agente visual:** arte, señales y auditoría de lectura. Entrega fuentes separadas; el implementador integra.
- **Agente de contenido/QA:** datos y soluciones de niveles, revisión de reglas y regresiones.
- **Agente de producto/mercado:** protocolo, análisis y contraste de fuentes. No inventa participantes ni envía mensajes sin autorización.

Los roles pueden ser desempeñados por la misma persona. No se presupone que haya un equipo contratado ni que agentes de sesiones futuras conserven memoria: los documentos son el relevo.

## P00 · Dirección y plan

**Entrega actual:** plan maestro, doce encuentros propuestos, dirección visual, validación/negocio, este backlog y guía de relevo, con las instrucciones raíz actualizadas. Ningún nivel ni resultado humano se declara probado.

**Aceptación:** enlaces locales resolubles; separación entre decisiones, hipótesis y entregas; las guías ya no mandan seguir ampliando Renacer como próximo trabajo. El runtime y guardados publicados no cambian por esta entrega.

## P01 · Base aislada y referencia recuperable

**Depende de:** P00. **Responsable:** implementador.

- Revisar `git status`, preservar cambios ajenos y registrar el commit de inicio y versión publicada de Renacer.
- Crear `prototypes/chispa/index.html`, sin copiar el motor completo de Renacer ni introducir dependencias.
- Servir esa carpeta como raíz en un puerto QA libre distinto de 4177/producción; documentar la URL. Sin worker del prototipo.
- Crear bloques internos y validación de datos del nivel. Una escena provisional, sin arte final ni tienda.

**Aceptación:** abre directamente y no solicita recursos externos ni escribe claves históricas. Renacer no se modifica. Cerrar/salir no deja eventos o frames vivos. `git diff` identifica con claridad qué aplicación se tocó.

## P02 · Motor y primera máquina

**Depende de:** P01. **Responsable:** implementador; auditoría de contenido/QA.

- Especificar intersecciones rayos/segmentos y rayos/sensores, reflexión, tolerancias y desempates estables por distancia/tipo/id.
- Calcular preview y disparo con la misma función pura y la misma geometría congelada.
- Resolver lámparas pasantes, actuador inactivo absorbente con cambio entre tiros, actuador activo pasante y compuerta cerrada absorbente.
- Limitar recorrido y reflexiones sin bucle, azar, timestep o consumo de tiempo real como regla.
- Implementar transacción de tiro e historial exacto de estado; la animación representa un resultado ya calculado.
- Demostrar la escena de molino: primer tiro cambia un espejo; segundo usa su orientación nueva para encender una lámpara antes inaccesible por esa ruta.

**Aceptación:** pruebas significativas de reflexión, esquinas, sensores, activación única, límites y congelación. La misma entrada produce los mismos eventos/estado. Un error no se oculta ajustando la animación. Informe con ángulos y revisión de la escena; no declarar demostración antes de ejecutarla.

**Puerta:** si el cambio no se entiende visualmente o la simulación no es estable, corregir antes de añadir contenido.

## P03 · Controles y sesión completa

**Depende de:** P02. **Responsable:** implementador; auditoría visual.

- Apuntar, soltar, cancelar, teclado/ratón, ajuste fino y bloqueo de doble disparo/multitouch.
- Deshacer gratis, reiniciar, salir, pausa al ocultar y retorno con foco correcto. Token que invalida reproducciones de sesiones abandonadas.
- Meta de lámparas y progreso textual; resultado con siguiente/repetir. Sin vida, moneda, reloj o pérdida por exceder referencia.
- Instrucción contextual breve y ayuda accesible; silencio y movimiento reducido.

**Aceptación:** secuencia real de entrada→apuntar→disparar→cambio→deshacer→ganar→siguiente, y salir durante el tiro sin concesiones tardías. En320×640/390×844, campo y controles alcanzables sin scroll de la partida. Sin errores de consola del juego.

## P04 · Doce niveles y recorrido real

**Depende de:** P03. **Responsable:** contenido/QA; integración por implementador.

- Convertir [CHISPA_LEVELS.md](CHISPA_LEVELS.md) en datos geométricos exactos. Comprobar cada plano, no trasladar coordenadas de un boceto como si estuvieran validadas.
- Registrar soluciones del motor: revisión, estado inicial, ángulo por tiro y resultado esperado. Analizar atajos legítimos, precisión y duración.
- Crear `scripts/chispa-playthrough.cjs` y pruebas correspondientes; no invocar éxito ni escribir progreso para simular soluciones.
- Revisar salida/pausa/rehacer, zoom, audio, movimiento reducido y al menos navegadores de escritorio disponibles; registrar límites físicos todavía pendientes.

**Aceptación:** 12/12 resueltos con controles/reglas reales en entorno aislado; soluciones reproducibles, materiales distinguibles sin color y progresión de dificultad razonada. Es aprobación técnica, no validación de diversión.

## P05 · Prueba cualitativa y corrección acotada

**Depende de:** P04. **Responsable:** producto; Jose facilita participantes.

- Cerrar protocolo y objetivos internos antes de reclutar. Ejecutar 12–20 sesiones con personas ajenas al desarrollo.
- Registrar comprensión del gesto, del cambio geométrico y de la meta; reintentos voluntarios, elección de otra escena y motivos de abandono. Separar ayuda del moderador de descubrimiento autónomo.
- Devolver un informe con conteos, observaciones literales consentidas y propuesta de seguir/corregir/parar.
- Máximo dos rondas de corrección enfocadas en la misma hipótesis, con esfuerzo acordado; no añadir aldea o modalidades para subir tiempo de sesión artificialmente.

**Aceptación:** muestra y limitaciones identificadas, resultados reales y decisión explícita. Si no hay participantes, queda **pendiente**, aunque pase toda la suite.

**Puerta:** continuar a arte sólo si la transformación entre tiros se entiende y hay deseo observado de seguir; usar los criterios del [protocolo](CHISPA_VALIDATION_BUSINESS.md). Un porcentaje pequeño no se presenta como certeza estadística.

## P06 · Seis escenas con acabado

**Depende de:** resultado favorable de P05. **Responsable:** visual; integración por implementador.

- Un lugar original y seis escenas representativas, incluyendo inicio y una combinación avanzada. No rehacer la marca completa todavía.
- Confite sobrio, cambios materiales reales, conexiones entre actuador y elemento, respuesta breve y motivos sonoros.
- Comparar lectura y comodidad con versión provisional; cuidar que el decorado no añada falsas colisiones.

**Aceptación:** misma geometría y soluciones verificadas; estados apagado/intermedio/completo claros; materiales distinguibles sin color; objetivo/control legibles con silencio y movimiento reducido. Jose puede revisar la propuesta concreta.

## P07 · MVP de 24 escenas y continuidad

**Depende de:** P06. **Responsable:** implementador y contenido.

- Tres lugares de ocho escenas; una sola regla nueva por vez y variación que cambie decisiones. Al menos ocho escenas deben ofrecer más de una ruta o secuencia significativa, comprobada con el motor y observación.
- `chispa_save_v1`, normalización, mejores marcas por revisión, sesión reanudable y exportación/importación segura. Conservar las claves históricas intactas.
- Selección simple, Continuar, ajustes y texto español/inglés revisado si el reclutamiento será internacional.
- Repetir recorrido 24/24, pruebas, QA móvil y pruebas físicas disponibles. Informar las no realizadas.

**Aceptación:** suficiente contenido y continuidad para estudiar retorno; no hay bloqueo económico ni nuevas características fuera de alcance.

## P08 · Prueba ampliada y decisión de canal

**Depende de:** P07 y plan de medición aprobado para el servicio elegido. **Responsable:** producto; implementador integra lo necesario.

- Definir instrumentación mínima y comunicación de datos antes de emitir eventos remotos. Sin proveedor elegido, exportación voluntaria y observación.
- Obtener una muestra nueva de300–500 participantes de prueba, con origen/dispositivo/cohorte registrados cuando sea posible. No confundir personas reclutadas con plays del portal.
- Esperar maduración de D1/D7, publicar denominadores, pérdidas de seguimiento y diferencias entre fuentes.
- Evaluar tiempo de autoría por escena, errores y carga de soporte junto a retorno e interés por el juego.
- Informar cuántos agotaron las24escenas y cuántos repiten por dominio; conservar los denominadores de retorno. Distinguir falta de interés de falta de contenido disponible antes de decidir formato gratuito continuo o capítulos finitos.
- Elegir si ir a prueba de portal, repetir una variable o detener la producción. Sin compra automática de tráfico.

**Aceptación:** informe con datos y límites, decisión y presupuesto siguiente. Las ventanas de observación no se sustituyen por pruebas automatizadas ni por acelerar el reloj.

## P09 · Candidato comercial, archivo y publicación

**Depende de:** decisión favorable de P08. **Responsable:** implementador; Jose decide compromisos comerciales.

- Contrastar requisitos actuales del canal. Si procede, integrar SDK real y probar éxito, indisponibilidad, error, pausa/audio y concesión única de una recompensa voluntaria.
- Si se eligen compras futuras, implementar sólo productos permitidos, con flujo real comprobado; hasta entonces no ofrecer una tienda ficticia.
- Preparar manifest/worker propios, caché `chispa-*`, offline y actualización desde versión anterior.
- Empaquetar Renacer en `/renacer/` con recursos/rutas/worker auditados y guardado original; no reutilizar el `legacy/` histórico ni enlazar una ruta inexistente.
- Ensayar relevo/rollback en QA. Publicar únicamente la versión validada y verificar destino, READY, alias y contenido servido.
- Documentar soporte, coste de operación, versión y próximos experimentos.

**Aceptación:** raíz CHISPA y archivo Renacer funcionan en línea/offline, datos separados sin borrado, monetización sólo si está disponible y comprobada. Informe técnico y comercial con alcance real; no prometer tráfico, aceptación ni ingresos.

## Registro de ejecución

Al iniciar una tarea, añadir fecha, responsable y commit base. Al cerrarla, enlazar commit, comandos/resultados, capturas pertinentes y limitaciones. Este registro empieza vacío porque todavía no se ha implementado CHISPA.

| Tarea | Estado inicial | Evidencia |
|---|---|---|
| P00 | Documentado | Plan y anexos de esta entrega; sin runtime nuevo. |
| P01–P09 | Pendientes | Ninguna ejecución ni validación afirmada. |
