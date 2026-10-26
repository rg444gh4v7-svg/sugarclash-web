# Navegación e interfaz · cierre

Jose pidió mejorar la parte visual porque la navegación no se entendía. Esta iteración cambia la estructura y los recorridos, conservando el concepto y el logo sobrio.

## Resultado integrado

- Cuatro destinos fijos: **Inicio, Campaña, Modos y Aldea**. Barra inferior en móvil y menú lateral con texto en escritorio. El destino activo se distingue visualmente y con `aria-current`.
- Inicio muestra el siguiente nivel y una sola acción dominante. La escena ya no contiene diez botones de ruta ni un segundo logo. Guerra/Royale conservan acceso directo y el reto diario ocupa un lugar secundario. Los recursos llevan nombre.
- Campaña concentra los capítulos y niveles: selector con nombres completos, requisito de cada bloqueo y lista numerada. Se puede ver el primer nivel al entrar. Historia y recuerdos es una entrada secundaria explícita.
- Modos separa combinar caramelos de moverse y combatir. Nombres comprensibles: Reto diario, Sin prisa, Contrarreloj, Guerra 5v5 y Royale. El nombre del modo sigue presente dentro de la partida.
- Aldea muestra la siguiente construcción disponible, su precio, beneficio y requisito. Una lista de edificios sustituye los pequeños nodos dispersos; inspeccionar conserva la acción de construir separada.
- Ajustes tiene un regreso al origen. Las partidas recuerdan su origen de forma transitoria mediante `returnTo`; los reintentos lo conservan. No se añade ese dato al guardado.
- Navegar desde un combate ya no destruye la sesión inmediatamente: pausa y solicita confirmación. Cancelar conserva su estado de pausa anterior. Al salir de Sin prisa se guarda la marca y se respeta el destino solicitado.
- La vista nueva recibe foco después de renderizar y se anuncia. Los modales contienen el foco inicial y el externo, dejan la aplicación de fondo inerte y rechazan callbacks de sesiones antiguas. Destinos desconocidos, incluidas propiedades heredadas, no pueden dejar la pantalla vacía.

Runtime inline en `index.html`. `docs/art/NAV_*` conserva fuentes de integración y decisiones. El worker pasa a `sugarclash-renacer-v7`, con los mismos 40 recursos locales. No se cambian reglas del tablero, costes, premios ni condiciones de acceso.

## Comprobaciones

- **SYNTAX OK, 125/125 pruebas y `git diff --check`**. Quince pruebas nuevas de navegación cargan las funciones reales, sustituyendo sólo la pintura de tablero/canvas. Incluyen origen y reintento de modos, validación de destinos, cancelación/confirmación, Zen, vida reservada, callbacks antiguos, foco, selector y modales.
- Recorrido automático con avance real **80/80 niveles**, 92 intentos, 12 derrotas, cero jugadas inválidas y sin escribir el guardado antiguo. El informe actualizado permanece en `RENACER_PLAYTHROUGH.md/.json`. No mide diversión ni comprensión humana.
- QA de navegador en origen aislado `http://127.0.0.1:4205/`, sin alterar los datos de producción ni el puerto 4177.
- **320×640:** botón de jugar completo hasta 362.75 px; accesos rápidos hasta 525.75 px, antes de la navegación en 568 px. En Campaña, primer nivel entre 425.91 y 502.91 px. Durante una jugada real del nivel 1, herramientas hasta 593 px y texto hasta 622 px. Sin scroll horizontal.
- **390×844:** Inicio, Modos, Aldea, selector de capítulo, Ajustes, Recuerdos y pausas revisados. El selector por teclado mantuvo el foco y mostró el capítulo 2 bloqueado sin conceder acceso. La cancelación de salida del nivel mantuvo 4 vidas; confirmar volvió a Inicio. Sin prisa volvió a Modos guardando su marca. En Guerra, cancelar conservó el combate y confirmar volvió a Modos. Ajustes volvió a Modos.
- **1280×800:** menú lateral, recursos, escena y acción principal revisados. Botón de jugar completo hasta 600.20 px y sin scroll horizontal.
- Consola sin errores ni advertencias antes de la prueba offline. Después de detener el servidor propio, la recarga conservó los cuatro destinos y permitió abrir los cinco modos desde la caché.

Se probó emulación de tamaños, no un teléfono físico. El test automatizado de navegación y estos recorridos de QA no equivalen a una prueba con jugadores.

## Evidencia

- [Inicio 320](qa/nav-home-320.png) · [Inicio 390](qa/nav-home-390.png) · [Escritorio](qa/nav-home-desktop.png).
- [Campaña 320](qa/nav-campaign-320.png) · [Modos 390](qa/nav-modes-390.png) · [Aldea 390](qa/nav-village-390.png).
- [Partida 320](qa/nav-game-320.png) · [Modos con el servidor apagado](qa/nav-offline-320.png).

Publicación verificada: d759a05, READY/production, raíz y ocho archivos críticos idénticos, 40 recursos disponibles. [Informe de publicación](DEPLOYMENT_NAVIGATION.md) y su JSON.
