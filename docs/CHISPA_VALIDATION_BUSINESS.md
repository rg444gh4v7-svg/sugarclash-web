# CHISPA · plan de validación y negocio

**Fecha: 2026-11-03. Nombre provisional. Fuentes consultadas el 2026-11-03.**

Este documento desarrolla la validación y el negocio del [plan maestro](CHISPA_PLAN.md) y su [backlog](CHISPA_BACKLOG.md). No registra un producto validado, resultados de jugadores, aceptación de un portal ni ingresos. La secuencia se rige por esos documentos y el presupuesto reside exclusivamente en el plan maestro. Los objetivos y cortes de validación de este anexo son propuestas; no autorizan compras, contratación, publicidad o incentivos.

Dentro de un hito ya autorizado, las tareas necesarias y reversibles de implementación, revisión y corrección continúan sin pedir permisos rutinarios adicionales. Los gastos, el contacto externo fuera del alcance autorizado y los compromisos de publicación o comercialización sí requieren una decisión concreta de Jose. Este encargo sigue siendo documental.

## 1. La apuesta que se va a probar

**Hipótesis de producto:** apuntar con un dedo y disparar una chispa resulta interesante cuando el impacto enciende un mecanismo que cambia físicamente la geometría del disparo siguiente. Un espejo gira o una compuerta se abre. La geometría permanece fija durante el tiro y el cambio se aplica al resolverlo, conforme al contrato del plan maestro. El jugador debe reconocer qué cambió y usarlo para resolver el siguiente paso. El paso de oscuridad a color expresa esa transformación real.

La propuesta inicial es un puzle de **45–90 segundos por nivel**, como duración deseada y no como cuenta atrás obligatoria. Arrastrar para apuntar, soltar para disparar, posibilidad clara de cancelar y reinicio gratuito. Sin simultaneidad de dos dedos. En escritorio, el mismo gesto con ratón. La respuesta física debe ser reproducible para poder aprender del intento anterior.

**Hipótesis de público:** personas que eligen pequeños problemas de puntería y causa-efecto, y aceptan pensar entre disparos. Es una hipótesis de comportamiento, sin edad, país o tamaño de audiencia demostrados. Se probará tanto con personas que suelen jugar puzles como con otras que juegan ocasionalmente.

**Hipótesis comercial:** una muestra web jugable permite comprobar comprensión, interés y regreso antes de asumir el coste de más contenido o una versión nativa. Web primero no significa tráfico gratuito asegurado ni rentabilidad.

La decisión creativa propuesta no es «otro juego de rebotes con una pintura diferente»: cada mecanismo debe cambiar una posibilidad del siguiente tiro. Esto es una exigencia de diseño propia, **no una afirmación de originalidad frente a todo el mercado**. El nombre CHISPA tampoco tiene aquí una comprobación de disponibilidad de marca.

## 2. Tres comparables útiles y sus límites

La columna de hechos resume las fuentes de sus responsables. La última columna contiene decisiones propuestas para CHISPA; no describe carencias demostradas de esos juegos. No se han evaluado sus ingresos, popularidad o retención.

