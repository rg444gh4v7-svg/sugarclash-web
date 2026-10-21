# Sugar Clash · Renacer — instrucciones del proyecto

Jose toma las decisiones creativas; Codex implementa. Decisión vigente: reconstrucción desde cero conservando concepto y filosofía, seguida de comparación de mercado y mejoras. Leer [CONCEPT.md](CONCEPT.md) y [VISUAL_STYLE.md](VISUAL_STYLE.md) antes de cambiar juego o pantallas. Las decisiones nuevas de Jose prevalecen.

## Arquitectura vigente

Todo el runtime vive en `index.html`: HTML/CSS/JS vanilla. Sin frameworks, bundler ni dependencias nuevas de runtime. Imágenes locales, Fraunces/Karla OFL incrustadas y Web Audio sintetizado. `manifest.json` y `service-worker.js` permiten PWA/offline. La edición anterior, sus pruebas e instrucciones están en `legacy/`; no confundir su API con Renacer.

Pantallas `screen-home`, `world`, `modes`, `village`, `memories`, `settings`, `game` y `arena`. `showScreen()` limpia sesiones y `navigate()` respeta el abandono de partida. No crear rutas ficticias ni menús superfluos.

## Motor y guardado

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

## Reglas de producto

Sin anuncios forzados, anuncios simulados con premios ni pagos reales. SDK de portal requiere integración futura comprobada. Mantener modos gratuitos y acceso directo, Confite presente y revelación final reservada a T8. No prometer multijugador ni resultados comerciales. El estudio de mercado está en `docs/MARKET_STUDY_RENACER.md`.

## Validación obligatoria

Después de cada edición de `index.html`:

```sh
node -e "const h=require('fs').readFileSync('index.html','utf8');new Function(h.slice(h.indexOf('<script>')+8,h.lastIndexOf('</script>')));console.log('SYNTAX OK')"
```

Luego `node --test tests/*.test.cjs`. Cambios de reglas/metas requieren también `node scripts/renacer-playthrough.cjs`, con avance real y guardado aislado. No forzar victorias para afirmar80/80. Node está en `$HOME/.nvm/versions/node/v26.5.1/bin` si falta en PATH.

Revisar en navegador las vistas afectadas y320×640/390×844 sin tocar datos de Jose; distinguir emulación de teléfono físico. No publicar ni afirmar despliegue con un push. Verificar el destino y versión servida cuando Jose pida publicación. Registrar decisiones importantes en la guía compartida y conservar los informes.
