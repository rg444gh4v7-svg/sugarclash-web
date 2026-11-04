# CHISPA · contrato y doce escenas del prototipo

**Fecha de diseño:2026-11-03. Estado actual: doce escenas implementadas y recorridas con el motor y los controles reales.** [Evidencia técnica](CHISPA_PROTOTYPE_QA.md). Pruebas con participantes pendientes.

CHISPA es un nombre provisional. Jose autorizó planificar y después implementar el cambio. Este documento conserva el diseño; el runtime está en `prototypes/chispa/index.html`. Se coordina con [CHISPA_PLAN.md](CHISPA_PLAN.md) y [CHISPA_VISUAL.md](CHISPA_VISUAL.md). Las coordenadas y soluciones siguientes ya se han verificado con el motor real; las referencias no son mínimos demostrados. Un dibujo convincente no es una prueba de resolución.

## La acción que se prueba

**Apunta una chispa, enciende las lámparas y cambia una máquina para preparar el siguiente tiro.** La dificultad buscada es decidir qué transformar y en qué orden, con rebotes fáciles de leer. No hay azar, reloj, reflejos rápidos ni límite de intentos. Las referencias de tiros ayudan a comparar soluciones; nunca son vidas ni condición de victoria.

El prototipo conserva Dulcelandia, el contraste dark/descolorido frente al color recuperado, materiales sobrios y Confite como compañero discreto. No necesita una introducción narrativa, un guardián con barra de vida ni trasladar los ochenta niveles, la aldea o la economía de Renacer. Los doce nombres son lugares provisionales de una primera zona, no capítulos de una campaña ya producida. No revelar la historia final de Confite.

## Contrato físico y de estados

### Campo y elementos