| Comparable | Hecho comprobado en fuente primaria | Pregunta que ayuda a resolver en CHISPA |
|---|---|---|
| **Peggle 2** | Su manual de EA explica apuntar un cañón, disparar una bola, hacerla rebotar y retirar las clavijas alcanzadas después del tiro. | ¿Se entiende el gesto y puede anticiparse una consecuencia? En CHISPA probaremos, además de acertar, explicar por qué encender un mecanismo cambia el tiro siguiente. [Manual oficial de EA alojado en Xbox](https://dlassets-ssl.xboxlive.com/public/content/efd011ea-47b6-4b61-9e86-08063a3e1cfa/GameManual/2968fc9a-311b-4beb-8ee6-3903d1bc8643/en-GB/index.html). |
| **holedown** | grapefrukt describe disparar bolas para romper bloques, con tiros limitados y algunos bloques fijados a paredes. | ¿Apuntar es una decisión legible o parece dejar el resultado a los rebotes? La propuesta de CHISPA es probar cadenas cortas de mecanismos con cambios espaciales reconocibles, sin copiar su excavación o progresión. [Web del juego](https://holedown.com/), [presskit del desarrollador](https://presskit.grapefrukt.com/holedown/). |
| **Monument Valley** | ustwo presenta caminos ocultos, ilusiones ópticas y geometría imposible en un recorrido arquitectónico. | ¿El cambio del espacio comunica progreso por sí mismo? CHISPA probará esa legibilidad mediante impactos y mecanismos, con su propia geometría, arte y reglas; no mediante reproducir sus monumentos. [Página oficial de ustwo](https://ustwogames.co.uk/our-games/monument-valley/). |

**Diferenciación a comprobar:** que alguien pueda describir CHISPA como «el tiro cambia cómo puedo hacer el siguiente», que perciba agencia y que quiera resolver otro nivel. Si sólo recuerda el color o los efectos, la hipótesis central sigue sin demostrarse. Estos tres comparables no sustituyen una búsqueda exhaustiva de productos ni una revisión de propiedad intelectual antes de comercializar.

## 3. Secuencia única de entregas

Se aplica la secuencia **P01→P02→P03→P04→P05→P06→P07→P08→P09** del [plan maestro, secciones 4 y 7](CHISPA_PLAN.md). Esta tabla relaciona sus hitos con la evidencia de este anexo; no crea fases ni puertas alternativas.

| Hito del master | Entrega concreta | Evidencia necesaria para seguir |
|---|---|---|
| **P01–P02 · Base y motor** | Una escena de prueba, origen aislado, geometría pura, vista previa y transacciones reproducibles. | El mismo tiro reproduce el resultado; el mecanismo cambia las posibilidades del siguiente sin discrepancia entre preview y resolución. |
| **P03–P04 · Prototipo** | Doce niveles provisionales, controles y sesión completa, deshacer/reiniciar, soluciones reproducibles y QA. | Doce escenas resueltas mediante el motor y controles reales, listas para P05. Una observación informal anterior puede detectar problemas, pero no sustituye P05 ni añade otra puerta. |
| **P05 · Prueba cualitativa** | Dos tandas de 6–10 personas nuevas: **12–20 en total**, con corrección acotada entre tandas. | Comprensión, interés y decisión documentados. No mezclar ambas versiones como si fueran una muestra única. |
| **P06 · Muestra de calidad** | Seis de esas escenas con acabado, conservando geometría y soluciones. | Comprobar que el acabado mejora lectura y comodidad sin ocultar reglas débiles. |
| **P07 · MVP** | **24 niveles en tres lugares de ocho**, mismo núcleo, progreso y guardado versionado, ajustes, ayuda y QA. | Continuidad y contenido suficientes para observar regreso. Sin anuncios ni pagos. |
| **P08 · Prueba ampliada** | Primera celda prioritaria con **300–500 reclutas independientes**, instrumento definido y versión estable. | Embudo y D1/D7 maduros con denominadores, pérdidas de seguimiento y límites; decidir si seguir, iterar o parar. |
| **P09 · Candidato comercial** | Canal elegido, SDK y monetización sólo si corresponden, relevo y publicación verificados. | Decisión comercial concreta de Jose y comprobación de requisitos y funcionamiento reales. |

El prototipo tiene sólo dos familias de cambios: **espejo y compuerta**. No añadir una plataforma móvil ni una tercera familia para completar contenido. La secuencia enseña una regla por vez y después combina las existentes. El color no será la única señal: forma, posición y movimiento deben permitir entender el estado.

Quedan fuera del prototipo y del MVP: multijugador, gacha, vidas, monedas, energía, rachas con castigo, tienda, pases, ranking competitivo, eventos continuos, cuentas, chat y decenas de capítulos. Tampoco una aldea o metajuego heredados por inercia. El alcance completo prevalente está en el plan maestro.

## 4. P05 · protocolo cualitativo de 12–20 personas

Jose coordina el reclutamiento o autoriza expresamente un canal y un mensaje concreto. **No se envía ninguna invitación con este documento.** Participar será voluntario; pueden dejar la prueba y no tienen que agradar al creador. Los contactos de reclutamiento quedan fuera de los datos de juego. No pedir nombres, correo, ubicación exacta, grabación de pantalla o voz para analizar el prototipo.

Proponer 15–20 minutos por persona, con predominio de móvil táctil y una parte con ratón; cubrir al menos dos tamaños de pantalla. Variar experiencia de juego, sin presentar esos grupos como público validado. La segunda tanda no repite participantes de la primera.

1. Mostrar el juego sin explicación del mecanismo. Observar si apunta, cancela y dispara; intervenir sólo tras un bloqueo, anotando la ayuda.
2. Tras el primer mecanismo, preguntar **antes del siguiente tiro**: «¿Qué cambió y qué crees que puedes hacer ahora?». Registrar si identifica el cambio espacial y una consecuencia útil.
3. Dejar resolver tres niveles y ofrecer claramente continuar, repetir o salir. La compensación, si Jose aprueba alguna, no dependerá de ganar ni de seguir jugando.
4. Preguntar: «¿Qué parte parecía decisión tuya?», «¿Qué repetirías?» y «¿Qué te hizo parar?». Evitar «¿te gustó?» como único criterio.
5. Anotar cantidades y causas: primeros tiros involuntarios, ayudas, reinicios por puntería frente a reinicios por estrategia, explicación del mecanismo y elección de otro nivel. Notas sin datos identificativos; nada de testimonios públicos sin autorización separada.

**Objetivos internos propuestos para la segunda tanda**, no estándares de la industria: al menos 80% realiza un tiro deliberado en 20 segundos sin ayuda; 75% explica una transformación y su consecuencia; 60% elige otro nivel sin presión del moderador. Mostrar siempre el recuento —por ejemplo `x/n`— y qué versión vio cada persona. Con 6–10 personas por tanda, una proporción cambia mucho por una sola respuesta: las causas observadas pesan más que un aprobado numérico.

Un bloqueo de control o una transformación que varias personas no ven se corrige antes de añadir contenido. Dos revisiones del mismo problema sin mejora clara obligan a detener esa solución y revisar el gesto o el mecanismo.

## 5. P08 · primera cohorte independiente de 300–500

Después de P05, P06 y el MVP de 24 niveles de P07, P08 empieza por **una celda prioritaria de 300–500 reclutas nuevos e independientes**. No cuentan el equipo, Jose, familiares usados en pruebas anteriores, bots o las personas del estudio cualitativo. No reclutar exclusivamente entre seguidores que ya conocen la intención del juego. No ofrecer un premio por volver en D1 o D7 ni enviar recordatorios durante esas ventanas.

Definir esa celda como `versión × periodo de entrada × fuente × clase de dispositivo` y fijarla antes de reclutar; por ejemplo, una fuente concreta en móvil táctil. Otros dispositivos y fuentes son cortes exploratorios hasta tener muestra propia suficiente. No sumar fuentes para ocultar un resultado débil ni dividir 300 entradas en cuatro grupos y presentarlos como cuatro cohortes de 300. Una ampliación posterior a dos fuentes y dos dispositivos con 300–500 por celda requeriría **1.200–2.000 entradas medibles** y su correspondiente alcance; no es un requisito adicional del primer P08.

Anotar invitados, accesos disponibles, cargas válidas y entradas medibles por separado. El objetivo de reclutamiento no garantiza el denominador: fallos de carga, rechazo de medición y duplicados técnicos deben aparecer en el informe. Si no se alcanza la muestra definida, el resultado es incompleto; no es por sí solo una refutación del juego.

Para comparar dos cambios, probar una sola pregunta importante a la vez. Si hay asignación aleatoria, mantenerla dentro de fuente, periodo y dispositivo y utilizar personas nuevas en cada versión. Una comparación entre semanas o comunidades diferentes es descriptiva, no una demostración causal. Doscientas sesiones de una misma persona no son doscientos reclutas.

### Denominadores y ventanas fijados antes de medir

La unidad observable propuesta es **un navegador que entra por primera vez**, no una persona identificada entre dispositivos. `t0` es el primer `ready` medible: el puzle ya está cargado y permite apuntar. Conservar además el embudo de cargas fallidas para que excluirlas de `ready` no las oculte.

Fijar el embudo inicial en los primeros diez minutos de reloj desde `t0`, o hasta abandonar la primera visita si ocurre antes. Resolver días después no convierte retroactivamente esa entrada en una primera sesión completada. La telemetría identifica un disparo por entrada del control; su intencionalidad se observa en el estudio cualitativo y no se deduce de un clic.

| Métrica | Numerador / denominador |
|---|---|
| Activación | Navegadores nuevos que hacen un primer tiro dentro del embudo inicial / navegadores nuevos con `ready`. |
| Primera resolución | Navegadores que resuelven el primer puzle / navegadores nuevos con `ready`. Mostrar también el resultado entre activados. |
| Continuación voluntaria | Quienes eligen el siguiente nivel / quienes resolvieron y vieron esa elección. Mostrar también el porcentaje sobre todos los `ready`. |
| Tres niveles | Navegadores que alcanzan tres resoluciones / navegadores nuevos con `ready`. |
| **D1** | Navegadores de la cohorte que regresan y hacen al menos un tiro en `[24,48)` horas desde `t0` / navegadores nuevos con `ready` cuya ventana completa de 48 horas ya terminó. |
| **D7** | Navegadores de la cohorte que regresan y hacen al menos un tiro en `[168,192)` horas / navegadores nuevos con `ready` cuya ventana completa de 192 horas ya terminó. |

Contar una sola vez cada navegador en cada numerador. D7 no exige haber vuelto en D1 y no es «cualquier regreso dentro de siete días». No dividir por quienes siguen activos, sólo por quienes ganaron o por quienes aceptaron responder después. Una cohorte cerrada necesita ocho días desde su última entrada para tener todas sus ventanas D7 maduras. No publicar ceros prematuros.

Borrar almacenamiento, cambiar de navegador o dispositivo y bloquear medición rompen esta observación. No intentar resolverlo con huellas digitales. Informar cobertura de consentimiento y limitaciones; no llamar a estas cifras «retención exacta de personas» ni compararlas directamente con retención por instalación de una app.

### Objetivos internos y decisiones

Son **hipótesis de decisión propuestas para este proyecto**, no benchmarks de CrazyGames o Adjust y no una previsión de resultados. Acordarlos y congelarlos antes de abrir la cohorte.

| Señal | Objetivo interno inicial | Uso de la evidencia |
|---|---:|---|
| Activación | ≥70% de `ready` | Si falla, revisar entrada y gesto antes de producir más niveles. |
| Primera resolución | ≥60% de `ready` | Si falla con controles claros, revisar lectura del mecanismo y dificultad inicial. |
| Continuación voluntaria | ≥50% de quienes vieron la elección y ≥30% de `ready` | Si se entiende pero no se elige seguir, revisar el interés del problema y el valor de la transformación. |
| Tres resoluciones | ≥35% de `ready` | Comprobar que los siguientes niveles no sean repetición sin decisiones nuevas. |
| D1 / D7 maduros | ≥15% / ≥5% | Señales internas mínimas para explorar regreso; no prueban sostenibilidad económica. |
| Tiempo de puzle | Mediana de 45–90 s entre resoluciones | Objetivo de ritmo. Mostrar abandonos y ayudas aparte: una mediana sólo de ganadores puede esconder frustración. |

Presentar recuentos, porcentajes e incertidumbre por celda; no declarar certeza por haber llegado a 300 o 500. No decidir por una diferencia pequeña ni por un único porcentaje que pase una línea. Un resultado de una fuente o dispositivo sólo informa esa población observada.

**Agotamiento de contenido:** informar cuántos completan las24escenas, en qué visita y si eligen repetir. No excluir a esos navegadores del denominador D1/D7 para mejorar el resultado; describir aparte la disponibilidad de contenido al volver. Un regreso bajo cuando muchos ya terminaron no identifica por sí solo un problema de diversión: puede invalidar la cadencia o el modelo de negocio. Antes de invertir en un gratuito continuo, comprobar repetición por dominio o coste viable de contenido nuevo. Si el valor está en una experiencia finita, evaluar demanda de capítulos de precio fijo con una prueba explícita de ese formato, sin simular cobros ni presentar intención declarada como compras reales.

**Regla de iteración propuesta:** una revisión centrada en comprensión y una segunda centrada en interés/regreso, cada una con presupuesto de horas y personas nuevas. Si, con medición fiable y controles comprensibles, dos versiones siguen sin elección de continuar o por debajo de los objetivos de regreso, parar producción de contenido y decidir entre reformular el núcleo o archivar. Si falta muestra o hay errores de instrumentación, corregir la observación; no reinterpretarla como éxito. Superar objetivos permite otra prueba acotada, no escalar gasto automáticamente.

## 6. Medición mínima y privacidad

La fase cualitativa puede operar con anotaciones agregadas y estado local, sin servicio analítico remoto. La fase cuantitativa requiere revisar e implementar un esquema específico antes de recoger datos; este documento no afirma que exista ya.

Propuesta de payload: versión, cohorte, fuente **de una lista controlada**, clase táctil/ratón, nivel, resultado, contador de tiros/transformaciones y tiempo activo agrupado en intervalos. No enviar URL o referer completos, coordenadas del gesto, texto libre, IP almacenada por la aplicación, identificadores publicitarios, nombres, correos o un identificador común de visitante.

Eventos limitados:

- `ready`: primera carga utilizable medible de esa entrada/cohorte.
- `first_shot`: primer disparo emitido mediante el control, para medir activación; no demuestra que fuera deliberado.
- `milestone`: contadores una sola vez para primera resolución, tres resoluciones, continuación voluntaria, contenido completo, primera repetición voluntaria, regreso D1 o regreso D7.
- `puzzle_summary`: resultado, conteos y duración agrupada, sin trayectoria de cada tiro.
- `error`: categoría técnica de una lista cerrada; sin mensajes libres que puedan contener información del dispositivo o usuario.

Mantener `t0`, cohorte y flags de envío/deduplicación **en el navegador**; agregar contadores al recibirlos, sin enlazar sesiones mediante un ID transmitido. Diseñar y probar pérdidas/reintentos para no duplicar numeradores. Si el sistema no consigue contar con fiabilidad bajo esa restricción, marcar la medición como incompleta y corregir la instrumentación dentro del hito autorizado. Ampliar datos recogidos, introducir seguimiento persistente o contratar un servicio no previsto requiere una decisión explícita; no hacerlo de forma silenciosa.

La participación en medición será informada y opcional; negarse no impide jugar. Proponer eliminación de eventos técnicos de recepción en 30 días y conservar sólo tablas agregadas necesarias para decidir; no publicar celdas pequeñas con menos de 20 entradas. El proveedor de alojamiento puede recibir datos técnicos como IP para servir la página: revisar su configuración y registros antes del piloto. No prometer «cero datos personales en toda la infraestructura» ni anonimato legal sólo por no pedir un nombre. Ningún SDK publicitario entra en esta etapa.

## 7. Distribución web y CrazyGames

**Hechos verificados:** CrazyGames distingue Basic y Full Launch. Basic prueba con audiencia limitada, sin monetización. Su periodo requiere al menos siete días y 500 partidas; si no alcanza 500, termina a los 21 días. Full requiere selección e implementación/revisión completa y habilita reparto de ingresos. La progresión considera tiempo de juego, conversión a jugar y retención. **500 partidas no equivalen a 500 personas independientes.** [Proceso oficial de lanzamiento](https://docs.crazygames.com/).

La FAQ confirma SDK opcional en Basic y obligatorio en Full. Que el SDK permita una función no obliga a incorporarla al diseño. El portal no garantiza aquí aceptación, exposición continua ni paso a Full. [FAQ oficial](https://docs.crazygames.com/faq/).

**Plan propuesto:** primero enlace web propio para comprobar control y comprensión; después valorar una solicitud a Basic con la versión estable. Tratar los resultados del portal como otra fuente/cohorte, con sus definiciones, además del estudio propio. La decisión de solicitar publicación corresponde a Jose; este documento no envía ni publica el juego. Antes de presentar un build, volver a verificar requisitos, condiciones y metadatos, que pueden cambiar.

## 8. Qué aporta Adjust 2026 y qué no permite concluir

El informe **Gaming app insights 2026** analiza adquisición y retención de apps medidas por Adjust. Su metodología combina datos de sus principales 5.000 apps con su conjunto de apps medidas, agregados y anonimizados, para enero de 2024–enero de 2026; advierte que no representa necesariamente todo el mercado. Incluye diferencias por género y región, una mayor relación de instalaciones pagadas frente a orgánicas en 2025 y datos de retención D1. [Informe primario de Adjust, metodología p.8, adquisición p.16 y retención p.22](https://a.storyblok.com/f/47007/x/20551740ee/gaming-app-insights-report-2026.pdf), [página oficial de la edición 2026](https://www.adjust.com/resources/ebooks/gaming-app-insights/).

**Inferencia para CHISPA:** no presupuestar una app nativa sobre la esperanza de instalaciones orgánicas ni confundir adquirir con conservar jugadores. Medir ambas cosas por canal. No trasladar medias de apps al puzle web ni adoptar su D1 como requisito interno; las unidades, audiencia y canal son diferentes. El informe tampoco demuestra que CHISPA tenga demanda o que pagar adquisición resulte rentable.

## 9. Negocio por fases y fórmulas

**P01–P08:** prototipo de doce niveles, muestra de seis escenas acabadas y después MVP de 24 niveles, siempre sin anuncios ni pagos y siguiendo las puertas del plan maestro. Su resultado económico esperado no se calcula en este documento. Se decide si invertir el siguiente hito, no si ya existe un negocio.

**P09, sólo con decisión económica concreta de Jose:** valorar un piloto de anuncios voluntarios si existe aceptación Full, SDK real verificado y evidencia suficiente del núcleo. La documentación del SDK diferencia anuncios solicitados por el usuario, callbacks de final/error y exige tratar correctamente pausa y sonido; el juego debe funcionar con bloqueo publicitario. Dar una recompensa sólo después de la finalización confirmada, una sola vez, y probar cancelación, falta de anuncio, error, regreso y callback antiguo. [Documentación oficial de vídeo y callbacks](https://docs.crazygames.com/sdk/video-ads/).

Propuesta de diseño propia: nunca un corte forzado al disparar o al resolver. Ningún anuncio necesario para reiniciar o aprender el mecanismo. Un posible incentivo cosmético o contenido adicional se especificaría y probaría aparte. No convertir la dificultad en un obstáculo fabricado para vender ayudas.

Una etapa posterior podría explorar **paquetes cosméticos o capítulos de precio fijo**, con contenido y precio claros. No se promete soporte de pagos: CrazyGames indica compras dentro del juego para juegos seleccionados, no para cualquier envío. Confirmar elegibilidad, integración, comisiones y política vigente antes de diseñar esa oferta. [Alcance comercial indicado por CrazyGames](https://docs.crazygames.com/). Nada de gacha o compras que oculten el precio real.

Modelo a completar exclusivamente con datos propios y condiciones confirmadas:

```text
Ingreso neto = cobros efectivamente atribuibles al juego
               − comisiones/repartos aún no descontados
               − devoluciones y ajustes aplicables

Contribución de una cohorte = ingreso neto de esa cohorte
                             − costes variables de servirla y atenderla

Margen de contribución = contribución / ingreso neto   [si ingreso neto > 0]

LTV neto observado a H días = contribución acumulada a H días
                             / nuevos usuarios medibles de esa cohorte

CAC neto observado = coste incremental de adquisición y creatividades
                    − reintegros/subvenciones confirmados de adquisición
                    ---------------------------------------------------
                    nuevos usuarios incrementales atribuibles al canal

Resultado de captación por usuario = LTV neto − CAC neto

Resultado de proyecto = contribución total − adquisición
                       − costes fijos de desarrollo y operación
```

Si el portal informa directamente el ingreso del desarrollador después de su reparto, **no descontar ese reparto dos veces**. No usar facturación bruta de la plataforma como ingreso propio. Un coste por instalación no es automáticamente CAC incremental. Cuando no exista un diseño de incrementalidad, etiquetar el cálculo como coste por entrada atribuida y no como CAC demostrado.

`H` debe estar observado: D1/D7 no permiten calcular por sí solos un LTV de por vida. Un modelo futuro necesitaría supervivencia, sesiones, ingreso neto por sesión y costes, con escenarios separados y error visible. Sin cobros o datos reales, LTV y margen comercial son desconocidos; no rellenarlos con tarifas publicitarias de otro juego. Un canal orgánico o un portal también consume trabajo de contenido, integración y soporte.

No fijar aquí una proporción universal LTV/CAC ni un gasto máximo en dinero. Cualquier ensayo de captación debe tener antes una aprobación de Jose con **importe y moneda, proveedor/canal, duración, finalidad, criterio de corte y coste máximo total**. El presupuesto no se amplía automáticamente por clics baratos o por un objetivo de retención superado.

## 10. Presupuesto único y reglas de corte propuestas

Las estimaciones de horas y exclusiones presupuestarias son exclusivamente las de [CHISPA_PLAN.md, sección 7](CHISPA_PLAN.md). Este anexo no añade una segunda estimación ni un total alternativo. Reclutamiento, espera de retorno y revisión del portal no se confunden con horas de implementación. No suponer que contratar reclutas, comprar anuncios o utilizar un servicio nuevo esté autorizado.

**Cortes propuestos:**

- Al cerrar P02 sin un núcleo reproducible y un mecanismo explicable, corregir motor y lectura antes de avanzar a P03–P04; no encubrirlo produciendo arte.
- Al terminar P05, no avanzar al acabado de P06 ni al MVP de P07 si aún se necesita explicación verbal para entender el cambio de geometría. Las doce escenas provisionales ya pertenecen a P04.
- Congelar contenido y versión durante cada cohorte. Una corrección urgente invalida la comparación del tramo afectado y se documenta.
- Tras dos iteraciones cuantitativas sin la señal buscada, parar nueva producción y revisar el concepto con Jose. No consumir más horas sólo para completar un número de niveles.
- SDK, anuncios, compras y publicación comercial corresponden al alcance concreto que se elija para P09. Port móvil y marketing de pago son decisiones posteriores, con costes propios. Las tareas reversibles necesarias dentro del hito autorizado no requieren una nueva aprobación rutinaria.

## 11. Hoja de decisión que debe quedar al final de cada etapa

Guardar versión probada, pregunta, fuente/dispositivo, fechas, reclutas y denominadores maduros, recuentos de métricas, problemas observados, cobertura de medición, horas consumidas y una decisión: **continuar una etapa, iterar una hipótesis concreta, observación insuficiente o parar**. Añadir quién toma la decisión y el siguiente límite de trabajo.

Actualmente no hay participantes ni resultados de CHISPA registrados aquí. La siguiente evidencia necesaria es una muestra del gesto y del cambio de geometría que otras personas puedan jugar y explicar. La investigación de mercado orienta esa prueba; no la sustituye.

## Fuentes primarias consultadas

Todas consultadas el **2026-11-03**. Sólo se atribuyen los hechos descritos arriba; las metas, etapas y presupuesto son propuestas del proyecto.

1. [EA · manual oficial de Peggle 2](https://dlassets-ssl.xboxlive.com/public/content/efd011ea-47b6-4b61-9e86-08063a3e1cfa/GameManual/2968fc9a-311b-4beb-8ee6-3903d1bc8643/en-GB/index.html).
2. [grapefrukt · holedown](https://holedown.com/) y [presskit](https://presskit.grapefrukt.com/holedown/).
3. [ustwo games · Monument Valley](https://ustwogames.co.uk/our-games/monument-valley/).
4. [CrazyGames · proceso Basic/Full](https://docs.crazygames.com/), [FAQ](https://docs.crazygames.com/faq/) y [anuncios de vídeo](https://docs.crazygames.com/sdk/video-ads/).
5. [Adjust · Gaming app insights 2026](https://www.adjust.com/resources/ebooks/gaming-app-insights/), [PDF del informe](https://a.storyblok.com/f/47007/x/20551740ee/gaming-app-insights-report-2026.pdf).
