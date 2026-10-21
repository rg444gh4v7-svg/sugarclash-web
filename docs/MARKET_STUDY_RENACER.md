# Sugar Clash · Renacer: estudio de competencia y decisiones de producto

Consulta: **20 de octubre de 2026, America/Chicago** (21 de octubre UTC).

## Decisión principal

Sugar Clash puede buscar su lugar como **una aventura de restauración que se juega de inmediato en navegador**: resolver un tablero devuelve color a Dulcelandia y acerca una mejora concreta de la aldea. Confite y la memoria del mundo son su identidad. La campaña es el producto principal; Guerra 5v5 y Royale son alternativas locales contra IA.

Esta es una **hipótesis de posicionamiento**, no una ventaja comercial demostrada. Añadir modalidades o una portada bonita no demuestra que la gente prefiera el juego. La comparación sugiere priorizar claridad del tablero, satisfacción de los poderes y consecuencias visibles antes de ampliar contenido.

## Alcance y límites

Estudio documental de páginas oficiales de desarrolladores, soporte y portales; revisión de la implementación local de Renacer. No se realizó una prueba controlada jugando a los competidores, una encuesta representativa ni una auditoría de ingresos. Las descripciones oficiales prueban funciones y requisitos declarados, no que una función cause retención.

No se presentan tamaño de mercado, cuotas, CPI, ARPDAU, ingresos ni tasas de retención: no hay datos comparables verificados en esta investigación. Los objetivos de validación de abajo son decisiones internas propuestas, no promedios de la industria.

## Comparación útil para construir

