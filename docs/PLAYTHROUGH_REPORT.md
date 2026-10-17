# Recorrido de campaña — 17 de octubre de 2026

Los 80 niveles de Dulcelandia se superaron en orden con el motor real: **97 intentos, 17 derrotas y 471 intercambios válidos**. Los ocho guardianes abrieron su introducción y comenzaron mediante el botón real, con el cobro normal de una vida. La campaña terminó con `campaignNext().complete === true`.

El primer recorrido reprodujo el bloqueo reportado: tras ganar 1/1–1/9, la entrada a 1/10 falló al escribir `bi-sub.textContent`, porque ese ID no existía en el HTML. No era un requisito de tres estrellas. La corrección fue verificada continuando desde una partida de prueba nueva hasta el final.

El recorrido se repitió con la integración de guardianes, arte cinematográfico y celebraciones de desbloqueo. Los 80 resultados, los reintentos y las jugadas coincidieron con la versión anterior. El SHA al final identifica esa fuente completa; esta simulación no evalúa la carga ni la apariencia de las imágenes o las animaciones.

## Método y alcance

- Se ejecutó el JavaScript completo de `index.html` en Node con un DOM de Linkedom, una semilla reproducible y `localStorage` únicamente en memoria. No se leyó ni modificó la partida de Jose.
- Cada nivel se abrió mediante `continueCampaign()`; cada jefe pasó por su introducción y su botón de inicio. Cada victoria y derrota se resolvió mediante el `doSwap()` y `finishLevel()` reales. Se comprobó el gasto de vidas y el guardado de estrellas.
- El bot escogió intercambios legales por objetivo inmediato y valor de poderes. Usó el Pulso manual cuando estaba cargado. No usó potenciadores, anuncios, continuaciones, construcciones ni héroes adicionales. No se alteraron metas, puntuación, resultados ni tableros para conseguir victorias.
- Se retiraron esperas, animaciones y dibujo durante la simulación. El reloj virtual avanzó únicamente para permitir la regeneración natural de vidas: 92 intervalos de 25 minutos. Los tableros, rellenos aleatorios, cascadas, chocolate, poderes, objetivos y economía conservaron sus funciones reales.
- El límite fue de 10 intentos por nivel; ninguno necesitó más de cuatro. Esta prueba demuestra acceso, resolución y progresión del motor. No equivale a una partida manual en navegador/iPhone ni mide diversión o dificultad humana.

Los 80 niveles se ganaron sin cambiar sus definiciones de objetivos. 67/80 se ganaron en el primer intento de esta muestra; no es una estimación de balance. Hubo 6 cristales, 66 rayados y 24 envueltos creados por jugadas; 100 cristales activados y 71 pulsos usados.

## Resultado de cada nivel

Las metas muestran el intento ganador; los intentos incluyen las derrotas previas. `Jugadas` = usadas/disponibles. `Poderes` = cristales/rayados/envueltos creados en ese intento. Los detalles de todas las derrotas, semillas y contadores están en [el registro JSON](campaign-playthrough-2026-10-17.json).

