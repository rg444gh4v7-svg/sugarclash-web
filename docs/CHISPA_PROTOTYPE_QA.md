# CHISPA · primer prototipo jugable

**Estado:** P01–P04 implementados y comprobados técnicamente. P05, pruebas con participantes, pendiente. Ejecución: 3 de noviembre de 2026, America/Chicago; los informes JSON registran la hora UTC.

## Qué existe

`prototypes/chispa/index.html` contiene el runtime completo: HTML/CSS/JS vanilla, motor puro de recorridos, doce escenas, apuntado/preview, disparo por arrastre o teclado, deshacer, reiniciar, selección con desbloqueo lineal, pausa, ayuda, sonido y movimiento reducido. Fuentes OFL y Confite del proyecto incrustados; licencias en `prototypes/chispa/licenses/`. No hay dependencias de runtime, worker, peticiones externas, anuncios ni pagos.

Una lámpara deja pasar; un actuador inactivo absorbe y cambia un espejo o compuerta al resolver. Activado deja pasar. Geometría congelada durante el tiro, radio positivo0,75, campo100×100, máximo6reflexiones más segmento final y300unidades de recorrido. Preview y lanzamiento comparten cálculo. El cierre real valida todas las lámparas; las referencias de tiros no son límites.

El arte es provisional de SVG, con materiales legibles y paisaje oscuro que recupera color según lámparas reales. No es la producción artística de P06 ni una marca definitiva. No se han producido ocho mundos ni migrado sistemas de Renacer.

## Comprobaciones y resultados

| Comprobación | Resultado y alcance |
|---|---|
| Sintaxis del script inline | `CHISPA SYNTAX OK`. |
| Suite del repositorio | **154/154**:125regresiones de Renacer y29pruebas nuevas de CHISPA. |
| Recorrido del motor | **12/12**,29tiros, con el `Session` y `traceShot` reales, sin DOM ni almacenamiento. |
| Recorrido de navegador | **12/12** mediante teclado y gestos reales, a1280×800; también se recorrieron las doce a320×640. Sin invocar motor/victoria desde el navegador ni escribir progreso artificial. |
| Preview | Mismo cálculo que el lanzamiento; se observó el cambio del molino antes/después del primer tiro. |
| Sesión | Deshacer del molino devuelve lámpara, contador y espejo; reinicio y cancelación probados, incluida una escena ya completada. |
| Pausa | Disparo interrumpido antes de resolver por Inicio o ayuda; después de continuar, una única aplicación y un único tiro contado. |
| Teclado | Flecha derecha, Mayúsculas+flecha para ajuste fino, Enter para lanzar. Dirección y slider sincronizados a0,1°. |
| Navegación | Siguiente recorre las doce; Escenas muestra estados reales, permite repetir y no completa por inspeccionar. |
| Consola | Sin errores o advertencias observados durante el recorrido. |
| Renacer | Sin cambios en su HTML, manifest, worker o guardados. No se ha desplegado nada. |

El primer fallo de tolerancia del test asumía±2° simétricos sobre un ángulo de referencia. El criterio del diseño exige un intervalo conectado de4°, no simetría respecto de ese ángulo. Se corrigió la comprobación para medir ese intervalo y se registran ambos lados; no se cambió la física para hacer pasar el test. Un fixture que pretendía quedar fuera del campo estaba exactamente en su borde: se corrigió el dato del fixture.

### Márgenes de puntería

Ancho mínimo encontrado alrededor de cada tiro de referencia, por escena, con barrido de0,1° y hasta15° por lado. La prueba registra el mismo conjunto de lámparas/actuador terminal, avanzando el estado real entre tiros. Es una comprobación discreta de margen, no exhaustividad u optimalidad.

| Escena | Ancho mínimo observado |
|---|---:|
|01|9,6°|
|02|5,6°|
|03|5,6°|
|04|4,9°|
|05|6,8°|
|06|5,6°|
|07|5,6°|
|08|5,0°|
|09|6,2°|
|10|5,1°|
|11|4,8°|
|12|4,8°|

Un explorador finito también encontró una solución legítima de tres tiros para la escena12 (`-79,5°`, `-13°`, `-6,5°`), frente a la referencia de cuatro. Se acepta y tiene regresión. No se declara un mínimo probado ni se invalida un atajo legítimo.

## Navegador y evidencia visual

Origen de QA: `http://127.0.0.1:4227/`, sirviendo sólo la carpeta del prototipo. No se usaron4177 ni producción. Emulación de viewport en el navegador del escritorio; **no son pruebas en un teléfono físico**.

Se corrigió el tamaño del campo para que títulos de dos líneas no empujen los controles fuera de la vista. Comprobación final sobre la escena12:

| Viewport | Documento | Borde inferior del pie |
|---|---|---:|
|320×640|320×640|619,09px|
|390×844|390×844|810,50px|
|1280×800|1280×800|777px|

Sin desbordamiento horizontal ni vertical en esos casos. El campo conserva proporción, los controles44px y los estados de color no alteran la geometría.

- [Molino con la ruta nueva a390](qa/chispa-mill-390.png).
- [Doce escenas completadas a320](qa/chispa-complete-320.png).
- [Doce escenas completadas a390](qa/chispa-complete-390.png).
- [Escritorio](qa/chispa-desktop.png).
- [Evidencia del recorrido por controles](qa/chispa-ui-playthrough.json), con hash del HTML comprobado.
- [Recorridos, eventos y márgenes del motor](CHISPA_PLAYTHROUGH.json), con hash del HTML comprobado.

## Datos y límites

El progreso y las mejores marcas son **de la sesión en memoria** y se reinician al recargar. Sólo las preferencias usan `chispa_prototype_preferences_v1`, con valores por defecto y lectura normalizada. No se escribe `chispa_save_v1` todavía y no se consultan las dos claves históricas. El guardado de progreso/reanudación/importación pertenece a P07.

Las pruebas se ejecutan contra el código inline mediante `scripts/chispa-runtime.cjs`; no hay un segundo motor de pruebas. Los tokens de sesión impiden resolver dos veces o aplicar un callback tras reiniciar/cerrar. Al salir u ocultar se detienen frames y voces; no hay RAF decorativo. El navegador confirma pausa por Inicio y diálogo; la visibilidad tiene sus guardas, sin afirmar aquí una prueba física de bloqueo del teléfono.

Pendiente: participantes P05, teléfono físico Android/iOS, evaluación completa de accesibilidad/lectores de pantalla, texto ampliado y deficiencias cromáticas. No se ha medido diversión, retención, disposición a pagar, ingresos o aceptación de portal. P06–P09 siguen sujetos a las puertas del plan.

## Repetir la comprobación

Desde la raíz del proyecto:

```sh
node --test tests/*.test.cjs
node scripts/chispa-playthrough.cjs
python3 -m http.server 4227 --bind 127.0.0.1 --directory prototypes/chispa
```

Comprobar antes que el puerto esté libre. Abrir `http://127.0.0.1:4227/`. No requiere instalación o build. El servidor de QA de esta entrega se cierra al terminar; una pestaña que ya cargó puede seguir jugando porque el runtime es autónomo, pero para recargar por HTTP hace falta volver a iniciar el servidor. Este prototipo no promete recarga offline mediante PWA.

**Próximo trabajo:** observar P05 con el protocolo de [CHISPA_VALIDATION_BUSINESS.md](CHISPA_VALIDATION_BUSINESS.md), registrar problemas reales y decidir si pasar al acabado. No reconstruir P01–P04 ni producir una campaña mayor por una instrucción documental antigua.
