# CHISPA · Dirección visual del nuevo juego

**Fecha: 2026-11-03. Estado: planificación; sin prototipo implementado.**

Base de continuidad: [CONCEPT.md](../CONCEPT.md) y [VISUAL_STYLE.md](../VISUAL_STYLE.md). La decisión nueva de Jose prevalece sobre sus composiciones históricas.

Jose aceptó cambiar el juego. CHISPA es un **nombre provisional**, no una marca ni un logo aprobados. Este documento desarrolla la presentación de la nueva mecánica; no describe funciones ya disponibles en Renacer. El runtime publicado, sus recursos y los guardados permanecen intactos durante esta fase. Las guías raíz distinguen la propuesta CHISPA del juego Renacer publicado. El contrato maestro está en [CHISPA_PLAN.md](CHISPA_PLAN.md) y la física/datos de escena, en [CHISPA_LEVELS.md](CHISPA_LEVELS.md).

## La imagen que debe explicar el juego

Una chispa atraviesa un lugar descolorido. El jugador apunta, observa sus rebotes y enciende las lámparas que devuelven color a ese lugar. Algunas rutas requieren activar antes un mecanismo: al terminar el tiro, gira un espejo o se abre una compuerta. El siguiente disparo se prepara sobre una geometría distinta y claramente visible.

La escena debe enseñar esa relación sin depender de un texto de lore: **apuntar → contacto real → cambio concreto → nueva ruta**. Las lámparas son la meta. Los mecanismos habilitan caminos; activarlos todos no es una segunda condición de victoria. No pintar de color un sector por esperar, disparar o agotar intentos.

Se conserva la dulzura material y el fondo melancólico de Dulcelandia: piedra de azúcar, metal envejecido, caramelo mate y vidrio gastado. El acabado es sobrio y cuidado, sin apariencia general de juguete. La confitería puede aparecer en cortes, ensamblajes y transparencias; no necesita decorar cada superficie con caramelos o cristales.

## Lo que permanece y lo que cambia

| Categoría | Decisión para CHISPA |
|---|---|
| Conservado | Dulcelandia descolorida, restauración como acción principal, consecuencias visibles, misterio y memoria, vínculo con Confite, tono adulto accesible, silencio entre intervenciones. |
| Conservado como base visual | Carbón/petróleo, texto hueso, acentos coral/oro/teal localizados, superficies mates, Karla para controles y Fraunces contenida para lugares. Lectura y acciones claras desde el estado gris. |
| Retirado de la nueva composición | Tablero match-3, atlas de caramelos como piezas, rayos/bombas/Pulso como barra de herramientas, doble meta de luz/suelo, cabecera de guardián y navegación Inicio/Campaña/Modos/Aldea. No trasladar estos elementos por inercia. |
| Histórico, no borrado | Renacer, sus 80 encuentros, aldea, modos, economía, activos, guardados, pruebas y publicaciones. Son evidencia del juego anterior, no de CHISPA. No prometer que esos sistemas o cantidades se heredan. |
| Marca pendiente | El logo aprobado de Sugar Clash pertenece a la identidad histórica. No sustituir sus letras ni fabricar ahora un emblema nuevo. Durante el prototipo basta «CHISPA · Prototipo» como texto normal. Nombre y marca se revisan después de validar la mecánica. |
| Decisiones ajenas a esta guía | Alcance posterior del contenido, progresión definitiva y extensión de historia se coordinan en el plan maestro. El prototipo sí tiene cerrado su contrato: tiros ilimitados, sin vidas, reloj ni azar. La presentación no añade economía ni simula premios. |

La revelación final de Confite conserva su lugar narrativo. No aparece en textos de bienvenida, iconos, mecanismos ni material promocional de este prototipo.

## Una escena, una siguiente acción

La entrada muestra una sola escena central y **Jugar**, o **Continuar** cuando exista un estado compatible que continuar. Un selector discreto llamado **Escenas** permite elegir los encuentros disponibles; Ajustes es un engranaje con nombre accesible. No hay barra inferior de cuatro destinos, hub de modos ni mosaico de tarjetas.

Durante la partida, la misma escena ocupa el centro. Encima: nombre breve, meta literal —por ejemplo «Lámparas 1 de 3»— y pausa. Mostrar siempre **Tiros: N**, la cantidad realmente realizada; nunca tiros restantes. La referencia opcional no es una meta ni un límite: «Referencia de diseño: N tiros» hasta validarla, después «Referencia: N». Debajo quedan los controles de puntería/sesión y una línea de resultado. Ninguna moneda o contador histórico ocupa espacio sin una función actual.

El detalle de ayuda se abre bajo demanda y se cierra volviendo al punto de interacción. La escena no desaparece para presentar una landing o una celebración de pantalla completa. Al completar una escena, «Continuar» aparece después de comprobar la meta real.