- Campo físico cuadrado **100×100**, origen arriba a la izquierda; `x` crece a la derecha, `y` hacia abajo. Se inscribe sin deformar en el marco visual adaptativo. Paisaje, conexiones y bandas exteriores no colisionan.
- Fuente fija `S=(50,90)` en estas doce escenas. Su dibujo no crea otro obstáculo. Cambia la dirección del disparo; la fuerza y la velocidad no dependen de cuánto se arrastre.
- Radio lógico inicial de chispa **0,75**. Lámpara **3,5**; actuador **4**. Espejo de longitud total **14**, grosor **1**, centrado en su coordenada; paredes de grosor **2**. Espejos/paredes son segmentos con extremos redondeados, no rectas infinitas. Estas medidas se pueden revisar juntas antes de aprobar geometría.
- Los dos lados de un espejo reflejan. `/` une abajo-izquierda con arriba-derecha; `\` une arriba-izquierda con abajo-derecha. Su trama dorsal no indica absorción. Una dirección vertical ascendente pasa a la derecha al tocar `/`, y a la izquierda al tocar `\`.
- Pared interior clara: refleja. Compuerta cerrada: **absorbe**, con el material oscuro de los absorbentes; abierta: sin colisión dentro del paso. El borde del campo es una **salida**, no una pared rebotable. La salida ocurre cuando el disco alcanza ese borde; la preview termina allí.
- Lámpara: sensor sin cuerpo sólido. Al alcanzarla se enciende y la chispa sigue. Una lámpara ya encendida sigue siendo pasante y no duplica eventos ni progreso.
- Actuador inactivo: absorbe al primer contacto y termina el tiro. Al resolver, aplica **un único cambio definido por datos**: orientar un espejo a su posición final o abrir una compuerta. Queda activado una sola vez. Actuador ya activo: centro hueco, pasante, no absorbe ni vuelve a cambiar nada.
- Cada actuador controla un solo elemento; cada elemento móvil tiene un solo controlador en el prototipo. Espejos estáticos no tienen controlador. No hay interruptores que alternen, mecanismos con tiempo ni piezas empujadas por física.

Almacenar superficies por sus centros, segmentos y orientaciones físicas; no copiar a mano una versión para dibujar y otra para colisionar. Todas las consultas incluyen el radio real de chispa. Los huecos propuestos tienen al menos14 unidades; objetivos y actuadores no se superponen ni quedan ocultos bajo controles.

### Preparación, recorrido y resolución

1. **Apuntando.** La dirección sale de la fuente. Preview completa con la geometría actual, hasta el mismo final que tendría un tiro real. Soltar un arrastre válido dispara; cancelar el puntero o el gesto no dispara. Teclado ofrece apuntado, ajuste fino, disparo y cancelación equivalentes. No se puede disparar dos veces durante una reproducción.
2. **Simulación pura.** Capturar estado y geometría al lanzar. Calcular un recorrido/eventos determinista sin DOM, tiempo de fotogramas, audio ni RNG. Apuntar y consultar la preview nunca encienden lámparas ni consumen un tiro.
3. **Orden de contacto.** En cada segmento, ordenar por distancia recorrida desde su inicio. Registrar las lámparas alcanzadas antes del contacto sólido que termina o refleja ese segmento. Un actuador inactivo termina inmediatamente: no se simula detrás de él. La geometría se mantiene congelada durante todo el tiro.
4. **Reproducción.** Las lámparas pueden mostrarse encendidas al llegar la chispa. Es presentación del recorrido calculado; no hay otra simulación dependiente de la animación. Un mecanismo no gira mientras la chispa sigue viajando.
5. **Resolver una vez.** Con el tiro terminado, conservar las lámparas alcanzadas y aplicar, si hubo uno, el cambio del actuador terminal. Actualizar el contador una vez. Mostrar el nuevo espejo/compuerta y permitir apuntar sólo en su posición final. En movimiento reducido se aplica esa posición sin esperar una animación ornamental.
6. **Victoria.** Comprobar después de resolver que **todas las lámparas declaradas como objetivo** están encendidas. No es obligatorio activar todos los actuadores ni usar el número de tiros previsto. Si se alcanzó la última lámpara antes de un actuador, la chispa aún llega a su final físico y luego se resuelve la victoria y el cambio una sola vez.

Identificador de intento y de tiro impiden aplicar dos veces una resolución o aplicar callbacks a una escena nueva. Un cambio de tamaño, DPR, velocidad visual, silencio o movimiento reducido no cambia el recorrido ni el resultado.

### Empates, esquinas y límites

Tolerancia numérica inicial de comparación: **10⁻⁶ unidades lógicas**, compartida por preview y disparo, con pruebas específicas de rasantes. Es una propuesta para el motor, no una exactitud ya medida. Los ids estables permiten repetir un desempate; no depender del orden incidental de objetos en el DOM.

- Si sensores de lámpara tienen la misma distancia, registrar por id estable. Registrar el contacto de lámpara antes de un evento terminal a igual distancia. No diseñar una solución que necesite este empate: los sensores se separan de absorbentes y esquinas.
- Un absorbente o salida a la misma distancia que un reflector termina el tiro. Dos contactos reflectantes simultáneos con normales no paralelas terminan como **esquina**, sin una dirección elegida al azar. Normales equivalentes representan un solo choque. Una escena válida no necesita acertar en una unión de superficies.
- Máximo **6 reflexiones efectivamente ejecutadas**, con recorrido total de **300 unidades**. Después de la sexta reflexión existe un **segmento final**: puede encender lámparas y terminar en actuador, absorbente, salida o distancia300. Si llega a un séptimo contacto reflector, termina allí **sin ejecutar esa reflexión**. Por tanto puede haber hasta siete segmentos de vuelo; los sensores pasantes no suman reflexiones.
- El presupuesto de distancia incluye todos los segmentos y el final; no son300 por tramo. Si300 cae antes del siguiente contacto, terminar justo en ese punto. Si un contacto está exactamente en300 dentro de la tolerancia, procesar las lámparas allí y un actuador absorbente allí; no ejecutar una reflexión que no tendría recorrido posterior. El paso numérico de separación tras un choque no debe crear energía, saltarse sensores ni ampliar el presupuesto.
- Llegar a un límite técnico **no genera derrota** ni concede nada por sí solo. Al resolver, sólo hay victoria si las lámparas objetivo fueron realmente alcanzadas. Mensaje de fin si hace falta: «La chispa se apagó. Puedes volver a apuntar».

Una trayectoria válida puede acabar en el borde o en el límite después de encender sus objetivos. Ninguna solución de referencia debe depender de un contacto rasante, del desempate de esquina o de superar los límites.

### Error, deshacer y continuidad

No existe una pantalla de derrota por gastar tiros. Un disparo que no enciende lámparas puede ser útil si mueve un mecanismo. Si no cambia nada, se permite volver a apuntar. No anunciar que un estado es imposible si no se ha demostrado.

**Deshacer** restaura la instantánea anterior al último tiro: lámparas, actuadores, orientaciones, compuertas, contador y color parcial. Es gratuito, sin anuncio ni moneda. **Reiniciar** vuelve al estado inicial y contador0; confirmar sólo si hay avance que perder. Deshacer y reiniciar no manipulan otros guardados. Durante un tiro, primero se pausa/cancela su reproducción de forma controlada; nunca se ejecutan a la vez la resolución anterior y el reinicio.

Al pausar u ocultar, no avanzan la reproducción ni las activaciones. Al volver se continúa deliberadamente sobre el mismo recorrido. Salir no concede una victoria. Cuando exista sesión reanudable, restaurarla sólo con id/revisión de escena compatibles; durante el prototipo no prometer persistencia que todavía no esté implementada. El estado parcial y el historial son de esta escena, sin equivalencias con estrellas, miel, gemas o vidas de Renacer.

Contador: «Tiros: N». Una referencia se presenta como **«Referencia de diseño: N tiros»** hasta validarla; después puede abreviarse a «Referencia: N». No llamarla «mínimo» ni «óptimo» sin prueba. Si aparece una solución más corta, es legítima salvo que explote un fallo físico; revisar el diseño, no invalidar al jugador. Tras completar, Repetir abre un intento nuevo; deshacer no revoca victorias previamente ganadas ni duplica concesiones.

## Notación para las doce escenas

`L` es lámpara objetivo; `A` actuador inactivo; `M` espejo; `G` compuerta. Todas las lámparas y actuadores empiezan apagados/inactivos. Los puntos de puntería describen dirección desde `S`, no zonas que haya que tocar. Ángulo0° apunta arriba; positivo gira hacia la derecha: una dirección se puede reproducir como `atan2(P.x-S.x, S.y-P.y)`.

La trayectoria prevista usa centros ideales; el motor con radio y grosor producirá contactos algo desplazados. No forzar el motor a pasar por esos centros ni usar un ángulo dibujado como evidencia. Todas las escenas conservan el borde de salida100×100.

Geometrías reutilizadas para que el implementador no tenga que inferir los tabiques:

| Base | Paredes rebotables, expresadas como extremos de segmento |
| --- | --- |
| **C · paso central** | `(8,60)–(43,60)` y `(57,60)–(92,60)`. Hueco central entre43 y57. |
| **P · dos pasos laterales** | `(8,55)–(28,55)`, `(42,55)–(58,55)` y `(72,55)–(92,55)`. Huecos centrados en35 y65. |
| **T · paso lateral y central** | `(8,60)–(18,60)`, `(32,60)–(43,60)` y `(57,60)–(92,60)`. Huecos centrados en25 y50. |
| **D · doble espejo** | `(8,65)–(43,65)` y `(57,65)–(92,65)`. Hueco central entre43 y57. |

Una compuerta ocupa el hueco indicado con un segmento absorbente del mismo grosor que su tabique. Las paredes no se prolongan hasta el borde por omisión: el solucionador debe comprobar también los posibles atajos por sus extremos.

## Doce niveles propuestos

### 01 · La primera ventana

- **Objetivo y disposición:** encender `L1=(50,40)`. Fuente abajo, lámpara arriba; sin pared, espejo ni actuador.
- **Solución prevista:** tiro1 hacia `(50,10)`; cruza L1 y sale por el borde superior. **Referencia:1**.
- **Enseña:** apuntar, soltar, lámpara pasante y meta visible «Lámparas0/1».
- **Fallo/atajo a verificar:** un gesto cancelado no dispara; tocar el dibujo de la lámpara sin lanzar no la enciende. Varias direcciones cercanas a la vertical deben acertar. Si requiere puntería precisa, el primer objetivo es demasiado pequeño.

### 02 · El molino gira primero

- **Objetivo y disposición:** baseC; `M1=(50,35)` empieza `\`; `A1=(50,72)` controla su posición final `/`; `L1=(82,35)` a la derecha. Una conexión visible une rueda/actuador con pivote.
- **Solución prevista:** tiro1 hacia `(50,10)` termina en A1; sólo después M1 gira. Tiro2 en la misma dirección atraviesa A1 ya hueco, alcanza M1 y se refleja hacia L1. **Referencia:2**.
- **Enseña:** ya en el segundo encuentro, el primer tiro transforma la máquina y el siguiente utiliza el cambio, con la misma dirección. La preview enseña el espejo por esa consecuencia visible; no hace falta un tutorial previo de rebotes. El molino es la forma del actuador, no otra mecánica.
- **Fallo/atajo a verificar:** el primer tiro no puede continuar con el espejo girado ni encender L1 a través de A1. Buscar rebotes laterales que permitan evitar toda transformación: serían un problema para esta introducción, aunque fueran una victoria físicamente legítima.

### 03 · El espejo de la curva

- **Objetivo y disposición:** baseC; `M1=(50,35)` estático `/`; `L1=(82,35)` a la derecha, al otro lado del tabique para un tiro directo desde S.
- **Solución prevista:** tiro1 hacia `(50,10)` atraviesa el paso central; M1 lo refleja a la derecha y enciende L1. **Referencia:1**.
- **Enseña:** refuerza la orientación física del espejo después de verlo girar en la escena02. La reflexión responde a su lámina, no a una flecha decorativa; aquí permanece estático.
- **Fallo/atajo a verificar:** el rayo directo a L1 debe chocar con el tabique derecho. Comprobar los dos lados del espejo y preview/tiro con el mismo radio. No evaluar rapidez ni exigir que memorice los ángulos de la escena02: la preview muestra la ruta actual.

### 04 · La pared devuelve la luz

- **Objetivo y disposición:** `L1=(50,20)`. Tabique horizontal `(20,50)–(72,50)` tapa el tiro directo; pared vertical derecha `(85,30)–(85,88)` proporciona el rebote.
- **Solución prevista:** tiro1 hacia `(85,55)`: arriba-derecha hasta la pared derecha; rebota arriba-izquierda, pasa por el extremo derecho del tabique y alcanza L1. **Referencia:1**.
- **Enseña:** una pared clara también refleja, igual que un espejo, y su orientación determina el rebote. Refuerza la diferencia entre estos materiales y la compuerta absorbente que aparecerá después; aquí no hay actuador.
- **Fallo/atajo a verificar:** la vertical debe quedar bloqueada por el tabique. Verificar el margen al pasar su extremo y que el rebote no dependa de golpear el extremo de la pared derecha. Si aparece un tiro directo válido, la escena no enseña lo previsto y hay que recolocar el tabique.

### 05 · Una compuerta abierta

- **Objetivo y disposición:** baseC con `G1=(43,60)–(57,60)` cerrada; `L1=(50,20)` arriba; `A1=(22,75)` abajo-izquierda controla G1. Sin espejo.
- **Solución prevista:** tiro1 hacia A1; se absorbe y abre G1 al resolver. Tiro2 hacia `(50,10)` atraviesa el paso abierto y enciende L1. **Referencia:2**.
- **Enseña:** compuerta cerrada detiene; abierta desaparece como colisión. La conexión permite anticipar qué paso se abre.
- **Fallo/atajo a verificar:** apuntar arriba antes de activar debe terminar en la compuerta, sin rebote. La decoración de su alojamiento no puede bloquear el paso ya abierto. El hueco es amplio, no una prueba de pulso firme.

### 06 · Luz antes del mecanismo

- **Objetivo y disposición:** baseC; `L1=(50,82)` delante de `A1=(50,72)`; `M1=(50,35)` de `\` a `/` por A1; `L2=(82,35)` a la derecha.
- **Solución prevista:** tiro1 hacia `(50,10)` enciende L1, continúa hasta A1 y allí termina; M1 gira. Tiro2 por el mismo paso/espejo enciende L2. **Referencia:2**.
- **Enseña:** lámpara y actuador son distintos; una lámpara alcanzada antes del actuador cuenta. La pantalla muestra1/2 antes del segundo tiro.
- **Fallo/atajo a verificar:** no absorber en L1 ni perderla al aplicar el cambio. Deshacer tiro1 devuelve ambas lámparas apagadas, espejo inicial y actuador inactivo; no sólo el contador. Verificar separación física entre L1, A1 y S.

### 07 · Primero esta orilla

- **Objetivo y disposición:** baseC; `M1=(50,35)` empieza `\`; `L1=(18,35)` a la izquierda y `L2=(82,35)` a la derecha. `A1=(22,74)` cambia M1 a `/`.
- **Solución prevista:** tiro1 hacia `(50,10)` usa el espejo inicial para encender L1. Tiro2 hacia A1 gira el espejo. Tiro3 hacia `(50,10)` enciende L2. **Referencia:3**.
- **Enseña:** un cambio útil puede cerrar una ruta anterior. Mirar ambos objetivos antes de activar; deshacer es parte de experimentar.
- **Fallo/atajo a verificar:** activar A1 primero debe hacer evidente qué ruta se perdió, sin inventar una derrota. Buscar soluciones que enciendan las dos lámparas con el espejo final mediante otros rebotes. Si existen, aceptarlas; si eliminan la decisión de orden, modificar la geometría antes de aprobar la escena.

### 08 · Abrir para poder girar

- **Objetivo y disposición:** baseC; G1 cierra el hueco central; `A1=(22,75)` abre G1. Arriba del paso, `A2=(50,43)` cambia `M1=(50,25)` de `\` a `/`; `L1=(82,25)` queda a la derecha.
- **Solución prevista:** tiro1 a A1 abre G1. Tiro2 hacia `(50,10)` pasa por G1 y termina en A2; gira M1. Tiro3 por el mismo paso refleja en M1 y enciende L1. **Referencia:3**.
- **Enseña:** dos cambios conocidos en secuencia; el estado actual determina a qué actuador se puede llegar. No se introduce un elemento nuevo.
- **Fallo/atajo a verificar:** el tiro2 termina en A2 aunque su preview anterior llegara al espejo si A2 no existiese. Las conexiones no se cruzan de forma confusa. Una ruta por fuera de los tabiques no debe convertir A2 en accesible desde el inicio sin G1.

### 09 · Dos ventanas independientes

- **Objetivo y disposición:** baseP; `G1=(28,55)–(42,55)` y `G2=(58,55)–(72,55)` cerradas. `A1=(22,75)` abre G1; `A2=(78,75)` abre G2. Lámparas `L1=(20,20)` y `L2=(80,20)` arriba de sus pasos.
- **Solución prevista:** tiro1 a A1; tiro2 hacia L1 cruza el paso izquierdo. Tiro3 a A2; tiro4 hacia L2 cruza el derecho. Abrir ambas primero o empezar por la derecha también es válido. **Referencia:4**.
- **Enseña:** decidir entre rutas independientes; no memorizar una única secuencia de botones. El orden no es una condición oculta.
- **Fallo/atajo a verificar:** ninguna conexión debe parecer que un actuador abre ambas puertas. Buscar un tiro que alcance las dos lámparas y revisar si ofrece una alternativa interesante o elimina toda preparación. No marcar como erróneo invertir el orden de las ramas.

### 10 · La rueda deja pasar

- **Objetivo y disposición:** baseT; `M1=(50,35)` estático `/`. `A1=(78,35)` está en la salida derecha del espejo; detrás queda `L1=(90,35)`. A1 abre `G1=(18,60)–(32,60)`, el paso lateral izquierdo, hacia `L2=(15,48)`.
- **Solución prevista:** tiro1 hacia `(50,10)` usa M1 y termina en A1; abre G1. Tiro2 por el mismo espejo atraviesa A1 ya hueco y enciende L1. Tiro3 directo hacia L2 cruza el paso izquierdo. Los dos últimos tiros pueden invertirse. **Referencia:3**.
- **Enseña:** actuador activado no vuelve a consumir la chispa; puede formar parte de una ruta. Una preparación puede beneficiar dos objetivos distintos.
- **Fallo/atajo a verificar:** L1 no se enciende en tiro1; A1 no se reactiva en tiro2. El paso izquierdo cerrado bloquea la línea directa a L2, y el abierto la deja pasar con margen. No exigir activar nada después de que ambas lámparas estén encendidas.

### 11 · Dos reflejos y una decisión

- **Objetivo y disposición:** baseD; `M1=(50,45)` estático `/`; `M2=(78,45)` de `\` a `/` por `A1=(22,80)`. `L1=(78,58)` debajo de M2 y `L2=(75,18)` arriba, ligeramente a la izquierda para admitir el desplazamiento de contacto de un disco con grosor.
- **Solución prevista:** tiro1 hacia `(50,10)` pasa por M1, llega a M2 y baja a L1. Puede después reflejar en el tabique; no se exige cortar el tiro justo al encenderla. Tiro2 a A1 gira M2. Tiro3 repite la entrada por M1/M2, ahora sale hacia arriba y enciende L2. **Referencia:3**.
- **Enseña:** dos reflejos legibles y conservación del objetivo ya ganado antes de cambiar el segundo espejo. Sólo un espejo es móvil.
- **Fallo/atajo a verificar:** el tramo que vuelve del tabique no debe activar A1 por accidente ni encender L2 antes del cambio. Verificar la cadena completa, no sólo sus dos primeros segmentos. Si observar dos reflejos resulta confuso incluso con preview, simplificar la escena antes de aumentar dificultad.

### 12 · La casa que vuelve a encenderse

- **Objetivo y disposición:** baseD con G1 cerrando el hueco central. `A1=(22,80)` abre G1. `M1=(50,45)` estático `/`; `M2=(78,45)` de `\` a `/` por `A2=(78,80)`. Lámparas `L1=(64,45)` entre espejos, `L2=(78,58)` debajo de M2 y `L3=(75,18)` arriba, con el mismo margen de contacto de la escena11.
- **Solución prevista:** tiro1 a A1 abre G1. Tiro2 hacia `(50,10)` pasa por M1, enciende L1, refleja en M2 y enciende L2. Tiro3 a A2 gira M2. Tiro4 por el mismo paso y espejos enciende L3. **Referencia:4**.
- **Enseña:** culminación con compuerta, dos espejos y elección de orden; ninguna regla nueva. Tres lámparas bastan para que el lugar se recupere. No añadir un jefe ni una segunda meta.
- **Fallo/atajo a verificar:** girar M2 antes de L2 debe ser un error comprensible y deshacible. Buscar accesos directos a A2/L3 por extremos, pasos que permitan evitar G1 y trayectorias que enciendan todo sin transformar nada. Un atajo útil puede ser una solución; uno que borre la premisa invalida este diseño de cierre.

## Validar antes de llamar resuelto a un nivel

### Datos y simulación

Convertir cada escena en datos con `id`, `revision`, fuente, superficies, lámparas objetivo, estados iniciales y conexiones por id. Validar límites, medidas positivas, ids únicos, un controlador por elemento y ausencia de solapamientos ilegales. Una escena sin lámparas o con geometría imposible se rechaza con un error legible; no se completa por defecto.

El mismo `traceShot` propuesto calcula preview, reproducción y soluciones del verificador; `applyShot` aplica las consecuencias una vez. Guardar el resultado de cada tiro, no volver a simularlo con el reloj de animación.

Para cada solución prevista, obtener **ángulos reales** del motor con el radio y grosor definitivos. Reproducir desde estado inicial y exportar revisión, secuencia de ángulos, trazas, motivo terminal de cada tiro, lámparas tocadas, actuador terminal, cambio aplicado, estado final y cantidad de tiros. Comparar contra el objetivo, no contra el dibujo o una llamada manual a victoria. Si no funciona, corregir datos/diseño y repetir; no anunciar que estos doce bocetos ya pasaron QA.

### Solucionador y atajos

Buscar sobre estados discretos —conjunto de lámparas encendidas y actuadores activados; posiciones finales derivadas—, expandiendo acciones con la misma geometría pura. Una búsqueda por cantidad de tiros puede descubrir soluciones cortas; deduplicar estados no implica que se hayan examinado todos los ángulos posibles.

Un barrido angular inicial y refinamiento alrededor de contactos son herramientas prácticas. Un barrido finito **no demuestra** que una escena carezca de atajos ni que una referencia sea óptima. Para afirmar exhaustividad se necesita cubrir intervalos angulares/eventos de la geometría con una justificación adicional. Registrar la resolución y los límites de la búsqueda. Revisar especialmente bordes de espejos, pasos exteriores a tabiques y múltiples reflejos de regreso.

La prioridad inicial no es una prueba matemática del mínimo: es tener una solución repetible, alternativas permitidas, sin contradicciones y con margen humano. Buscar un intervalo de acierto conectado alrededor de cada tiro de referencia; como criterio interno inicial, pretender al menos **4° de amplitud** para tiros01–06 y **2°** después, y luego verificarlo en móvil. Si requiere una aguja angular, agrandar objetivo/paso o recolocar el mecanismo. No introducir imán de puntería o desviación aleatoria para ocultarlo.

### Lógica frente a ejecución

| Dimensión | Qué observar | Qué hacer si falla |
| --- | --- | --- |
| Ejecución | El jugador sabe adónde apunta y puede realizar ese tiro en una mano. Preview y resultado coinciden; el dedo no tapa el origen. | Ajustar controles/márgenes y geometría. No llamar «dificultad» a una interfaz imprecisa. |
| Lógica | Puede explicar qué cambió, anticipar el siguiente camino y elegir cuándo activar. | Simplificar conexiones, orden o cantidad de elementos. No resolverlo añadiendo más texto. |
| Lectura de rebotes | Distingue espejo, pared y compuerta; sigue ida y vuelta sin confundir la dirección de los segmentos. | Reducir reflejos, separar cruces y reforzar sentido. Evitar aumentar efectos o decoración. |
| Dominio | Tras resolver, puede intentar una secuencia distinta o más corta por voluntad propia. | Revisar variedad de decisiones. No añadir una escasez que fuerce repetición. |

La escena01 enseña el gesto; la02 muestra la transformación entre tiros;03/04 refuerzan la reflexión de espejo/pared;05/06 introducen la compuerta y confirman los elementos pasantes;07–12 prueban decisiones de orden y combinación de las mismas herramientas. El objetivo inicial de la sesión es que el jugador observe y utilice una transformación dentro de los primeros dos encuentros. Es una secuencia de aprendizaje propuesta, no evidencia de que funcione con personas.

## Comprobaciones de cierre del prototipo

- Preview y tiro idénticos en estado/ángulo; lámpara antes de actuador; actuador activo pasante; compuerta antes/después; ambos lados de espejo; extremos y esquina; sexta reflexión con segmento final, séptimo contacto y distancia300.
- Deshacer/reiniciar/pausar/ocultar durante apuntado, reproducción y resolución, sin doble activación ni callbacks sobre otro intento. El contador se restaura con el estado; cancelar puntero no dispara.
- Completar metas con más tiros que la referencia gana igual; omitir un actuador innecesario no impide ganar. Un render, abrir Escenas, preview o esperar no enciende objetivos ni concede progreso.
- Campo cuadrado completo, fuente y controles a320×640/390×844/escritorio; DPI, zoom y refresco no cambian geometría. Audio y movimiento reducido conservan la información.
- El runtime del prototipo, su posible guardado y su QA están aislados de Renacer. No tocar `sugarclash_renacer_v1`, `sugarclash_save_v1`, el puerto4177 ni producción. Las125 pruebas y el recorrido80/80 de Renacer no validan esta lista.

Una vez disponibles el motor y las trazas, este documento podrá marcar revisiones individuales como simuladas, recorridas por controles reales y probadas con personas, con evidencias separadas. **Las doce escenas están implementadas, recorridas con el motor y verificadas mediante controles reales. No se han probado con participantes.**
