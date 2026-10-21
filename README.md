# Sugar Clash · Renacer

Un juego nuevo construido desde cero sobre el concepto de Dulcelandia: restauración, memoria y estrategia. Dulce Roja libera guardianes; Confite acompaña el viaje y cada victoria devuelve color al mundo.

Todo el juego vive en `index.html`, con HTML/CSS/JavaScript vanilla, imágenes locales, fuentes OFL empaquetadas y audio sintetizado. No hay framework, bundler, dependencias de runtime, pagos ni anuncios conectados.

## Jugar y comprobar

```sh
python3 -m http.server 4177 --bind 127.0.0.1
node --test tests/*.test.cjs
node scripts/renacer-playthrough.cjs
```

Abrir <http://127.0.0.1:4177/>. La nueva versión se encuentra en el proyecto local; este trabajo no publica cambios en Vercel ni en un portal.

- Campaña: ocho territorios, diez guardianes por territorio; luz, recolección e hielo.
- Poderes persistentes: rayos, bombas y cristales; cadenas, gravedad y combinaciones de poderes.
- Pulso manual de Confite: duplica la luz de la siguiente jugada.
- Diez construcciones con mejoras permanentes y recompensas ganadas.
- Guerra 5v5 y Royale contra IA local, accesibles desde el inicio.
- El Latido, Jardín en calma y un reto diario reproducible y gratuito.
- Vidas: se reserva una al entrar en campaña y se devuelve al ganar; perder o abandonar la consume. Regeneración de 25 minutos. Los otros modos no gastan vidas.
- Guardado, exportación/importación y PWA offline con caché independiente.

## Continuidad y datos

[CONCEPT.md](CONCEPT.md) conserva el concepto y la filosofía. [VISUAL_STYLE.md](VISUAL_STYLE.md) es la única guía visual compartida. [Estudio de mercado](docs/MARKET_STUDY_RENACER.md) compara referencias oficiales, cambios aplicados y validación comercial pendiente.

Renacer utiliza `sugarclash_renacer_v1`. Si aún no existe, lee el progreso compatible de `sugarclash_save_v1` sin escribir ni borrar esa clave. Las estrellas y construcciones se conservan; los sistemas retirados permanecen en el guardado antiguo. La edición anterior está en [legacy/index.html](legacy/index.html), con sus pruebas e instrucciones archivadas. Su enlace permite volver a abrirla con sus propios datos.

El [recorrido reproducible](docs/RENACER_PLAYTHROUGH.md) registra victorias y derrotas del motor real: no certifica dificultad humana, retención, aceptación del portal ni pruebas en un teléfono físico. Las pruebas de esta edición están en `tests/`; las antiguas, en `legacy/tests/`, documentan otro motor y se conservan como referencia.

La URL histórica de producción es https://sugarclash-web.vercel.app/; no debe confundirse con la vista local nueva.