| Nivel | Nombre | Meta conseguida | Intentos | Jugadas | Poderes |
|---|---|---|---:|---:|---:|
| 1/1 | La Pradera Dulce | Puntos 600/500 | 1 | 2/11 | 0/0/0 |
| 1/2 | El Sendero de Caramelo | Puntos 1920/650 | 1 | 1/12 | 0/0/0 |
| 1/3 | El Bosque de Caramelo | Puntos 2320/800 | 1 | 1/12 | 0/0/0 |
| 1/4 | El Río de Miel | Recolectar 13/12 | 1 | 7/18 | 0/1/1 |
| 1/5 | La Aldea Carmesí | Puntos 2170/1100 | 1 | 2/10 | 0/1/0 |
| 1/6 | El Puente Quebrado | Puntos 2520/1300 | 1 | 1/8 | 0/0/0 |
| 1/7 | La Torre Vigía | Cristales 3/2 | 1 | 1/15 | 0/0/0 |
| 1/8 | El Cañón de Azúcar | Puntos 2220/1700 | 1 | 1/8 | 0/0/0 |
| 1/9 | Las Puertas Carmesí | Puntos 2150/1900 | 1 | 4/8 | 0/1/0 |
| 1/10 | El Último Carmesí | Puntos 2250/2200 | 2 | 4/8 | 0/0/1 |
| 2/1 | El Portal de los Cerezos | Puntos 2830/900 | 1 | 1/8 | 0/0/0 |
| 2/2 | La Arena de Azúcar | Puntos 1950/1150 | 1 | 1/8 | 0/0/1 |
| 2/3 | Los Pabellones de Mochi | Puntos 2440/1400 | 1 | 1/8 | 0/0/0 |
| 2/4 | El Estanque de Almíbar | Recolectar 17/13 | 1 | 2/16 | 0/0/0 |
| 2/5 | La Galería de Wagashi | Puntos 1900/1900 | 1 | 6/8 | 0/1/0 |
| 2/6 | El Jardín del Silencio | Puntos 3570/2150 | 1 | 1/8 | 0/0/0 |
| 2/7 | Los Faroles Apagados | Cristales 1/1 | 1 | 2/8 | 1/0/0 |
| 2/8 | La Pagoda de Cristal | Puntos 4020/2650 | 1 | 1/9 | 0/0/0 |
| 2/9 | Las Raíces Eternas | Puntos 4350/2900 | 1 | 1/8 | 0/0/0 |
| 2/10 | La Flor de Mochi Eterno | Puntos 3300/3200 | 1 | 4/8 | 0/0/1 |
| 3/1 | La Base de las Torres | Puntos 2640/1500 | 1 | 3/8 | 0/2/0 |
| 3/2 | El Primer Tramo | Puntos 3320/1800 | 1 | 5/8 | 0/0/1 |
| 3/3 | La Plaza Caramelizada | Puntos 2200/2100 | 1 | 2/8 | 0/1/0 |
| 3/4 | El Arco de Fruta | Recolectar 17/13 | 1 | 12/14 | 0/5/1 |
| 3/5 | Las Agujas del Mediodía | Puntos 3500/2700 | 1 | 8/8 | 0/1/0 |
| 3/6 | La Grieta Ascendente | Puntos 3900/3000 | 1 | 1/8 | 0/0/0 |
| 3/7 | El Andamio Roto | Cristales 3/2 | 1 | 2/16 | 0/0/0 |
| 3/8 | La Plataforma Flotante | Puntos 4270/3600 | 1 | 2/8 | 1/0/0 |
| 3/9 | El Vértice del Cielo | Puntos 4550/3900 | 1 | 9/10 | 0/1/0 |
| 3/10 | La Aguja del Cielo | Puntos 5700/4300 | 2 | 2/9 | 0/0/0 |
| 4/1 | El Valle Helado | Puntos 7300/2200 | 1 | 1/8 | 0/0/0 |
| 4/2 | Las Cuevas de Avellana | Puntos 3600/2550 | 1 | 3/8 | 0/1/1 |
| 4/3 | El Glaciar de Ganache | Puntos 3750/2900 | 1 | 2/8 | 0/0/1 |
| 4/4 | La Catarata Congelada | Recolectar 13/11 | 1 | 11/13 | 0/0/0 |
| 4/5 | El Corazón de la Montaña | Puntos 5570/3600 | 1 | 2/8 | 0/0/0 |
| 4/6 | Los Senderos de Cacao | Puntos 4000/3950 | 1 | 8/9 | 0/0/0 |
| 4/7 | La Veta Blanca | Cristales 2/2 | 1 | 1/12 | 0/0/0 |
| 4/8 | La Cumbre sin Nombre | Puntos 8520/4650 | 2 | 2/8 | 0/0/0 |
| 4/9 | El Umbral de la Hibernación | Puntos 9450/5000 | 1 | 2/9 | 0/0/0 |
| 4/10 | El Corazón de Cacao | Puntos 7440/5400 | 1 | 2/9 | 0/0/0 |
| 5/1 | El Claro de Gominola | Puntos 3350/2900 | 2 | 5/8 | 0/1/0 |
| 5/2 | Las Raíces de Regaliz | Puntos 3450/3300 | 2 | 2/8 | 0/0/1 |
| 5/3 | El Sendero de los Osos | Puntos 4080/3700 | 1 | 3/8 | 0/0/1 |
| 5/4 | Los Hongos de Colores | Recolectar 18/15 | 1 | 3/15 | 0/0/0 |
| 5/5 | El Árbol del Centro | Puntos 7470/4500 | 1 | 2/8 | 0/0/0 |
| 5/6 | La Guarida Translúcida | Puntos 5550/4900 | 1 | 3/10 | 0/0/1 |
| 5/7 | Los Pasillos de Gelatina | Cristales 2/2 | 1 | 1/11 | 0/0/0 |
| 5/8 | La Caverna de las Voces | Puntos 6100/5700 | 1 | 3/10 | 1/0/0 |
| 5/9 | El Laberinto de Regaliz | Puntos 8350/6100 | 1 | 5/10 | 0/0/0 |
| 5/10 | El Árbol de Gominola Ancestral | Puntos 6800/6600 | 3 | 7/8 | 0/1/1 |
| 6/1 | La Pradera de Nubes | Puntos 4620/3600 | 1 | 2/8 | 0/0/0 |
| 6/2 | El Campamento Apagado | Puntos 4620/4050 | 1 | 5/8 | 0/3/0 |
| 6/3 | Las Brasas del Pasado | Puntos 16180/4500 | 3 | 4/8 | 1/1/1 |
| 6/4 | El Sendero de Maple | Recolectar 15/14 | 1 | 8/14 | 0/2/0 |
| 6/5 | La Fogata Central | Puntos 7950/5400 | 1 | 4/8 | 0/0/0 |
| 6/6 | Los S'mores de Piedra | Puntos 8370/5850 | 1 | 2/8 | 0/0/0 |
| 6/7 | El Cielo Estrellado | Cristales 2/2 | 1 | 1/10 | 0/0/0 |
| 6/8 | La Tienda de Nubes | Puntos 7460/7200 | 1 | 11/11 | 0/1/0 |
| 6/9 | El Último Calor | Puntos 7850/7800 | 1 | 4/11 | 0/0/0 |
| 6/10 | La Última Fogata | Puntos 9600/8500 | 2 | 8/12 | 0/3/1 |
| 7/1 | Los Altares de Azúcar | Puntos 5800/4400 | 1 | 2/9 | 1/0/0 |
| 7/2 | Las Flores de Cempasúchil | Puntos 10410/4900 | 2 | 5/9 | 0/2/0 |
| 7/3 | El Camino de los Ancestros | Puntos 5450/5400 | 1 | 5/10 | 1/1/0 |
| 7/4 | Las Calaveras de Piedra | Recolectar 16/16 | 1 | 6/15 | 0/2/0 |
| 7/5 | El Patio de los Recuerdos | Puntos 6920/6400 | 1 | 2/9 | 0/0/0 |
| 7/6 | Las Velas sin Dueño | Puntos 10950/6900 | 2 | 9/11 | 0/1/0 |
| 7/7 | El Memorial del Valle | Cristales 3/3 | 1 | 1/15 | 0/0/0 |
| 7/8 | La Ofrenda Eterna | Puntos 12760/8800 | 1 | 9/11 | 0/1/0 |
| 7/9 | El Umbral del Dulce | Puntos 10300/9500 | 1 | 6/12 | 0/1/0 |
| 7/10 | La Calavera de Azúcar Sagrada | Puntos 10370/10200 | 4 | 4/9 | 0/0/0 |
| 8/1 | Las Ruinas de Cristal | Puntos 5000/5000 | 1 | 6/8 | 0/1/0 |
| 8/2 | La Plaza del Instante | Puntos 13710/5600 | 1 | 4/10 | 0/1/0 |
| 8/3 | Los Fractales Detenidos | Puntos 8400/6200 | 2 | 2/10 | 0/0/0 |
| 8/4 | El Espejo Opaco | Recolectar 16/14 | 2 | 5/15 | 0/0/0 |
| 8/5 | La Geometría Perfecta | Puntos 9080/8000 | 1 | 9/9 | 0/2/1 |
| 8/6 | El Prisma Sin Luz | Puntos 12690/9000 | 1 | 3/13 | 0/0/0 |
| 8/7 | La Resonancia del Cristal | Cristales 9/4 | 1 | 1/13 | 0/0/0 |
| 8/8 | Los Fragmentos Suspendidos | Puntos 12140/10500 | 1 | 11/15 | 0/2/1 |
| 8/9 | El Umbral Final | Puntos 16830/11500 | 1 | 6/13 | 0/1/0 |
| 8/10 | El Cristal que se Rompió a sí Mismo | Puntos 11160/10000 | 1 | 11/11 | 0/2/1 |

## Reproducción

```sh
node scripts/campaign-playthrough.cjs --dom-module /ruta/a/linkedom --seed 7331 --max-attempts 10
```

Linkedom ya estaba disponible en el entorno de QA; no se instaló ninguna dependencia nueva ni se añadió al juego. En esta sesión se usó `/tmp/sugarclash-qa.aJGXZf/node_modules/linkedom`. También puede indicarse con `SUGARCLASH_DOM_MODULE`; si el módulo se resuelve normalmente, se omite `--dom-module`.

El script devuelve JSON por salida estándar y termina con código distinto de cero si una entrada falla, una partida no alcanza su resultado, se modifica el estado al evaluar una jugada o un nivel no se gana dentro del límite.

- Semilla base: `7331`.
- SHA-256 del HTML probado: `9861423b016987701b9480a1b22442eb75b4b5d9117bd0f9eb08f8b0db9dec56`.
- SHA-256 del HTML anterior al arreglo del jefe: `1b31e6d409c8b76b9f6bd61fcd5aa552da0663eafe20c3d135e169a69a47d92f`.
