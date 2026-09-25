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
El worker v8 prioriza HTML nuevo al abrir con conexión y conserva fallback offline.
No borrar los datos del navegador: eso elimina el progreso.

## Iteración actual

- Una pulsación desde portada hasta la siguiente partida; prólogo opcional.
- Misión narrativa visible, campamento plegable y mapas sin scrolls anidados.
- Poderes que sobreviven a su creación y activan otros poderes en cadena.
- Intercambios y caídas animados, con respeto a movimiento reducido.
- Recuerdos y consecuencias visibles en el resultado de cada nivel.

## Qué falta para una prueba comercial real

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
Guardar commit, hacer push y ejecutar `vercel --prod` con la cuenta autorizada.
El push de Git por sí solo no garantiza el despliegue: verificar la URL pública.
