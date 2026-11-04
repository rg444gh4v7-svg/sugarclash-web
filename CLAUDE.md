# Sugar Clash / CHISPA — Claude Code

@AGENTS.md
@CONCEPT.md
@VISUAL_STYLE.md

**Última decisión de Jose, 3 de noviembre de 2026:** cambiar el juego y planear todo, tras la propuesta de CHISPA (nombre provisional). P01–P04 ya están implementados; no hay validación humana. Consulta [el informe actual](docs/CHISPA_PROTOTYPE_QA.md):154pruebas,12/12 del motor y por controles reales. No seguir ampliando Renacer como próximo trabajo por instrucciones de etapas anteriores.

Lee [docs/CHISPA_PLAN.md](docs/CHISPA_PLAN.md) y [docs/CHISPA_BACKLOG.md](docs/CHISPA_BACKLOG.md) para el próximo desarrollo. [docs/CHISPA_HANDOFF.md](docs/CHISPA_HANDOFF.md) incluye arranque y prompt listo. Consulta niveles, visual y negocio cuando corresponda; no cargar todos los informes históricos por defecto.

La implementación P01–P04 ya incluye motor determinista y una máquina donde el primer tiro cambie un espejo y el siguiente use esa geometría. Runtime `prototypes/chispa/index.html`, único HTML/CSS/JS vanilla, sin dependencias. Existe y debe mantenerse. El siguiente hito es P05: prueba con participantes, sin inventar resultados ni saltar a arte final. Servir su carpeta como raíz en un puerto aislado; sin worker durante el prototipo. Conservar dark/descolorido→color, tono sobrio y Confite. Reintentar/deshacer gratis; sin vidas, monedas, anuncios, compras ni multijugador.

El `index.html` de la raíz sigue siendo **Renacer**. No se modifica para crear el prototipo. `legacy/` conserva una edición todavía anterior y otra API; no usarlo como base de CHISPA. No escribir/borrar/convertir `sugarclash_save_v1` o `sugarclash_renacer_v1`; guardado nuevo previsto `chispa_save_v1`. Puerto 4177 y producción son datos personales, nunca entornos para fixtures.

Revisa `git status`, respeta cambios ajenos y coordina un solo integrador del HTML. Verifica sintaxis, reglas, recorrido real y navegador del runtime que cambies. La suite actual tiene154pruebas,29de CHISPA. Las125anteriores de Renacer y su80/80 conservan su propio alcance; ninguna suite demuestra diversión humana. Sigue las puertas del plan antes de arte final, campaña o compromisos comerciales. No implementar, gastar o publicar por el mero hecho de leer un plan; atender el encargo vigente de Jose.

Para mantener o empaquetar Renacer, consulta [docs/CLAUDE_HANDOFF.md](docs/CLAUDE_HANDOFF.md) y sus informes. Publicación de referencia: runtime d759a05 en https://sugarclash-web.vercel.app/, caché renacer-v7, [evidencia histórica](docs/DEPLOYMENT_NAVIGATION.md). No se ha vuelto a desplegar ni verificado ese destino como parte del plan CHISPA.