## Lectura móvil y escritorio

El primer prototipo debe resolver **320×640 y 390×844** antes de añadir ilustración de producción. El marco lógico de presentación es **360×480**, con campo físico cuadrado **100×100** inscrito sin deformar. Ambos conservan su proporción al adaptarse; no se estiran para llenar la pantalla. El aire exterior puede contener paisaje quieto, pero no paredes implícitas ni objetivos. El borde del campo es una salida: el disco que lo alcanza termina su recorrido, sin rebotar.

Presupuesto orientativo de composición, en píxeles CSS; son límites de diseño a comprobar, no CSS ya implementado:

| Región | 320×640 | 390×844 |
|---|---:|---:|
| Cabecera con nombre provisional, selector y Ajustes | 48 | 48 |
| Nombre de escena y objetivo | 48 | 48 |
| Marco central máximo, centrado | 271,5×362 | 366×488 |
| Puntería y acciones de sesión | 88 | 88 |
| Resultado breve / presencia de Confite | 40 | 40 |
| Separaciones verticales de referencia | 18 | 18 |
| Reserva inicial para áreas seguras | 36 | 36 |

En 320 la suma vertical llega a 640 px. Si las áreas seguras necesitan más, se reduce uniformemente el marco central; no se cortan controles ni se reduce su tipografía. En 390 queda margen para aire, no para agregar otro menú. En escritorio, limitar el tamaño del campo para que puntería y resultado se lean juntos; no ampliar la escena hasta perder de vista sus bordes.

Texto de instrucción:14–16 px; estado secundario:12–13 px; título:24–28 px. Botones y controles con una zona de acción mínima de 44 × 44 px. **Arrastrar apunta y soltar un arrastre válido dispara. Cancelar nunca dispara.** La preview y una instrucción breve comunican el gesto; ajustar la dirección todavía no consume un tiro. La longitud del arrastre no cambia fuerza ni velocidad. Fuente y objetivo no quedan bajo el dedo: ofrecer apuntado desde una zona inferior vinculada a la fuente y alternativa de teclado. En teclado, flechas y ajuste fino cambian la dirección; **Enter dispara** y la cancelación abandona la preparación sin lanzar.

## Tres estados visibles del lugar

| Estado | Lugar | Mecanismos y lectura |
|---|---|---|
| 1. Dormido | Tierra y arquitectura casi monocromas; volúmenes distinguibles, sin niebla sobre superficies de choque. | Lámparas apagadas con marca central abierta. Actuadores inactivos cerrados. Espejos y compuertas muestran ya sus posiciones físicas. |
| 2. En transformación | Vuelve color sólo al circuito y a la porción de lugar asociados a lámparas realmente encendidas. La parte pendiente conserva el gris. | Las lámparas encendidas mantienen una marca rellena. El actuador usado queda hueco y pasante; se ve el espejo girado o la compuerta abierta. La siguiente trayectoria se calcula sobre este estado. |
| 3. Recuperado | Todas las lámparas requeridas encendidas; el lugar correspondiente tiene su color y conserva la geometría que produjo esa solución. La interfaz permanece oscura. | Meta marcada como completa y continuación disponible. Puede haber actuadores opcionales inactivos: no se exige llevar todos los mecanismos a una posición final ni producir un efecto decorativo para terminar. |

El color no es un filtro global de progreso. Un actuador puede recuperar un pequeño detalle propio al usarse, pero no cuenta como lámpara ni concede por sí solo color de victoria. El color parcial refleja el estado actual y retrocede al deshacer; sólo completar concede restauración permanente. No usar una restauración de terreno que parezca abrir un paso si su colisión no cambia.

## Vocabulario de mecanismos

Cada elemento se reconoce por **silueta, marca y estado**, además del color. El primer prototipo utiliza pocos materiales y una leyenda breve, consistente entre escenas.

