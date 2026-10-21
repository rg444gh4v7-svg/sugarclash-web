'use strict';
// Reproducible engine-only playthrough. No browser, save fixture, forced wins,
// purchases, continues, or gameplay helpers. Progress is earned by finishBoard.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
assert.ok(script.includes('window.SugarClash='), 'Renacer runtime was not found');
let seed = Number(process.env.RENACER_SEED || 20261021) >>> 0;
const initialSeed = seed;
const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
const clockStart = Date.UTC(2026, 9, 21, 12);
let clock = clockStart;
class Clock extends Date { constructor(...args) { super(...(args.length ? args : [clock])); } static now() { return clock; } }
const math = Object.create(Math); math.random = random;
const store = new Map();
const screenNode = {querySelector: () => null};
const context = vm.createContext({
  Date: Clock, Math: math, console,
  document: {hidden: false, addEventListener() {}, getElementById: id => id === 'screen-game' ? screenNode : null},
  window: {addEventListener() {}}, navigator: {}, performance: {now: () => clock},
  localStorage: {getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value)},
  matchMedia: () => ({matches: true}), setTimeout(fn, ms) { if (ms === 0) fn(); return 1; },
  clearTimeout() {}, setInterval: () => 1, clearInterval() {}, requestAnimationFrame: () => 1, cancelAnimationFrame() {}
});
vm.runInContext(script.slice(0, script.indexOf('window.SugarClash=')) + `
showScreen=name=>{state.screen=name;}; renderGame=()=>{}; renderPieces=()=>{};
updateGameHUD=()=>{}; updateResources=()=>{}; resetHint=()=>{};
sound=()=>{}; setTip=()=>{}; showCombo=()=>{}; toast=message=>{globalThis.lastToast=message;};
showModal=config=>{state.modal=true;globalThis.lastModal=config;}; closeModal=()=>{state.modal=false;};
globalThis.api={state,getSave:()=>save,requestLevel,levelOpen,campaignNext,legalMoves,runGroups,powerCreation,expandEffects,canCombine,attemptSwap,armPulse,pulseNeed,stopBoard,syncLives,constants:{LIFE_MS,SAVE_KEY}};
`, context);
const a = context.api;

function evaluate(g, pair) {
  const [i, j] = pair, board = g.board, beforeA = board[i], beforeB = board[j];
  const combo = a.canCombine(beforeA, beforeB);
  [board[i], board[j]] = [board[j], board[i]];
  const groups = a.runGroups(board, g.size);
  let seeds, color = null, creation = null;
  if (combo) {
    if (beforeA.color === 6 && beforeB.color === 6) seeds = board.map((_, k) => k);
    else if (beforeA.color === 6 || beforeB.color === 6) {
      color = beforeA.color === 6 ? beforeB.color : beforeA.color;
      seeds = [i, j, ...board.flatMap((p, k) => p.color === color ? [k] : [])];
    } else seeds = [i, j];
  } else {
    creation = a.powerCreation(board, g.size, groups, [j, i]);
    seeds = [...new Set(groups.flatMap(group => group.cells))];
  }
  const cells = a.expandEffects(board, g.size, seeds, creation?.index ?? -1, color).cells;
  let value = cells.length;
  if (g.type === 'collect') value += cells.filter(k => board[k]?.color === g.targetColor).length * 12;
  if (g.type === 'ice') {
    const damaged = new Set();
    for (const k of cells) for (const near of [k, k % g.size ? k - 1 : -1, k % g.size < g.size - 1 ? k + 1 : -1, k - g.size, k + g.size]) {
      if (near >= 0 && near < board.length && g.ice[near]) damaged.add(near);
    }
    value += damaged.size * 10;
  }
  if (creation) value += creation.power === 'prism' ? 12 : creation.power === 'bomb' ? 7 : 5;
  [board[i], board[j]] = [board[j], board[i]];
  return value;
}

