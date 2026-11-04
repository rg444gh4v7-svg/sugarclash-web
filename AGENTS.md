# Sugar Clash / CHISPA — instrucciones del proyecto

Jose toma las decisiones creativas; Codex y Claude implementan. **Decisión vigente, 3 de noviembre de 2026:** Jose quiere cambiar el juego y pidió planear todo, tras la propuesta de **CHISPA** (nombre provisional). Leer [CONCEPT.md](CONCEPT.md), [VISUAL_STYLE.md](VISUAL_STYLE.md) y [el plan maestro](docs/CHISPA_PLAN.md). Las decisiones nuevas de Jose prevalecen.

## Próximo desarrollo · CHISPA

La entrega actual es documental, sin un runtime CHISPA ni pruebas humanas. El siguiente trabajo propuesto es P01–P02 de [CHISPA_BACKLOG.md](docs/CHISPA_BACKLOG.md): prototipo aislado de puntería en el que un disparo activa un mecanismo y cambia la geometría del siguiente. Geometría congelada durante el tiro, preview y resolución con el mismo cálculo; deshacer/reintentar gratis. Conservar dark/descolorido→color por acciones reales, tono sobrio, Confite y el universo; no revelar su final.

No continuar ampliando Renacer como próximo encargo ni portar su match-3, economía, aldea o Arena al prototipo. Las reglas de vidas y metas de Renacer descritas más abajo sólo rigen ese runtime. Los ocho territorios/80 guardianes son patrimonio narrativo; no un requisito de producir80niveles del juego nuevo.

Destino propuesto al implementar: `prototypes/chispa/index.html`, todo HTML/CSS/JS vanilla, sin dependencias de runtime nuevas. Esa ruta aún no existe por el solo hecho de aparecer en el plan. Probar sirviendo esa carpeta en un origen aislado; sin worker durante el prototipo. No tocar producción ni el `index.html` de Renacer para crear el prototipo. Guardado futuro `chispa_save_v1`, sin escribir, borrar o convertir las dos claves anteriores.

Contrato/encuentros: [CHISPA_LEVELS.md](docs/CHISPA_LEVELS.md); dirección visual: [CHISPA_VISUAL.md](docs/CHISPA_VISUAL.md); investigación y pruebas: [CHISPA_VALIDATION_BUSINESS.md](docs/CHISPA_VALIDATION_BUSINESS.md); relevo: [CHISPA_HANDOFF.md](docs/CHISPA_HANDOFF.md). Un solo integrador del HTML; agentes visuales/contenido/QA trabajan en archivos separados. No presentar propuestas, niveles dibujados o pruebas de Renacer como evidencia del juego nuevo.

Este encargo de planificación no activa una implementación, un gasto ni una publicación. Al implementar, validar sintaxis del HTML afectado, pruebas significativas del motor/sesión y navegador320×640/390×844/escritorio; recorrido de niveles real y guardado aislado. No saltar las puertas humanas del plan para producir arte final o una campaña completa.

## Runtime Renacer existente · mantenimiento y archivo

Las secciones siguientes describen exclusivamente Renacer, que sigue como versión publicada mientras se valida el cambio. Conservar su código, datos e informes. Para el motor nuevo rige el plan CHISPA anterior.

### Arquitectura de Renacer

Todo el runtime vive en `index.html`: HTML/CSS/JS vanilla. Sin frameworks, bundler ni dependencias nuevas de runtime. Imágenes locales, Fraunces/Karla OFL incrustadas y Web Audio sintetizado. `manifest.json` y `service-worker.js` permiten PWA/offline. La edición anterior, sus pruebas e instrucciones están en `legacy/`; no confundir su API con Renacer.

Pantallas `screen-home`, `world`, `modes`, `village`, `memories`, `settings`, `game` y `arena`. `showScreen()` limpia sesiones y `navigate()` respeta el abandono de partida. No crear rutas ficticias ni menús superfluos.

### Motor y guardado de Renacer

- Clave nueva: `sugarclash_renacer_v1`. `defaultSave()` + `normalizeSave()` son fuentes de verdad. Todo campo añadido necesita valor por defecto y normalización.
- `loadSave()` puede leer `sugarclash_save_v1` para importar progreso compatible. Nunca escribir, borrar ni sustituir esa clave para actualizar Renacer.
- Guardar mediante `persistSave()`. Los renders no conceden premios ni progreso.
- Tablero plano con piezas `{id,color,power}` y hielo fijo paralelo `g.ice`. La identidad/poder viaja con la pieza. `runGroups`, `legalMoves`, `powerCreation`, `expandEffects`, `gravity` y `reshuffle` contienen las reglas puras.
- Entrada de campaña: `requestLevel()` → diálogo de jefe si corresponde → `tryStartLevel()` → `spendLife()` → `startBoard()`. Nunca saltarse validación o cobro. El jefe requiere nueve victorias, una estrella basta. Doble confirmación cobra una vez.
- Vida reservada al entrar; victoria ganada devuelve una sola vida, con `g.lifeRefunded` y techo `livesMax()`. Derrota/abandono consumen la reserva. Regeneración25min;5 vidas o6 con Muelle.
- `finishBoard()` valida meta y concede una vez por intento. Mejores estrellas y puntuaciones no bajan; repetir no vuelve a dar gemas de primera victoria.
- Diario: semilla de fecha local, mismo tablero/refills para mismas decisiones. Sin vidas ni racha penalizada. Recompensa una vez por fecha; no escribe estrellas de campaña.
- `state.run` invalida esperas de tableros abandonados; verificar `isActive(g)` tras cada espera. Timers pausados/limpios al navegar u ocultar. No añadir RAF de decoración.
- Arena: `arenaState`, `startArena`, `stopArena`, `pauseArena`; Guerra5v5 y Royale locales contra IA. Marcas de impacto fijas y esquivables; Pulso interrumpe. Canvas390×570 lógico, DPR≤2. Modales genéricos pausan combate; limpiar eventos/observadores/RAF al salir.
- Aldea: diez edificios con requisitos completos anteriores. Inspeccionar no construye; acción explícita y miel suficiente mediante `buildStructure()`.

### Reglas de producto de Renacer

Sin anuncios forzados, anuncios simulados con premios ni pagos reales. SDK de portal requiere integración futura comprobada. Mantener modos gratuitos y acceso directo, Confite presente y revelación final reservada a T8. No prometer multijugador ni resultados comerciales. El estudio de mercado está en `docs/MARKET_STUDY_RENACER.md`.

### Validación obligatoria de Renacer

Después de cada edición de `index.html`:

```sh
node -e "const h=require('fs').readFileSync('index.html','utf8');new Function(h.slice(h.indexOf('<script>')+8,h.lastIndexOf('</script>')));console.log('SYNTAX OK')"
```

Luego `node --test tests/*.test.cjs`. Cambios de reglas/metas requieren también `node scripts/renacer-playthrough.cjs`, con avance real y guardado aislado. No forzar victorias para afirmar80/80. Node está en `$HOME/.nvm/versions/node/v26.5.1/bin` si falta en PATH.

Revisar en navegador las vistas afectadas y320×640/390×844 sin tocar datos de Jose; distinguir emulación de teléfono físico. No publicar ni afirmar despliegue con un push. Verificar el destino y versión servida cuando Jose pida publicación. Registrar decisiones importantes en la guía compartida y conservar los informes.
