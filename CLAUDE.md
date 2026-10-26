# Sugar Clash · Renacer — Claude Code

@AGENTS.md
@CONCEPT.md
@VISUAL_STYLE.md

Trabaja en el `index.html` de esta carpeta: es el juego vigente. `legacy/` conserva otra edición y otra API. No restaures sus instrucciones ni los estilos descartados.

Las decisiones nuevas de Jose prevalecen. El 23 de octubre autorizó coherencia visual, restauración táctica del tablero, guardianes con condiciones propias y consecuencias concretas al ganar, con foco en los primeros diez niveles. Esta etapa está integrada y validada técnicamente:97 pruebas y recorrido80/80. La publicación fb9388f y su evidencia en docs/DEPLOYMENT_RESTORATION.md quedan como historial. La expedición e94f27a queda como historial; sus informes no validan estas reglas nuevas. Conserva el concepto, la dirección dark/descolorido frente al color recuperado y el logo sobrio.

La campaña ahora exige su meta habitual y todas las zonas restauradas: `campaignWon(g)` valida ambas. Consulta `docs/RESTORATION_ENCOUNTERS.json` y las APIs del bloque `RESTORATION_START` en la guía operativa antes de cambiar encuentros. Las marcas pertenecen al suelo y no caen con las piezas. El atlas SVG de restauración está integrado y cacheado en renacer-v7; consulta docs/RESTORATION_QA.md. La validación con personas sigue pendiente.

La iteración posterior «El mundo responde» añade dioramas de restauración, presencia y reacciones de Confite, impactos de poderes y resumen de jugada. Está publicada como e484ffb en https://sugarclash-web.vercel.app/: 110 pruebas, revisión móvil/escritorio y recarga offline. Cache vigente:renacer-v6. Consulta docs/PLAY_CHARM_QA.md y la publicación de esta iteración en docs/DEPLOYMENT_PLAY_CHARM.md; fb9388f es la publicación anterior. La memoria de respuesta es transitoria en scFeedback, no en el guardado. Los archivos docs/art/PLAY_* son fuentes de integración; el runtime sigue inline.

No alteres los datos de Jose ni escribas `sugarclash_save_v1`. Consulta [la guía operativa de colaboración](docs/CLAUDE_HANDOFF.md) cuando necesites arrancar, localizar funciones, probar o publicar. Ese documento y los informes largos son de consulta; no los cargues todos por defecto.

La etapa posterior de navegación sustituye el mapa de Inicio por una sola acción principal y cuatro destinos: Inicio/Campaña/Modos/Aldea. Hay 125 pruebas, recorrido 80/80 y QA móvil/escritorio/offline. Caché actual renacer-v7. Consulta docs/NAVIGATION_QA.md y docs/DEPLOYMENT_NAVIGATION.md; e484ffb es la publicación anterior de personalidad. No restaures los nombres Atlas/Territorios/Jugar para estos destinos.

Publicación vigente de navegación: d759a05 en https://sugarclash-web.vercel.app/, READY/production, HTML y recursos verificados byte por byte. Evidencia en docs/DEPLOYMENT_NAVIGATION.md. Los commits documentales posteriores no cambian ese runtime.
