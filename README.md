# Sugar Clash · nuevo rumbo: CHISPA

Jose decidió cambiar el juego el **3 de noviembre de 2026**. **CHISPA** es el nombre provisional de la propuesta: un puzzle de un dedo donde cada disparo despierta un mecanismo y cambia las posibilidades del siguiente. Conserva el mundo oscuro/descolorido, el color que regresa y el tono sobrio.

**Estado actual:** prototipo CHISPA implementado en `prototypes/chispa/index.html`, con doce escenas, controles y motor nuevos.154pruebas y recorrido12/12 por motor y navegador. [Evidencia y límites](docs/CHISPA_PROTOTYPE_QA.md). La validación con participantes sigue pendiente. El runtime de la raíz y la publicación existente siguen siendo **Sugar Clash · Renacer**.

## Plan y próximo trabajo

Empieza por [el plan maestro](docs/CHISPA_PLAN.md). Incluye alcance, contrato, arquitectura, fases, continuidad de datos y transición. Los anexos desarrollan:

- [Doce niveles y reglas](docs/CHISPA_LEVELS.md).
- [Dirección visual e interfaz](docs/CHISPA_VISUAL.md).
- [Mercado, pruebas con jugadores y negocio](docs/CHISPA_VALIDATION_BUSINESS.md).
- [Backlog con aceptación y responsables](docs/CHISPA_BACKLOG.md).
- [Relevo para Claude o Codex](docs/CHISPA_HANDOFF.md).

Secuencia propuesta: motor y una escena → doce niveles provisionales → prueba humana → seis escenas acabadas → MVP de 24 niveles → prueba ampliada → decisión comercial. No se amplía la campaña sin pasar las puertas de validación.

**Punto para retomar:** P05, observación con participantes. P01–P04 ya están completos técnicamente. La [guía de relevo](docs/CHISPA_HANDOFF.md) deja el estado, la recomendación de modelo y el encargo listo para continuar.

[AGENTS.md](AGENTS.md), [CONCEPT.md](CONCEPT.md) y [VISUAL_STYLE.md](VISUAL_STYLE.md) distinguen las decisiones vigentes de la referencia histórica. [CLAUDE.md](CLAUDE.md) carga esas mismas instrucciones para Claude Code.

## Probar CHISPA

[Abrir CHISPA en el teléfono](https://chispa-jose-01a15c12.pulsarprojects1.chatgpt.site). Prueba privada: iniciar sesión con la misma cuenta de ChatGPT propietaria. Doce escenas, con progreso en memoria; recargar empieza de nuevo. Publicación independiente de Renacer. [Registro y límites de comprobación](docs/CHISPA_PHONE_DEPLOYMENT.json).

```sh
python3 -m http.server 4227 --bind 127.0.0.1 --directory prototypes/chispa
```

Abre `http://127.0.0.1:4227/` tras comprobar que el puerto esté libre. No requiere instalar paquetes. El progreso del prototipo vive en memoria: recargar empieza de nuevo; sólo se conservan preferencias propias. Las licencias de las fuentes están en `prototypes/chispa/licenses/`.

## Ejecutar Renacer, que sigue existiendo

Todo su runtime vive en `index.html`, con HTML/CSS/JS vanilla, recursos locales, fuentes OFL y Web Audio. Sin framework, bundler, pagos o anuncios conectados.

```sh
python3 -m http.server 4199 --bind 127.0.0.1
node --test tests/*.test.cjs
node scripts/renacer-playthrough.cjs
```

El puerto 4199 es un ejemplo de origen QA: comprobar que esté libre y que no contenga datos personales. No usar 4177 ni producción para jugar fixtures o importar guardados de prueba.

Publicación de referencia: [sugarclash-web.vercel.app](https://sugarclash-web.vercel.app/), runtime d759a05, caché renacer-v7. [Informe de publicación](docs/DEPLOYMENT_NAVIGATION.md) y [QA de navegación](docs/NAVIGATION_QA.md). Esa evidencia no valida CHISPA y no se ha repetido durante esta planificación.

Renacer incluye campaña de 80 guardianes, restauración del tablero, aldea y modos locales contra IA. Esos sistemas no se trasladan al prototipo nuevo. Sus reglas y mapa de funciones se conservan en [la guía de mantenimiento](docs/CLAUDE_HANDOFF.md); el [estudio anterior](docs/MARKET_STUDY_RENACER.md) mantiene su alcance histórico.

## Datos y versiones

Conservar `sugarclash_renacer_v1` y `sugarclash_save_v1` íntegros. CHISPA utilizará una clave independiente cuando se implemente. `legacy/` contiene la edición anterior a Renacer, con su motor, pruebas e instrucciones; no es el nuevo archivo de Renacer.

CHISPA ya se desarrolla en una carpeta/origen aislado y Renacer permanece publicado mientras se valida el cambio. El relevo de producción, el archivo navegable y cualquier SDK comercial son tareas futuras que necesitan implementación y verificación reales.