| Elemento | Forma y señal | Contacto y cambio que comunica |
|---|---|---|
| Fuente | Cazoleta semicircular con boquilla y un punto de salida fijo. | La chispa nace en el centro físico visible. La dirección elegida sale de esa boquilla; el cuerpo decorativo no añade colisiones ocultas. |
| Chispa | Disco pequeño de núcleo hueso y borde coral, sin estela gruesa. | Radio físico de 0,75 unidades del campo 100×100: dibujo, colisión y preview usan ese mismo radio positivo. Puede llevar una cola muy corta para indicar sentido, sin agrandar el cuerpo aparente. |
| Espejo | Lámina recta clara con ambas caras continuas y extremos redondeados. Pivote circular si puede girar; una marca de orientación puede distinguir sus posiciones. | Los dos lados reflejan. Ningún dorso oscuro sugiere absorción. Se dibujan longitud, grosor, extremos y orientación físicos actuales. |
| Pared rebotable | Borde continuo claro con material propio; interior quieto. | Rebota siempre bajo la regla establecida. No confundirla con un marco ornamental. |
| Superficie absorbente | Remate oscuro dentado o tramado corto, distinto del borde reflectante. | Termina el tiro. La señal se conserva también en escala de grises. |
| Lámpara / meta | Cuenco o farol redondo con tres pequeñas muescas y centro visible. | Se enciende al contacto y deja pasar la chispa. Encendida conserva su silueta y una marca central rellena; no parece un muro ni un actuador. |
| Actuador inactivo | Cuerpo hexagonal cerrado, marca de palanca y núcleo sólido. Línea de conexión al mecanismo asociado. | El primer contacto absorbe la chispa y termina el tiro. Al resolver, aplica exactamente un cambio de espejo o compuerta. |
| Actuador activado | Mismo contorno hexagonal con centro inequívocamente hueco y conexión marcada. | Ya no absorbe ni cambia nada: deja pasar. El hueco visual no puede parecer un objetivo pendiente. |
| Compuerta | Panel compacto oscuro con la trama de los absorbentes, carril visible y alojamiento al que puede retirarse. | Cerrada absorbe y termina el tiro; abierta queda fuera del paso y no colisiona dentro de él. El panel nunca se vuelve simplemente transparente sobre una colisión cerrada. |

El modelo geométrico inicial es único: radio de chispa 0,75; sensor de lámpara 3,5; actuador 4; espejo de longitud 14 y grosor 1; paredes de grosor 2, todo en unidades del campo 100×100. Las lámparas son sensores pasantes y espejos/paredes usan segmentos de extremos redondeados. Estas cifras se mantienen en dibujo, solver y preview; cualquier revisión se hace conjuntamente con [CHISPA_LEVELS.md](CHISPA_LEVELS.md). No interpretar cálculo determinista sin fotogramas como un láser de radio cero.

Las conexiones del actuador son líneas de enlace delgadas, sin flechas de vuelo. La trayectoria es discontinua y lleva sentido. Así una unión mecánica no se interpreta como un rebote.

Paleta de partida: fondo `#141820`, soporte `#20262e`, texto `#eee7db`, secundario `#adb5b5`. Oro `#c8ab7d` identifica superficies y ruta; coral `#cf9279`, la chispa/acción; teal `#7ba9a6`, mecanismos ya resueltos. Son bases del prototipo, no ocho colores obligatorios ni una nueva marca. Los estados nunca dependen sólo de esos tonos. Los controles y el foco conservan contraste aunque todo el lugar siga gris.

## Trayectoria y física sin engaños visuales

La geometría permanece **congelada durante cada tiro**. Las lámparas pueden encenderse cuando son alcanzadas y la chispa sigue. El primer actuador inactivo termina el recorrido; el cambio de geometría se aplica al resolver ese tiro. Una animación finita puede mostrar el movimiento entre posiciones, pero el siguiente disparo sólo se prepara sobre la posición final estable. El jugador debe distinguir apuntando, tiro en curso y listo para el siguiente.

La preview utiliza el mismo solucionador, radio y reglas de choque que el tiro. Muestra rebotes de la geometría actual hasta el primer actuador inactivo, absorbente o límite establecido. **Se detiene ahí:** no continúa como si un espejo ya hubiera girado o una compuerta estuviera abierta. Un actuador ya activo sí permite continuar la línea.

La línea prevista tiene núcleo claro y un apoyo oscuro fino para mantenerse visible sobre piedra y color. Separa segmentos con puntos o guiones; incluye pequeñas flechas de sentido y un remate distinto en el contacto que termina el tiro. No ilumina todos los caminos posibles ni revela automáticamente una solución. Los encuentros rasantes, esquinas y límites de rebote deben verse igual que los resuelve el motor; no dibujar un rayo de radio cero si la chispa real tiene volumen.

Al terminar en un actuador, destacar brevemente **ese actuador, su conexión y el mecanismo que cambió**. Mensaje concreto: «El espejo ha girado. Vuelve a apuntar». No mover varios decorados parecidos a la vez ni usar una explosión que oculte el resultado. Sin azar, ciclos de activación ni cambios físicos causados por animaciones de ambiente. Los límites de rebotes/recorrido que eviten bucles se documentan en el diseño mecánico y reciben una señal de fin comprensible.

## Confite, audio y accesibilidad

Confite mantiene su SVG y sus emociones. Se sitúa pequeño en un borde exterior al campo físico; nunca tapa fuente, lámpara, trayectoria o botón. Una frase breve tras el primer mecanismo o al completar puede dar presencia al mundo. Sin bocadillo permanente, voz obligatoria, nuevo personaje ni revelación anticipada de su historia. El error se acompaña con una invitación concreta a volver a apuntar.