async function main() {
  const results = [];
  let waits = 0, pulseUses = 0, invalidMoves = 0;
  const maxAttempts = 10;
  campaign: for (let t = 1; t <= 8; t++) for (let n = 1; n <= 10; n++) {
    assert.equal(a.levelOpen(t, n), true, `Campaign gate did not open ${t}-${n}`);
    const row = {t, n, attempts: 0, won: false, losses: 0, moves: 0, attemptsDetail: []};
    while (row.attempts < maxAttempts && !row.won) {
      while (!a.getSave().lives) { clock += a.constants.LIFE_MS; a.syncLives(clock); waits++; }
      const livesBefore = a.getSave().lives;
      a.requestLevel(t, n);
      if (n === 10) {
        assert.equal(a.getSave().lives, livesBefore, 'Boss introduction charged a life');
        assert.equal(a.state.game, null, 'Boss started before confirmation');
        const enter = context.lastModal.actions[0].onClick;
        enter(); enter();
      }
      const g = a.state.game;
      assert.ok(g && g.t === t && g.n === n, `Level did not start ${t}-${n}: ${context.lastToast || ''}`);
      assert.equal(a.getSave().lives, livesBefore - 1, 'Entry should charge exactly one life');
      row.attempts++;
      let moves = 0;
      while (!g.done && moves < 100) {
        const options = a.legalMoves(g.board, g.size);
        assert.ok(options.length, `No legal moves at ${t}-${n}`);
        let best = options[0], bestValue = -Infinity;
        for (const move of options) { const value = evaluate(g, move); if (value > bestValue) { bestValue = value; best = move; } }
        if (g.pulse >= a.pulseNeed() && !g.pulseArmed) { a.armPulse(); pulseUses++; }
        const accepted = await a.attemptSwap(...best);
        if (!accepted) invalidMoves++;
        assert.equal(accepted, true, 'The engine rejected its own reported legal move');
        moves++;
      }
      assert.ok(g.done, `Unfinished level after 100 turns at ${t}-${n}`);
      row.moves += moves;
      row.won = a.getSave().stars[t]?.[n] > 0;
      if (!row.won) row.losses++;
      row.attemptsDetail.push({won: row.won, moves, progress: g.progress, goal: g.goal, score: g.score});
      a.stopBoard();
    }
    results.push(row);
    process.stdout.write(`${t}-${String(n).padStart(2, '0')} ${row.won ? 'WIN' : 'BLOCKED'} ${row.attempts} attempt${row.attempts === 1 ? '' : 's'}\n`);
    if (!row.won) break campaign;
  }
  const report = {
    seed: initialSeed, testedLevels: results.length, completedLevels: results.filter(r => r.won).length,
    attempts: results.reduce((s, r) => s + r.attempts, 0), losses: results.reduce((s, r) => s + r.losses, 0),
    firstAttemptWins: results.filter(r => r.won && r.attempts === 1).length, waits, waitMinutes: waits * 25,
    pulseUses, invalidMoves, simulatedElapsedMinutes: (clock - clockStart) / 60000,
    completedCampaign: a.campaignNext().complete, legacyKeyWritten: store.has('sugarclash_save_v1'), results
  };
  fs.writeFileSync(path.join(root, 'docs', 'RENACER_PLAYTHROUGH.json'), JSON.stringify(report, null, 2) + '\n');
  const territories = Array.from({length: 8}, (_, i) => {
    const rows = results.filter(r => r.t === i + 1), attempts = rows.reduce((s, r) => s + r.attempts, 0);
    return `| ${i + 1} | ${rows.filter(r => r.won).length}/10 | ${attempts} | ${rows.filter(r => r.won && r.attempts === 1).length}/10 | ${rows.reduce((s, r) => s + r.losses, 0)} |`;
  });
  const markdown = `# Renacer · recorrido automatizado del motor\n\nFecha: 21 de octubre de 2026. Semilla reproducible: \`${initialSeed}\`. Ejecutar \`node scripts/renacer-playthrough.cjs\`. Solo usa módulos incluidos en Node.\n\nEl script carga el JavaScript real de \`index.html\` en una VM y sustituye únicamente pintura, audio, ventanas y esperas de animación. Entra por \`requestLevel()\`, confirma el diálogo real de cada jefe (también prueba doble toque), y juega mediante \`attemptSwap()\`. Las victorias, estrellas, recursos y accesos los concede \`finishBoard()\`; no se modifica el guardado para avanzar.\n\nEl bot elige la jugada con mayor efecto inmediato sobre la meta y el valor aproximado de un poder creado. No anticipa caramelos nuevos ni cascadas. Usa el Pulso de Confite al cargarlo. No usa martillos, barajados manuales, construcciones, gemas, continuaciones ni ayudas externas. La entrada reserva una vida; ganar la devuelve una sola vez y perder o abandonar la consume. Cuando no quedan vidas, avanza el reloj simulado 25 minutos y ejecuta la regeneración real. Cada nivel admite hasta diez intentos.\n\nResultado: **${report.completedLevels}/80 niveles**, ${report.attempts} intentos y ${report.losses} derrotas. ${report.firstAttemptWins}/80 victorias al primer intento. ${waits} esperas simuladas de 25 minutos (${report.waitMinutes} minutos), ${pulseUses} Pulsos y ${invalidMoves} jugadas rechazadas. Guardado antiguo escrito: ${report.legacyKeyWritten ? 'sí' : 'no'}.\n\n| Territorio | Victorias | Intentos | Primer intento | Derrotas |\n|---|---:|---:|---:|---:|\n${territories.join('\n')}\n\nEsto verifica que el motor y sus puertas permiten recorrer la campaña con estas decisiones y esta semilla. No es una prueba manual ni una medida de dificultad humana, retención, calidad comercial o rendimiento en un teléfono. La pintura y los controles reales requieren sus propias comprobaciones en navegador. El detalle de cada intento está en [RENACER_PLAYTHROUGH.json](RENACER_PLAYTHROUGH.json).\n`;
  fs.writeFileSync(path.join(root, 'docs', 'RENACER_PLAYTHROUGH.md'), markdown);
  console.log(JSON.stringify({...report, results: undefined}, null, 2));
  assert.equal(report.completedLevels, 80, 'The bot did not complete all 80 levels');
  assert.equal(report.completedCampaign, true);
  assert.equal(report.legacyKeyWritten, false);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
