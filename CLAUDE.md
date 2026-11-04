# Sugar Clash / CHISPA — Claude Code

@AGENTS.md
@CONCEPT.md
@VISUAL_STYLE.md

**Última decisión de Jose, 3 de noviembre de 2026:** cambiar el juego y planear todo, tras la propuesta de CHISPA (nombre provisional). La entrega actual es un plan; no hay runtime CHISPA ni validación humana. No seguir ampliando Renacer como próximo trabajo por instrucciones de etapas anteriores.

Lee [docs/CHISPA_PLAN.md](docs/CHISPA_PLAN.md) y [docs/CHISPA_BACKLOG.md](docs/CHISPA_BACKLOG.md) para el próximo desarrollo. [docs/CHISPA_HANDOFF.md](docs/CHISPA_HANDOFF.md) incluye arranque y prompt listo. Consulta niveles, visual y negocio cuando corresponda; no cargar todos los informes históricos por defecto.

La primera implementación propuesta es P01–P02: motor determinista y una máquina donde el primer tiro cambie un espejo y el siguiente use esa geometría. Destino futuro `prototypes/chispa/index.html`, único HTML/CSS/JS vanilla, sin dependencias. No existe por el solo hecho de estar en el plan. Servir su carpeta como raíz en un puerto aislado; sin worker durante el prototipo. Conservar dark/descolorido→color, tono sobrio y Confite. Reintentar/deshacer gratis; sin vidas, monedas, anuncios, compras ni multijugador.

El `index.html` de la raíz sigue siendo **Renacer**. No se modifica para crear el prototipo. `legacy/` conserva una edición todavía anterior y otra API; no usarlo como base de CHISPA. No escribir/borrar/convertir `sugarclash_save_v1` o `sugarclash_renacer_v1`; guardado nuevo previsto `chispa_save_v1`. Puerto 4177 y producción son datos personales, nunca entornos para fixtures.

Revisa `git status`, respeta cambios ajenos y coordina un solo integrador del HTML. Verifica sintaxis, reglas, recorrido real y navegador del runtime que cambies. Las 125 pruebas y 80/80 de Renacer no prueban CHISPA ni diversión humana. Sigue las puertas del plan antes de arte final, campaña o compromisos comerciales. No implementar, gastar o publicar por el mero hecho de leer un plan; atender el encargo vigente de Jose.

Para mantener o empaquetar Renacer, consulta [docs/CLAUDE_HANDOFF.md](docs/CLAUDE_HANDOFF.md) y sus informes. Publicación de referencia: runtime d759a05 en https://sugarclash-web.vercel.app/, caché renacer-v7, [evidencia histórica](docs/DEPLOYMENT_NAVIGATION.md). No se ha vuelto a desplegar ni verificado ese destino como parte del plan CHISPA.