Audio sintetizado para el prototipo: contacto reflectante seco, absorción corta, lámpara con nota cálida y cambio mecánico con motivo distinto. Son señales de acontecimientos reales, con volumen limitado y voces acotadas. No tocar un premio sonoro por apuntar, visitar una escena o completar una animación. Silencio accesible desde Ajustes; iniciar audio sólo tras una interacción válida. Toda información sonora tiene equivalente visual.

Movimiento reducido: posiciones finales inmediatas o fundido breve, sin sacudidas, estelas largas ni destellos. La resolución lógica no espera un efecto ornamental. Contraste objetivo del proyecto: al menos 4,5:1 en texto normal y 3:1 en señales esenciales contra su entorno; revisar sobre las tres fases reales, no sólo sobre una muestra de paleta. Teclado para apuntar, ajuste fino y disparo; foco visible; descripción textual del objetivo y del último cambio. Los controles y estados importantes viven en HTML accesible aunque la escena use canvas. No afirmar accesibilidad completa de un puzle espacial sólo por añadir un `aria-label` al lienzo.

## De prototipo a ilustración

**Primer prototipo:** SVG o canvas nativo, formas geométricas con las señales de esta guía, texto HTML, fuente fija por escena, lámparas, espejos y un cambio de compuerta. Sin comprar ni generar imágenes y sin diseñar logo. La colisión y el dibujo comparten la misma geometría; las conexiones y el fondo son presentación sin física. Usar las fuentes ya disponibles y el Confite original como recursos locales, conservando arquitectura sin framework. No portar la complejidad de pantallas de Renacer a este ensayo.

El prototipo debe permitir evaluar si apuntar es cómodo, si el rebote se entiende, si el cambio invita a preparar otro tiro y si los estados se distinguen. Las trazas o capturas del prototipo prueban su funcionamiento; no prueban diversión por sí solas. La validación necesita personas y observación de errores de comprensión.

**Arte de una primera porción completa del juego, después de validar:** ilustrar un único lugar con estados dormido, parcial y recuperado, más mecanismos completos y sus estados. Mantener las siluetas y contactos aprobados por la prueba. Introducir textura, profundidad y una consecuencia ambiental propia de ese lugar sin convertir bordes decorativos en colisiones. Conservar por separado las formas de física y la pintura, con encaje verificado. Revisar nombre/lettering entonces, antes de extender la marca a iconos o material de publicación. No producir ocho territorios o un catálogo de piezas antes de superar este paso.

## Criterios de revisión y QA

- En 320×640 y 390×844 caben objetivo, campo completo, origen, puntería y disparo sin scroll durante un tiro; no hay recorte por barra del navegador, notch o áreas seguras. Repetir en escritorio y con texto ampliado.
- Antes del primer disparo, una persona puede señalar qué enciende, qué rebota y qué detiene. Tras activar un mecanismo, puede identificar qué cambió y por dónde puede pasar ahora. Registrar dudas; no presentar todavía resultados de prueba.
- Verificar las tres fases, un actuador sin usar, el mismo ya usado y una lámpara alcanzada antes del actuador en un mismo tiro. La lámpara continúa y el actuador inactivo termina. No se exige usar un mecanismo opcional para completar las lámparas.
- Comparar preview y tiro en impactos frontales, oblicuos, rasantes, esquinas, espejo girado, compuerta abierta y límite de rebotes. Cambiar tamaño/DPR no cambia trayectorias ni resultado. Cualquier discrepancia bloquea el acabado artístico.
- Comprobar que se ve la diferencia entre absorbente y reflectante, lámpara y actuador, antes y después, en color, escala de grises y simulaciones de deficiencia cromática. No usar sólo un halo para comunicar estado.
- Revisar pausa, salida, reinicio, nueva escena y pestaña oculta: ningún tiro anterior mueve la geometría nueva, reproduce audio tardío ni deja preview desfasada. No aceptar otro disparo durante la resolución.
- Movimiento y audio ligados a una interacción finita; sin RAF ambiental perpetuo. Canvas con DPR acotado y geometría en coordenadas lógicas, sin consumir aleatoriedad para decorar. Probar silencio y movimiento reducido.
- Guardar evidencia diferenciando dibujo propuesto, estado obtenido por juego, prueba automatizada y prueba con personas. Ningún render, selector o recarga concede lámparas encendidas o finalización.

Este plan no implementa CHISPA, no publica una versión nueva y no altera la partida o el guardado de Renacer. Su siguiente entrega es un prototipo legible de puntería y mecanismos; la producción de arte viene después de esa validación.
