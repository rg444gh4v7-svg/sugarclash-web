# El mundo responde · cierre de la iteración

Jose pidió «Todavía le falta gracia», después «Sigue» y «Termina». La respuesta se concentra en la personalidad durante la partida, conservando el concepto, el contraste oscuro/color y el logo sobrio.

## Implementado

- Cuatro dioramas originales de jardín, camino, cauce y hogar sustituyen la cabecera de campaña. Cambian geometría cuando la restauración real pasa de cero a alguna zona, a dos tercios y a completa. Confite y el guardián comparten ese lugar.
- Diez aperturas para T1 y 39 reacciones posibles. Confite comenta hechos observados: zona recuperada, poder creado, poderes encadenados, cascada, Pulso disponible o últimos movimientos. Una combinación corriente conserva el silencio. Como máximo tres apartes por tramo activo, separados por dos jugadas válidas; la conclusión del lugar tiene una excepción. Pistas explícitas y automáticas pueden sustituir el aparte.
- Rayos direccionales, expansión de bomba y un hilo hacia la escena distinguen poderes y restauración. El sonido de restauración tiene su propio motivo sintetizado. No hay animación ambiental continua.
- La última jugada mantiene un resumen con su luz y zonas recuperadas o cascadas. El cierre de victoria/derrota actualiza el resumen sin añadir otra frase. Crear un poder y activarlo son hechos distintos; quitar una capa no se celebra como zona recuperada.
- El martillo reinicia el contador transitorio de brotes para no conservar el texto de la jugada anterior. Reglas, metas, premios, vidas y guardados permanecen vigentes.

El arte y catálogo de integración están en `docs/art/PLAY_*`; el runtime los contiene inline en `index.html`. No se descargan esos archivos al jugar. El worker usa `sugarclash-renacer-v6`, con el mismo catálogo de recursos locales.

## Validación realizada

- `SYNTAX OK` y **110/110 pruebas**: 97 anteriores y 13 regresiones de respuesta, resumen, silencio, movimiento reducido, límites, estado obsoleto y limpieza. `git diff --check` correcto.
- Navegador con origen aislado `http://127.0.0.1:4204/`, separado de producción y del puerto 4177. Niveles 1 y 2 ganados mediante controles y jugadas válidas, sin escribir estrellas ni forzar victoria. En el nivel 3, creación de bomba y activación con el martillo de QA: una zona restaurada realmente, escena fase 1 y resumen de +1108 de luz / 1 zona tras sus cascadas.
- Emulación **320×640**: tablero, herramientas e introducción completos; final del texto en 628.69 px y sin scroll horizontal. **390×844**: escena, objetivos, tablero y reacción legibles. No es una prueba de teléfono físico.
- **1280×720**: controles hasta 671.40 px, introducción hasta 716.79 px, sin scroll horizontal. Ajustado el ancho del tablero y el margen superior para ventanas de poca altura.
- Consola sin errores ni advertencias antes de la prueba offline. Después de detener el servidor propio, la recarga abrió la portada y permitió entrar al nivel 3 con 49 piezas y el diorama nuevo desde la caché.

No se ha repetido el recorrido 80/80 para esta capa de presentación. El informe de restauración anterior conserva su versión y alcance; esta iteración no cambia reglas ni balance. Las pruebas automáticas y estas partidas de QA no establecen diversión o retención con jugadores.

## Evidencia

- [Entrada a 320×640](qa/play-charm-start-320.png).
- [Restauración real y Confite a 390×844](qa/play-charm-board-390.png).
- [Escritorio](qa/play-charm-desktop.png).
- [Recarga con servidor apagado](qa/play-charm-offline.png).

La publicación de esta versión se registra separadamente en `DEPLOYMENT_PLAY_CHARM.md` y su informe JSON una vez comprobado el despliegue.