| Referencia | Hecho público comprobado | Qué aprender | Aplicación en Sugar Clash |
|---|---|---|---|
| **Candy Crush Saga** | El soporte enseña deslizar dos caramelos contiguos, combinar tres o más y cumplir el objetivo antes de agotar movimientos. Distingue ayudas antes, durante y al terminar una partida. [Controles](https://candycrush.zendesk.com/hc/en-us/articles/360000750278-Controls-how-to-switch-and-match-candies), [boosters](https://candycrush.zendesk.com/hc/en-us/articles/360000750998-What-are-Boosters). | Inferencia: un núcleo fácil de entender admite decisiones de mayor profundidad. | Deslizamiento y dos toques, objetivo restante legible, poderes reconocibles y reglas consistentes. Enseñar cada poder al aparecer. |
| **Royal Match** | Dream Games relaciona puzzles con la renovación del castillo; describe combinaciones de poderes, obstáculos y eventos. Las piezas pertenecen al mundo de sus personajes. [Producto oficial](https://www.dreamgames.com/games/royal-match). | Inferencia: el tablero y la construcción deben sentirse como partes del mismo viaje. | Cada victoria explica qué se restauró y cuánto falta para la próxima construcción. Mantener una misma materialidad en fichas, guardianes, paisaje y aldea. |
| **Royal Kingdom** | La ficha oficial vincula superar niveles con reunir pociones y abrir distritos; incluye desafíos de reino y encuentros donde los matches golpean enemigos. [Producto oficial](https://www.dreamgames.com/games/royal-kingdom). | Inferencia: la fantasía de combatir necesita una consecuencia mecánica comprensible. | En campaña, el indicador del guardián debe corresponder al objetivo real. En Guerra/Royale, explicar ganar, esquivar y usar habilidades sin exigir conocer el lore. |
| **Sweet World, en Poki** | La ficha del portal ofrece un match-3 de caramelos, caída de piezas y controles de arrastrar con ratón o dedo; declara compatibilidad con ordenador, teléfono y tableta. [Ficha oficial del portal](https://poki.com/en/g/sweet-world). | Inferencia: caramelos y controles sencillos ya son oferta disponible en el mismo canal. | La temática dulce sola no diferencia. Mostrar restauración, compañero y una decisión táctica propia durante la primera sesión. |
| **Vidas: Candy Crush y Royal Match** | Ambos soportes indican perder una vida al fallar y recuperar una cada 30 minutos. [King](https://candycrush.zendesk.com/hc/en-us/articles/360000750878-How-do-lives-work), [Dream Games](https://dreamgames.helpshift.com/hc/en/3-royal-match/faq/5-lives/?p=android). | Inferencia: una victoria no debería cortar la continuidad del viaje por agotar intentos. | Renacer reserva una vida al entrar y la devuelve una sola vez al ganar; perder o abandonar la consume. Su regeneración es de **25 minutos**, no 30. |

La existencia de una categoría match-3 en Poki confirma oferta en ese canal; no prueba demanda para Renacer ni un hueco sin competencia. El catálogo incluye juegos dulces y de fantasía. [Categoría oficial](https://poki.com/en/match-3).

## Público al que probar primero

**Hipótesis principal:** personas que ya reconocen un match-3 y quieren una sesión breve en móvil o escritorio, sin instalación, con un lugar que cambie gracias a sus jugadas. Motivaciones a comprobar: resolver, ver progreso y acompañar a Confite. No se atribuye una edad o género predominante sin datos.

**Hipótesis secundaria:** quien disfruta una partida de acción breve puede entrar directamente a Guerra o Royale. La prueba debe comprobar si esos modos aportan diversión propia; su mera presencia no valida que mejoren la campaña.

Promesa de portada propuesta: **«Devuelve el color a Dulcelandia. Una jugada, un recuerdo.»** El botón principal lleva al siguiente nivel real; los nombres Guerra 5v5 y Royale siguen visibles. Las partidas locales deben identificarse como tales.

## El canal cambia la economía

La decisión de Jose continúa: **ningún intersticial forzado**. No introducir cortes automáticos para copiar una economía móvil.

Poki recomienda entrada directa, tutoriales visuales y secuencias saltables; desaconseja la doble moneda y el bloqueo de progreso tras videos. Su UI exige alternativa normal simultánea, igual o mayor que la opción de video, situada arriba o al lado; el botón rewarded lleva icono y no puede ser verde. Debe funcionar con adblock y el contenido externo se empaqueta salvo excepción. [Requisitos oficiales](https://developers.poki.com/guide/requirements-quality).

CrazyGames exige que el juego funcione con publicidad deshabilitada durante Basic Launch, sin monetización en esa fase. Full Launch exige la integración correspondiente; la aceptación no está garantizada. [Proceso oficial](https://docs.crazygames.com/requirements/intro/).

Para CrazyGames, el video con recompensa es voluntario, tiene alternativa y no puede convertir un nivel imposible en una obligación publicitaria. No se entrega premio ante `adError`; los botones sin efecto no son aceptables. Las oportunidades deben ser ocasionales, fuera del juego activo. [Publicidad oficial](https://docs.crazygames.com/requirements/ads/).

**Aplicación propuesta:** conservar compatibilidad del guardado, presentar la miel como recurso de construcción y revisar si las gemas aportan una decisión útil. Mantener siempre una vía jugable sin anuncio. Hasta elegir e integrar un portal, no mostrar videos simulados como si fueran reales ni prometer ingresos. El diseño puede dejar preparados los puntos de ayuda opcional, pero su disponibilidad y premio dependen del SDK real.

## Cinco mejoras en orden

Estas son prioridades de producto, no una afirmación de que todas estén implementadas. El resumen de entrega debe distinguir lo realizado de lo pendiente.

| Prioridad | Cambio concreto | Por qué y límite |
|---|---|---|
| **P0 · Entrar y entender** | Jugar/Continuar inicia el próximo nivel en un toque. Una indicación breve sobre el tablero enseña deslizar o tocar dos piezas. Se retira tras la primera jugada válida. | El usuario debe actuar antes de recibir explicaciones largas. No interponer tienda, calendario ni prólogo obligatorio. |
| **P0 · Ver qué falta** | Mostrar una frase operativa: «Reúne 12 piezas rosas», «Rompe 6 sellos» o «Libera 800 de luz», con cantidad restante y movimientos siempre visibles. Al ganar, paisaje y guardián reflejan el cambio logrado. | El progreso debe corresponder al objetivo real, no a una barra decorativa. Los colores necesitan también siluetas o símbolos distinguibles. |
| **P1 · Conectar victoria y hogar** | En el resultado, enseñar próxima construcción, coste, miel disponible y cuánto falta; ofrecer «Ver la aldea» como acción secundaria. | La recompensa adquiere propósito sin obligar a pasar por otra pantalla. Construir sigue siendo una acción explícita. |
| **P1 · Regresar por un reto** | Un reto diario de reglas y semilla constantes durante el día, marca personal y recompensa limitada a una reclamación. No reiniciar la campaña ni castigar faltar un día. | Hipótesis: una propuesta fresca puede crear retorno sin presión por perder una racha. Hay que medirlo; no se afirma que ya aumente retención. |
| **P1 · Elegir intensidad** | Conservar una opción tranquila sin vidas/tiempo, ayudas con miel ganable y acceso visible a Guerra/Royale. En combate, enseñar movimiento, Pulso e Impulso junto al control y mostrar las zonas de ataque. | El jugador conserva una actividad disponible. El modo tranquilo y las arenas no deben entregar victorias falsas de campaña ni presentarse como multijugador online. |

No ampliar a cientos de niveles ni sumar sistemas de clanes, pases y monedas antes de validar estas cinco prioridades. Esa es una decisión de alcance, no una regla general del género.

## Validación medible propuesta

Primero realizar **10 sesiones observadas** con personas ajenas al desarrollo, repartidas entre móvil y escritorio. Es una prueba cualitativa para encontrar problemas, no una muestra para estimar el mercado. No explicar de antemano el objetivo ni los controles. Registrar la versión exacta, dispositivo, tiempo y punto de abandono.

| Pregunta | Criterio interno de aceptación propuesto | Método |
|---|---|---|
| ¿Se empieza rápido? | Al menos 8/10 hacen una jugada válida sin ayuda en los primeros 30 s desde que la página queda interactiva. | Observación y cronómetro; medir carga por separado. |
| ¿Se entiende la partida? | Al menos 8/10 explican qué falta para ganar y dónde están los movimientos antes de su tercera jugada. | Pregunta abierta, sin sugerir respuesta. |
| ¿Se entiende el progreso? | Al menos 8/10 identifican el siguiente nivel y una consecuencia visible al terminar el primero. | Observar el resultado y pedir que continúen. |
| ¿La aldea tiene propósito? | Al menos 7/10 encuentran la próxima construcción y explican su coste sin guía. | Tarea de descubrimiento después de dos victorias. |
| ¿Los modos se encuentran? | Al menos 8/10 entran al modo solicitado en dos acciones o menos y reconocen que juegan contra IA. | Empezar desde portada; alternar Guerra/Royale. |
| ¿Es cómodo en móvil? | Sin desbordamiento ni controles inaccesibles a 320×640 y 390×844; sin errores de consola durante el recorrido. | Navegador y después teléfono físico. Separar claramente ambas pruebas. |

Después, comparar dos versiones con un grupo mayor: entrada actual frente a entrada con tutor contextual, o resultado actual frente a resultado con próxima construcción. Cambiar una variable cada vez, definir duración y muestra antes de empezar, e informar conteos además de porcentajes. Medir conversión a primera jugada, inicio del segundo y tercer nivel, finalizaciones, abandonos y retorno al día siguiente. No fijar un D1 «de mercado» sin una fuente comparable ni afirmar mejora por unas pocas partidas internas.

Los eventos básicos de carga e inicio/parada del SDK de Poki permiten distinguir carga, juego e interrupciones. [Eventos oficiales](https://developers.poki.com/guide/sdk-overview). Los recorridos automatizados locales validan reglas y acceso; no miden diversión, retención ni éxito comercial.

## Fuentes y trazabilidad

Todas las fuentes enlazadas arriba se leyeron el día indicado. Son páginas primarias del creador/soporte o del portal que distribuye el producto. Las inferencias y metas propuestas se etiquetan expresamente. Las fichas comerciales son material del proveedor; no equivalen a una evaluación independiente de calidad. No se han usado cifras de terceros ni opiniones de foros como hechos de mercado.

## Actualización: mejoras implementadas y validación pendiente

Estado al cierre de esta iteración, **21 de octubre de 2026 UTC**. La tabla de prioridades anterior recoge las recomendaciones iniciales; este apartado distingue su aplicación real de las hipótesis pendientes. Se revisaron el código local y el informe reproducible del motor. No se han medido todavía conversión, retención ni preferencia con jugadores humanos.

| Comparación con la fuente | Presente en Renacer | Qué queda por demostrar |
|---|---|---|
| Candy Crush documenta controles de intercambio y objetivos con movimientos limitados. [Soporte oficial](https://candycrush.zendesk.com/hc/en-us/articles/360000750278-Controls-how-to-switch-and-match-candies). | Controles de arrastrar o tocar dos piezas; primera partida con dos piezas marcadas para aprender una combinación de cuatro que crea un rayo, sin modal obligatorio. Objetivos y movimientos en el tablero. | Que una persona nueva entienda el gesto, el objetivo y los poderes sin ayuda. |
| Royal Match vincula resolver puzzles con renovar un castillo. [Dream Games](https://www.dreamgames.com/games/royal-match). | El resultado muestra la próxima construcción de la aldea, miel necesaria y acceso directo para visitarla. Construir sigue requiriendo una acción explícita. | Que el jugador entienda para qué sirve la recompensa y quiera construir. |
| Royal Kingdom vincula la campaña con recuperar distritos e incorpora enfrentamientos en el puzzle. [Dream Games](https://www.dreamgames.com/games/royal-kingdom). | Guardianes y recuperación del paisaje acompañan la campaña. Guerra y Royale tienen entrada directa visible en la primera pantalla móvil; funcionan localmente contra IA. | Claridad y diversión de cada sistema; no se ha comparado su calidad jugando contra el competidor. |
| Poki pide una entrada sencilla y recomienda evitar economías confusas. [Guía oficial](https://developers.poki.com/guide/requirements-quality). | Continuar lleva al próximo nivel. El reto diario entra sin vidas. Fraunces y Karla están incluidas en `index.html` como WOFF2 en base64, sin peticiones remotas de fuentes. | Integración y revisión del portal; siguen existiendo miel, gemas y vidas de campaña como diseño bajo prueba. Ganar ya devuelve la vida reservada. |
| CrazyGames exige juego funcional cuando los anuncios están deshabilitados. [Publicidad oficial](https://docs.crazygames.com/requirements/ads/). | No hay SDK publicitario ni anuncios reales conectados, ni intersticiales forzados. Hay cinco modos gratuitos sin vidas: Diario, Supervivencia, Zen, Guerra y Royale. | Probar integración real, disponibilidad, pausa/audio y callbacks de error antes de ofrecer premios por video. |

El **reto diario** utiliza una semilla estable por fecha local, no consume vidas y no penaliza una racha perdida. La victoria concede **40 de miel y 5 gemas una sola vez por día**. Es una función implementada; su efecto sobre el retorno de jugadores sigue siendo una hipótesis.

Se redujeron las metas de recolección después de que un recorrido con el motor real detectara una barrera en **territorio 5, nivel 2**. El recorrido final completó **80/80 niveles en 108 intentos, con 28 derrotas**, sin forzar victorias ni comprar ayudas; utilizó el Pulso de Confite. El bot emplea decisiones inmediatas y una semilla reproducible: el resultado verifica acceso y reglas bajo esas condiciones, no dificultad humana ni equilibrio comercial. [Informe del recorrido](RENACER_PLAYTHROUGH.md), [datos por intento](RENACER_PLAYTHROUGH.json).

La comparación de vidas llevó a corregir una fricción concreta: antes se consumía una vida incluso ganando. Ahora la campaña la reserva al entrar y la devuelve al completar una victoria ganada, con techo máximo y protección contra devolución duplicada. Derrota o abandono mantienen el coste. Esto conserva la puerta de acceso y permite encadenar victorias. El recorrido actualizado registró **24 esperas simuladas de 25 minutos (600 minutos)** al agotarse las vidas por derrotas. Son avances del reloj de prueba, no tiempo de espera observado en personas. El ritmo de vidas y la doble moneda todavía necesitan validación humana; los otros cinco modos permanecen disponibles sin gastar vidas.

Las fuentes conservan sus licencias OFL en [Fraunces](FONT_LICENSE_FRAUNCES.txt) y [Karla](FONT_LICENSE_KARLA.txt). Empaquetarlas elimina la petición remota de tipografía; por sí solo no certifica todos los requisitos del portal.

Antes de una publicación comercial quedan las sesiones observadas y mediciones propuestas, la prueba en teléfono físico, la decisión e integración del SDK del portal y su proceso de aceptación. No se ha publicado esta iteración como consecuencia de este estudio y no se estiman ingresos. Ninguna fila de la comparación asigna posiciones de mercado ni afirma que Renacer supere a los competidores.
