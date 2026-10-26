# Navegación y portada: una acción comprensible

La portada actual mezcla diez accesos de ruta, guardián siguiente, Atlas, modos directos, historia y aldea. Además, «Jugar» abre el hub de modos, mientras «Territorios» y «Atlas» llevan a campaña. A320px aparecen etiquetas de6–9px y cinco pestañas con nombres distintos para acciones relacionadas. El problema requiere cambiar la jerarquía y los nombres.

## Estructura implementable

Usar `NAV_HOME.js` como reemplazo de `renderHome()` y anexar `NAV_REDESIGN.css` al final de los estilos. No incluir el mapa de diez puntos en Inicio. Las rutas y el selector de capítulos viven en Campaña. El arte v3 y su máscara de color permanecen; sólo las victorias reales gobiernan la escena.

```html
<nav class="rail" id="navigation" aria-label="Navegación principal">
  <button class="nav-item active" aria-current="page" onclick="navigate('home')">
    <!-- icon('home') --><span>Inicio</span>
  </button>
  <button class="nav-item" onclick="navigate('world')">
    <!-- icon('world') --><span>Campaña</span>
  </button>
  <button class="nav-item" onclick="navigate('modes')">
    <!-- icon('modes') --><span>Otros modos</span>
  </button>
  <button class="nav-item" onclick="navigate('village')">
    <!-- icon('village') --><span>Aldea</span>
  </button>
  <div class="nav-help"><strong>Dulcelandia recupera su color</strong>Combina, restaura y sigue el camino.</div>
</nav>
```

Actualizar `renderNav()` a esos cuatro destinos y mantener el destino activo con `aria-current="page"`. Al abrir Recuerdos, Campaña sigue siendo el contexto de navegación; en Ajustes no es necesario fingir una pestaña activa. El menú no debe cambiar el orden de sus destinos entre pantallas. En móvil hay cuatro columnas iguales, iconos de24px y texto de11px; en escritorio, barra lateral de190px con icono y nombre horizontal.

El header conserva marca y recursos; Ajustes queda como engranaje visible con etiqueta accesible. El logo aprobado se usa una sola vez en la cabecera, con `object-fit:contain`; el integrador decide su encaje móvil manteniendo el emblemaS. No añadir menú de tres puntos. Evitar valores de recursos sin etiqueta accesible. Una etiqueta opcional de recursos puede ser visible en escritorio sin reducir más su tamaño móvil.

En Campaña, junto al título, añadir un botón literal **Historia y recuerdos** → `navigate('memories')`. La historia inicial puede seguir disponible desde Recuerdos. La pantalla conserva su encabezado y permite volver a Campaña. Ajustes debe tener regreso al origen. No esconder estas entradas dentro de otro panel.

## Inicio

1. «El color empieza aquí» o «Continúa tu viaje», con una frase de propósito.
2. Escena v3 sin botones sobre la imagen. Capítulo arriba; próxima partida, nombre y regla breve en la zona inferior con un degradado localizado para lectura.
3. **Jugar nivelN** ancho se pega inmediatamente debajo de la escena. El próximo nivel ya se explica dentro del encuadre, de modo que la ilustración no empuja la acción después de otro bloque. Se conserva `continueCampaign()` → `requestLevel()`.
4. Progreso del capítulo y **Ver niveles** → Campaña.
5. **Partidas rápidas · Sin vidas**, con Guerra5v5 y Royale como dos enlaces directos, más **Ver modos**. Siguen alcanzables al entrar; el rótulo explica que pertenecen a otro tipo de partida. Diario y Confite bajan a un bloque secundario; no compiten con el siguiente nivel.

La regla de portada describe sólo la condición de restauración; la partida conserva sus dos metas. No promete victorias, recompensas ni acceso distinto. Se conservan todas las puertas de vidas, jefe y diario. Una campaña completa dice «Volver a jugar nivel80» y conserva el flujo existente.

## Tamaños y comprobaciones

La imagen mide180px a320 y220px a390. Con cabecera de64px y los márgenes propuestos, el CTA termina aproximadamente a350px y400px respectivamente; confirmar las medidas finales en navegador. El CTA mide52–54px, ancho completo, texto16–17px y contraste carbón/coral. El encabezado principal mide25–28px; instrucciones de partida14px. Las áreas principales se ordenan en el DOM igual que en pantalla. Ningún texto esencial depende del hover.

Verificar a320×640 y390×844 con primer nivel, nombre largo, jefe y campaña completa. **Jugar nivelN debe quedar entero antes de la navegación fija**, sin pedir scroll. Probar recursos grandes y que la etiqueta «Otros modos» no se parta. Revisar foco de teclado, nombre de pantalla, estado activo y retorno desde ajustes/recuerdos. El tablero y las arenas conservan sus medidas; el CSS sólo oculta la navegación al entrar en partida como ya hacía el runtime.

Este recurso es una propuesta concreta lista para integrar; no es evidencia de QA de navegador ni una modificación de `index.html`.
