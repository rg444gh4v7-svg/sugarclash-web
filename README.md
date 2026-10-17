# Sugar Clash: Dulcelandia

Juego web de restauración, memoria y estrategia match-3. Dulce Roja acompaña a
Confite por ocho territorios; cada capítulo devuelve color y revela parte de la
Fragmentación. Los tres Ecos del Cristal son recuerdos jugables, no modos aislados.

Producción: https://sugarclash-web.vercel.app/

## Desarrollo y pruebas

Todo el motor, interfaz y narrativa viven intencionalmente en `index.html`, sin
frameworks ni compilación. `title-world-v3-hd.jpg` ambienta las pantallas y los
emblemas son SVG. Audio sintetizado. Guardado local: `sugarclash_save_v1`.

```sh
python3 -m http.server 4177 --bind 127.0.0.1
node --test tests/*.test.cjs
```

Abrir `http://127.0.0.1:4177/`. Las pruebas cubren especiales persistentes, cadenas,
gravedad, barajado, campaña, sintaxis y comportamiento de la caché online/offline.
El worker v13 prioriza HTML nuevo al abrir con conexión y conserva fallback offline.
No borrar los datos del navegador: eso elimina el progreso.

## Iteración actual

- Edición **Atlas cinematográfico · 16.10**, identificable en la portada.
- Dirección Figma aplicada al juego: cabecera compacta, recursos reales, territorio
  protagonista, nivel activo dentro del paisaje, Confite y navegación clara.
- Mochi incorpora el SVG exacto del diseño: pabellón, puente, cerezos, roca y
  cascada; reutilizado en campaña, atlas, banner y tablero, con IDs únicos.
- El atlas completo conserva sus ocho territorios y bloqueos en un desplegable.
  Pétalos y agua se pausan fuera de vista y respetan movimiento reducido.
- Aldea con terrazas, árboles y diez edificios redibujados con perspectiva y luz cálida.
- Inspección antes de construir: beneficios, coste y confirmación explícita; scroll
  conservado, acceso directo desde la misión y regreso a campaña para reunir miel.
- Confite acompaña la aldea; humo, agua y ventanas solo se animan donde es visible.
- Paisajes con varios planos, relieve, cascadas y niebla ligada a la restauración.
- Panoramas de territorio y 24 frases ambientales que acompañan tres estados del mundo.
- Confite más expresivo: manos, orejas, reflejos, parpadeo y respiración; también
  acompaña el resultado de la partida. Sin nuevas dependencias ni raster.
- Ocho paisajes vectoriales propios con islas, nubes y vegetación de cada región.
- Caminos curvos, siguiente nivel señalado y progreso visible en el mundo.
- Fichas y poderes se mueven juntos, con aterrizaje, reflejos, fragmentos y estelas.
- Efectos limitados para móvil, pausados fuera de pantalla y con movimiento reducido.
- Desliza para intercambiar; el tablero se ajusta a la altura de pantalla.
- Cinco piezas crean un cristal; combina poderes entre sí o cristal con color.
- Pulso manual de Confite: carga en tres jugadas y elige dos turnos de puntos dobles.
- La escena del territorio recupera color durante cada partida.
- Una pulsación desde portada hasta la siguiente partida; prólogo opcional.
- Misión narrativa visible, campamento plegable y mapas sin scrolls anidados.
- Poderes que sobreviven a su creación y activan otros poderes en cadena.
- Intercambios y caídas animados, con respeto a movimiento reducido.
- Recuerdos y consecuencias visibles en el resultado de cada nivel.

## Qué falta para una prueba comercial real

En la revisión del 16.10 pasaron 45 pruebas del motor/caché/gráficos/aldea/campaña y comprobaciones
con DOM: campaña, deslizamiento, pulso, intercambio inválido, ajuste de tamaño,
guardado, estados de restauración, pausa por visibilidad, resultados, selección sin
gasto, compra explícita, requisitos, scroll de aldea y guardados con huecos. También se
renderizaron las ocho ilustraciones, los diez edificios y las 25 variantes de Confite.
Se comprobó en navegador la pantalla de mundo a 390px, la entrada real a partida,
el cobro de vida, regreso al mapa y acceso a los ocho territorios sin desbordamiento
horizontal. Queda verificar composición y animaciones en un iPhone real.
Un bot codicioso recorrió los 80 niveles y ganó 73
en una sola partida por nivel; es una comprobación preliminar, no una medición
estadística del equilibrio ni de retención. Queda revisión visual en teléfono.

Esto todavía no demuestra retención ni ingresos. Liga, MOBA y Battle Royale no
son multijugador real; los rivales son simulados. Los anuncios son demostraciones
y no generan ingresos. No hay cobros reales ni analítica remota conectada.

La siguiente inversión debe ser una prueba con jugadores nuevos, no más sistemas:

1. Observar si entienden la primera jugada y el objetivo sin ayuda.
2. Medir tiempo hasta jugar, abandonos, intentos por nivel y sesiones repetidas.
3. Comprobar si guardan poderes con intención y recuerdan qué busca Confite.
4. Registrar dónde abandonan; corregir ese punto y repetir con la misma prueba.
5. Revalidar los 80 niveles tras el cambio de especiales; los antiguos resultados
   del bot ya no validan este balance.

Después, seleccionar un portal y conectar su SDK de anuncios recompensados,
siempre voluntarios. No añadir intersticiales forzados. Ver `AGENTS.md` para las
reglas de arquitectura, economía y continuidad narrativa.

## Publicación

El proyecto está vinculado a Vercel en `.vercel/` (configuración local, no se sube).
Guardar commit, hacer push y ejecutar
`vercel deploy --prod --yes --scope pulsarproyects --project sugarclash-web`
con la cuenta autorizada. Seleccionar equipo/proyecto explícitamente evitó un
rechazo de autorización en la publicación del 15.10.
El push de Git por sí solo no garantiza el despliegue: verificar la URL pública.
