'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.slice(html.indexOf('<script>') + '<script>'.length, html.lastIndexOf('</script>'));
assert.ok(script.includes('window.SugarClash='), 'Tests must load the Renacer runtime from index.html');
const runtime = script.slice(0, script.indexOf('window.SugarClash='));

function harness(initial = {}, now = 1792550400000) {
  const storage = new Map(Object.entries(initial));
  const writes = [];
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
  const math = Object.create(Math); math.random = rng(20261021);
  const context = vm.createContext({
    Date: Clock, console, Math: math, Set, Map, JSON,
    document: {addEventListener() {}, getElementById(id) { return id === 'screen-game' ? {querySelector: () => null} : null; }, hidden: false},
    window: {addEventListener() {}}, navigator: {}, performance: {now: () => now},
    matchMedia: () => ({matches: true}),
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem(key, value) { storage.set(key, value); writes.push([key, value]); }
    },
    setTimeout(fn, ms) { if (ms === 0) fn(); return 1; }, clearTimeout() {}, setInterval: () => 1, clearInterval() {},
    requestAnimationFrame: () => 1, cancelAnimationFrame() {}
  });
  vm.runInContext(runtime + `\n;globalThis.api={makeBoard,runGroups,matchedCells,legalMoves,powerCreation,expandEffects,gravity,reshuffle,canCombine,newPiece,levelConfig,normalizeSave,defaultSave,loadSave,syncLives,spendLife,livesMax,starsAt,completed,territoryOpen,levelOpen,campaignNext,totalReleased,buildingOpen,tryStartLevel,requestLevel,attemptSwap,finishBoard,dailyConfig,dailySeed,seededRandom,teachingBoard,startBoard,startDaily,stopBoard,armPulse,pulseNeed,dayKey,state,constants:{SAVE_KEY,LEGACY_KEY,LIFE_MS},getSave:()=>save,setSave:s=>save=s};`, context);
  return {...context.api, context, storage, writes, setNow: n => now = n, now: () => now};
}

function rng(seed) { return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296); }
function plain(value) { return JSON.parse(JSON.stringify(value)); }
function boardOf(api, size = 5) { return Array.from({length: size * size}, (_, i) => api.newPiece((Math.floor(i / size) + i % size) % 5)); }
function snapshot(board) { return board.map(p => p && [p.id, p.color, p.power]); }
function fillWins(api, t, until) { const s = api.getSave(); s.stars[t] ??= {}; for (let n = 1; n <= until; n++) s.stars[t][n] = 1; }
function noPaint(api) {
  vm.runInContext('showScreen=name=>{state.screen=name;}; renderGame=()=>{};renderPieces=()=>{};updateGameHUD=()=>{};resetHint=()=>{};sound=()=>{};setTip=()=>{};showCombo=()=>{};showModal=()=>{};', api.context);
}
function paintSignature(board) { return Array.from(board, p => p && [p.color, p.power]); }

test('initial boards have unique pieces, no automatic matches, and an actual legal move', () => {
  const a = harness();
  for (const colors of [5, 6]) for (let seed = 1; seed <= 20; seed++) {
    const board = a.makeBoard(7, colors, rng(seed));
    assert.equal(board.length, 49);
    assert.equal(new Set(board.map(p => p.id)).size, 49);
    assert.ok(board.every(p => p.color >= 0 && p.color < colors && p.power === null));
    assert.equal(a.matchedCells(board, 7).length, 0);
    assert.ok(a.legalMoves(board, 7).length > 0);
  }
});

test('legal move discovery never mutates the board or its piece objects', () => {
  const a = harness(), board = a.makeBoard(7, 6, rng(28)), before = snapshot(board), refs = board.slice();
  const moves = a.legalMoves(board, 7);
  assert.deepEqual(snapshot(board), before);
  assert.ok(board.every((p, i) => p === refs[i]));
  for (const [i, j] of moves) {
    assert.equal(Math.abs(Math.floor(i / 7) - Math.floor(j / 7)) + Math.abs(i % 7 - j % 7), 1);
    [board[i], board[j]] = [board[j], board[i]];
    assert.ok(a.canCombine(board[i], board[j]) || a.matchedCells(board, 7).some(k => k === i || k === j));
    [board[i], board[j]] = [board[j], board[i]];
  }
});

test('four in a line creates a ray and five creates a prism at the swapped piece', () => {
  const a = harness();
  for (const [count, power, color] of [[4, 'row', 0], [5, 'prism', 6]]) {
    const board = boardOf(a);
    for (let c = 0; c < count; c++) board[10 + c].color = 0;
    assert.deepEqual(plain(a.powerCreation(board, 5, a.runGroups(board, 5), [11])), {index: 11, color, power});
  }
  const column = boardOf(a);
  for (let r = 0; r < 4; r++) column[r * 5 + 2].color = 0;
  assert.equal(a.powerCreation(column, 5, a.runGroups(column, 5), [12]).power, 'col');
});

test('L and T intersections create bombs rather than a plain ray', () => {
  const a = harness(), board = boardOf(a);
  for (const i of [10, 11, 12, 17, 22]) board[i].color = 0;
  assert.deepEqual(plain(a.powerCreation(board, 5, a.runGroups(board, 5), [12])), {index: 12, color: 0, power: 'bomb'});
});

test('a new power survives its creation wave and falls intact with gravity', () => {
  const a = harness(), board = boardOf(a);
  for (const i of [10, 11, 12, 13]) board[i].color = 0;
  const groups = a.runGroups(board, 5), creation = a.powerCreation(board, 5, groups, [11]);
  const savedPiece = board[creation.index]; savedPiece.power = creation.power; savedPiece.color = creation.color;
  const effect = a.expandEffects(board, 5, groups.flatMap(g => g.cells), creation.index);
  assert.ok(!effect.cells.includes(creation.index));
  for (const i of effect.cells) board[i] = null;
  board[21] = null;
  const existingIds = new Set(board.filter(Boolean).map(p => p.id));
  const fresh = a.gravity(board, 5, 5, rng(2));
  assert.equal(board[16], savedPiece);
  assert.equal(savedPiece.power, 'row');
  assert.ok(board.every(Boolean));
  assert.equal(new Set(board.map(p => p.id)).size, 25);
  assert.ok(fresh.every(id => !existingIds.has(id)));
  assert.ok(a.expandEffects(board, 5, [16]).cells.length >= 5, 'the surviving ray can activate on a later wave');
});

test('rays and bombs chain once per piece and honor a protected creation', () => {
  const a = harness(), board = boardOf(a);
  board[12].power = 'row'; board[14].power = 'bomb'; board[8].power = 'col';
  const result = a.expandEffects(board, 5, [12, 12, 14]);
  const expected = new Set([10, 11, 12, 13, 14, 8, 9, 18, 19, 3, 23]);
  assert.deepEqual(new Set(result.cells), expected);
  assert.deepEqual(new Set(result.triggered), new Set([12, 14, 8]));
  assert.equal(result.cells.length, expected.size);
  assert.equal(result.triggered.length, 3);
  const protectedResult = a.expandEffects(board, 5, [12, 14], 12);
  assert.ok(!protectedResult.cells.includes(12));
  assert.ok(!protectedResult.triggered.includes(12));
});

test('prisms combine with colors and each other without requiring a match', () => {
  const a = harness(), board = boardOf(a);
  board[0] = a.newPiece(6, 'prism');
  assert.ok(a.canCombine(board[0], board[1]));
  assert.equal(a.canCombine(board[1], board[2]), false);
  const targets = board.flatMap((p, i) => p.color === 2 ? [i] : []);
  const colorResult = a.expandEffects(board, 5, [0, ...targets], -1, 2);
  assert.deepEqual(new Set(colorResult.cells), new Set([0, ...targets]));
  board[1] = a.newPiece(6, 'prism');
  assert.ok(a.canCombine(board[0], board[1]));
  assert.equal(a.expandEffects(board, 5, board.map((_, i) => i)).cells.length, 25);
});

test('reshuffling preserves every piece, its power, and colors while making a valid board', () => {
  const a = harness(), board = a.makeBoard(7, 6, rng(10));
  board[9].power = 'bomb'; board[18].power = 'col'; board[31].power = 'prism'; board[31].color = 6;
  const before = new Map(board.map(p => [p.id, p])), contents = snapshot(board).sort((x, y) => x[0] - y[0]);
  assert.equal(a.reshuffle(board, 7, rng(200)), true);
  assert.deepEqual(snapshot(board).sort((x, y) => x[0] - y[0]), contents);
  assert.ok(board.every(p => before.get(p.id) === p));
  assert.equal(a.matchedCells(board, 7).length, 0);
  assert.ok(a.legalMoves(board, 7).length > 0);
});

test('an impossible reshuffle leaves the original board intact', () => {
  const a = harness(), board = Array.from({length: 9}, () => a.newPiece(0));
  board[4].power = 'bomb'; const before = snapshot(board), refs = board.slice();
  assert.equal(a.reshuffle(board, 3, rng(9)), false);
  assert.deepEqual(snapshot(board), before);
  assert.ok(board.every((p, i) => p === refs[i]));
});

test('campaign config provides 80 finite playable goals, valid target colors, and attainable ice counts', () => {
  const a = harness(); let levels = 0;
  for (let t = 1; t <= 8; t++) for (let n = 1; n <= 10; n++) {
    const c = a.levelConfig(t, n); levels++;
    assert.equal(c.t, t); assert.equal(c.n, n); assert.equal(c.mode, 'campaign');
    assert.ok(Number.isInteger(c.moves) && c.moves > 0 && c.moves <= 30);
    assert.ok(Number.isFinite(c.goal) && c.goal > 0);
    assert.ok(['rescue', 'collect', 'ice'].includes(c.type));
    assert.ok(c.targetColor >= 0 && c.targetColor < c.colors);
    if (c.type === 'ice') assert.ok(c.goal <= c.size * c.size);
    if (c.type === 'collect') assert.ok(c.goal < c.moves * 3);
    assert.ok(a.legalMoves(a.makeBoard(c.size, c.colors, rng(t * 100 + n)), c.size).length);
  }
  assert.equal(levels, 80);
});

test('save normalization rejects malformed resources, stars, and unknown buildings', () => {
  const a = harness(), old = {coins: -9, gems: Infinity, lives: 99, muted: 'yes', livesAt: NaN,
    stars: {1: {1: 99, 2: -1, 3: '3', 4: null, 5: 1.8}, 8: {10: 2}, 9: {1: 3}},
    buildings: {muelle: false, forja: 'true', injected: true}, records: {royaleBest: 99},
    boosters: {hammer: -4, shuffle: 99999}, bestScores: {'1_1': 123.8, '9_1': 777}};
  const before = JSON.stringify(old), s = a.normalizeSave(old);
  assert.equal(s.coins, 0); assert.equal(s.gems, 25); assert.equal(s.lives, 5); assert.equal(s.muted, false);
  assert.equal(s.livesAt, a.now());
  assert.deepEqual(plain(s.stars[1]), {1: 3, 5: 1});
  assert.equal(s.stars[8][10], 2); assert.equal(s.stars[9], undefined);
  assert.deepEqual(plain(s.buildings), {casa: true});
  assert.equal(s.records.royaleBest, 10); assert.equal(s.boosters.hammer, 0); assert.equal(s.boosters.shuffle, 999);
  assert.deepEqual(plain(s.bestScores), {'1_1': 123});
  assert.equal(JSON.stringify(old), before);
  for (const bad of [null, undefined, false, 9, 'bad', [], {stars: 'bad'}, {stars: {1: 'bad'}}]) assert.doesNotThrow(() => a.normalizeSave(bad));
});

test('real life timestamps survive reload and future timestamps recover from the current time', () => {
  const a = harness(), timestamp = a.now() - 13 * 60000;
  const s = a.normalizeSave({lives: 2, livesAt: timestamp});
  assert.equal(s.livesAt, timestamp);
  a.setSave(s); a.syncLives(); assert.equal(s.lives, 2);
  a.setNow(a.now() + 12 * 60000); a.syncLives(); assert.equal(s.lives, 3);
  assert.equal(s.livesAt, timestamp + a.constants.LIFE_MS);
  const future = a.normalizeSave({lives: 0, livesAt: a.now() + 10 * 86400000});
  assert.equal(future.livesAt, a.now());
  a.setSave(future); a.setNow(a.now() + a.constants.LIFE_MS); a.syncLives(); assert.equal(future.lives, 1);
});

test('legacy migration reads progress and records without writing or modifying the legacy key', () => {
  const legacy = JSON.stringify({stars: {1: {1: 1, 2: 2}}, coins: 76, survivalBest: 333,
    mobaWins: 4, brWins: 2, brBestPlacement: 3, buildings: {casa: true, puesto: true}});
  const a = harness({sugarclash_save_v1: legacy}), s = a.getSave();
  assert.equal(s.legacyImported, true); assert.equal(s.coins, 76); assert.equal(s.stars[1][2], 2);
  assert.deepEqual(plain(s.records), {survival: 333, zen: 0, warWins: 4, royaleWins: 2, royaleBest: 3});
  assert.equal(a.storage.get('sugarclash_save_v1'), legacy); assert.equal(a.writes.length, 0);
  a.spendLife();
  assert.ok(a.writes.every(([key]) => key === 'sugarclash_renacer_v1'));
  assert.equal(a.storage.get('sugarclash_save_v1'), legacy);
});

test('Renacer saves take priority and corrupted JSON safely loads defaults', () => {
  const a = harness({sugarclash_renacer_v1: JSON.stringify({coins: 88}), sugarclash_save_v1: JSON.stringify({coins: 999})});
  assert.equal(a.getSave().coins, 88); assert.equal(a.getSave().legacyImported, false);
  const broken = harness({sugarclash_renacer_v1: '{invalid'});
  assert.equal(broken.getSave().lives, 5); assert.equal(broken.getSave().coins, 0); assert.equal(broken.writes.length, 0);
});

test('life spending, partial regeneration, and the dock capacity behave across time', () => {
  const a = harness(), start = a.now(), s = a.getSave();
  assert.equal(a.spendLife(), true); assert.equal(s.lives, 4); assert.equal(s.livesAt, start);
  a.setNow(start + 10 * 60000); assert.equal(a.spendLife(), true); assert.equal(s.lives, 3); assert.equal(s.livesAt, start);
  a.setNow(start + 61 * 60000); a.syncLives(); assert.equal(s.lives, 5); assert.equal(s.livesAt, a.now());
  s.buildings.muelle = true; a.syncLives(); assert.equal(a.livesMax(), 6); assert.equal(s.lives, 5);
  a.setNow(a.now() + a.constants.LIFE_MS); a.syncLives(); assert.equal(s.lives, 6);
  s.lives = 0; s.livesAt = a.now(); const writes = a.writes.length;
  assert.equal(a.spendLife(), false); assert.equal(s.lives, 0); assert.equal(a.writes.length, writes);
});

test('boss access needs nine wins with one star each, and a gap blocks forward progress', () => {
  const a = harness(); fillWins(a, 1, 8);
  assert.equal(a.levelOpen(1, 9), true); assert.equal(a.levelOpen(1, 10), false);
  a.getSave().stars[1][9] = 1; assert.equal(a.levelOpen(1, 10), true);
  delete a.getSave().stars[1][4]; assert.equal(a.levelOpen(1, 10), false);
  for (const [t, n] of [[0, 1], [9, 1], [1, 0], [1, 11], [1, 1.5], ['1', 1]]) assert.equal(a.levelOpen(t, n), false);
});

test('all 80 levels are reachable in order without granting three stars or writing during renders', () => {
  const a = harness();
  for (let t = 1; t <= 8; t++) for (let n = 1; n <= 10; n++) {
    assert.deepEqual(plain(a.campaignNext()), {t, n, complete: false});
    assert.equal(a.levelOpen(t, n), true);
    if (n < 10) assert.equal(a.levelOpen(t, n + 1), false);
    if (t < 8) assert.equal(a.territoryOpen(t + 1), false);
    fillWins(a, t, n);
  }
  assert.equal(a.totalReleased(), 80);
  assert.deepEqual(plain(a.campaignNext()), {t: 8, n: 10, complete: true});
  assert.equal(a.writes.length, 0);
});

test('building access checks the complete prerequisite path even with imported holes', () => {
  const a = harness(); a.getSave().buildings = {casa: true, fuente: true, jardin: true};
  assert.equal(a.buildingOpen('puesto'), true);
  assert.equal(a.buildingOpen('torre'), false);
  assert.equal(a.buildingOpen('missing'), false);
  a.getSave().buildings.puesto = true; assert.equal(a.buildingOpen('torre'), true);
});

test('invalid level entry cannot spend a life or start the board', () => {
  const a = harness(), before = JSON.stringify(a.getSave());
  for (const [t, n] of [[1, 2], [1, 10], [2, 1], [0, 1], [1, 99]]) assert.equal(a.tryStartLevel(t, n), false);
  assert.equal(JSON.stringify(a.getSave()), before);
  assert.equal(a.state.game, null); assert.equal(a.writes.length, 0);
});

test('an invalid adjacent swap restores the exact pieces and spends no move or resource', async () => {
  const a = harness(), board = a.makeBoard(7, 5, rng(54));
  const legal = new Set(a.legalMoves(board, 7).map(pair => pair.join(',')));
  let pair;
  for (let i = 0; i < 49 && !pair; i++) for (const j of [i % 7 < 6 ? i + 1 : -1, i + 7 < 49 ? i + 7 : -1]) {
    if (j >= 0 && !legal.has([i, j].join(','))) { pair = [i, j]; break; }
  }
  assert.ok(pair);
  const g = {board, size: 7, run: 0, paused: false, busy: false, done: false, selection: null, moves: 22, score: 0, progress: 0};
  a.state.screen = 'game'; a.state.game = g;
  vm.runInContext('renderPieces=()=>{}; resetHint=()=>{}; setTip=()=>{};', a.context);
  const before = snapshot(board), refs = board.slice(), resources = JSON.stringify(a.getSave());
  assert.equal(await a.attemptSwap(...pair), false);
  assert.deepEqual(snapshot(board), before);
  assert.ok(board.every((p, i) => p === refs[i]));
  assert.equal(g.moves, 22); assert.equal(g.score, 0); assert.equal(g.progress, 0); assert.equal(g.busy, false);
  assert.equal(JSON.stringify(a.getSave()), resources); assert.equal(a.writes.length, 0);
  assert.equal(await a.attemptSwap(6, 7), false, 'row wrapping is not an adjacent swap');
  assert.equal(await a.attemptSwap(-1, 0), false);
});

test('the boss dialog spends nothing until confirmation and a double confirmation spends once', () => {
  const a = harness(); fillWins(a, 1, 9);
  vm.runInContext('showModal=config=>globalThis.lastModal=config; closeModal=()=>{}; startBoard=config=>{state.screen="game";state.game={done:false,config};};', a.context);
  a.requestLevel(1, 10);
  assert.equal(a.getSave().lives, 5); assert.equal(a.writes.length, 0); assert.equal(a.state.game, null);
  const enter = a.context.lastModal.actions[0].onClick;
  enter(); enter();
  assert.equal(a.getSave().lives, 4); assert.equal(a.writes.length, 1);
  assert.equal(a.state.game.config.t, 1); assert.equal(a.state.game.config.n, 10);
});

test('a completed campaign attempt grants progression once and replay does not repeat first-win gems', () => {
  const a = harness();
  vm.runInContext('showModal=()=>{};', a.context);
  const attempt = () => ({mode: 'campaign', t: 1, n: 1, goal: 500, progress: 500, score: 500, moves: 3, done: false});
  a.state.game = attempt(); a.finishBoard(true);
  assert.equal(a.getSave().stars[1][1], 1); assert.equal(a.getSave().gems, 26);
  assert.equal(a.getSave().stats.released, 1); assert.equal(a.getSave().bestScores['1_1'], 500);
  assert.equal(a.levelOpen(1, 2), true);
  const first = JSON.stringify(a.getSave()), writes = a.writes.length;
  a.finishBoard(true);
  assert.equal(JSON.stringify(a.getSave()), first); assert.equal(a.writes.length, writes);
  a.state.game = attempt(); a.finishBoard(true);
  assert.equal(a.getSave().gems, 26); assert.equal(a.getSave().stats.released, 1);
  assert.ok(a.getSave().coins > JSON.parse(first).coins, 'replaying still earns the advertised honey');
});

test('the teaching board has no automatic match and teaches a four-piece ray with swap 17–24', () => {
  const a = harness();
  for (let attempt = 0; attempt < 20; attempt++) {
    const board = a.teachingBoard(7, 5);
    assert.equal(a.matchedCells(board, 7).length, 0);
    assert.ok(a.legalMoves(board, 7).some(([i, j]) => i === 17 && j === 24));
    [board[17], board[24]] = [board[24], board[17]];
    const creation = a.powerCreation(board, 7, a.runGroups(board, 7), [24, 17]);
    assert.deepEqual(plain(creation), {index: 24, color: 0, power: 'row'});
  }
});

test('daily dates produce reproducible seeds and different initial boards', () => {
  const a = harness(), one = a.dailyConfig('2026-10-21'), again = a.dailyConfig('2026-10-21'), two = a.dailyConfig('2026-10-22');
  assert.deepEqual(plain(one), plain(again));
  assert.notEqual(one.seed, two.seed);
  const first = a.makeBoard(one.size, one.colors, a.seededRandom(one.seed));
  const repeat = a.makeBoard(again.size, again.colors, a.seededRandom(again.seed));
  const other = a.makeBoard(two.size, two.colors, a.seededRandom(two.seed));
  assert.deepEqual(paintSignature(first), paintSignature(repeat));
  assert.notDeepEqual(paintSignature(first), paintSignature(other));
});

test('daily play uses identical refills and cascades when the date and decisions match', async () => {
  const a = harness(), b = harness(); noPaint(a); noPaint(b);
  a.startBoard(a.dailyConfig('2026-10-21')); b.startBoard(b.dailyConfig('2026-10-21'));
  assert.deepEqual(paintSignature(a.state.game.board), paintSignature(b.state.game.board));
  for (let turn = 0; turn < 5 && !a.state.game.done; turn++) {
    const move = a.legalMoves(a.state.game.board, 7)[0];
    assert.equal(await a.attemptSwap(...move), true);
    assert.equal(await b.attemptSwap(...move), true);
    assert.deepEqual(paintSignature(a.state.game.board), paintSignature(b.state.game.board));
    assert.equal(a.state.game.score, b.state.game.score);
    assert.equal(a.state.game.progress, b.state.game.progress);
    assert.equal(a.state.game.moves, b.state.game.moves);
    assert.equal(a.state.game.done, b.state.game.done);
  }
});

test('the daily challenge starts without a life charge even at zero lives', () => {
  const a = harness(); noPaint(a); a.getSave().lives = 0;
  const timestamp = a.getSave().livesAt;
  a.startDaily();
  assert.equal(a.state.screen, 'game'); assert.equal(a.state.game.mode, 'daily');
  assert.equal(a.state.game.goal, 1500); assert.equal(a.state.game.moves, 20);
  assert.equal(a.getSave().lives, 0); assert.equal(a.getSave().livesAt, timestamp);
  assert.equal(a.writes.length, 0);
});

test('daily completion cannot be awarded below its goal and grants one reward per date', () => {
  const a = harness(); noPaint(a); fillWins(a, 1, 2);
  const campaign = JSON.stringify({stars: a.getSave().stars, bestScores: a.getSave().bestScores, released: a.getSave().stats.released});
  const fixture = (key, score = 1600) => ({...a.dailyConfig(key), progress: score, score, done: false});
  a.state.game = fixture('2026-10-21', 1499);
  a.finishBoard(true);
  assert.equal(a.state.game.done, false); assert.equal(a.writes.length, 0);
  assert.equal(a.getSave().coins, 0); assert.equal(a.getSave().gems, 25);
  a.state.game.progress = 1500; a.state.game.score = 1600; a.finishBoard(true);
  assert.deepEqual(plain(a.getSave().dailyChallenge), {key: '2026-10-21', won: true, best: 1600});
  assert.equal(a.getSave().coins, 40); assert.equal(a.getSave().gems, 30);
  const writes = a.writes.length; a.finishBoard(true); assert.equal(a.writes.length, writes);
  a.state.game = fixture('2026-10-21', 1900); a.finishBoard(true);
  assert.equal(a.getSave().dailyChallenge.best, 1900);
  assert.equal(a.getSave().coins, 40); assert.equal(a.getSave().gems, 30);
  a.state.game = fixture('2026-10-21', 100); a.finishBoard(false);
  assert.equal(a.getSave().dailyChallenge.won, true); assert.equal(a.getSave().dailyChallenge.best, 1900);
  assert.equal(a.getSave().coins, 40); assert.equal(a.getSave().gems, 30);
  a.state.game = fixture('2026-10-22'); a.finishBoard(true);
  assert.equal(a.getSave().coins, 80); assert.equal(a.getSave().gems, 35);
  assert.equal(JSON.stringify({stars: a.getSave().stars, bestScores: a.getSave().bestScores, released: a.getSave().stats.released}), campaign);
});

test('old saves receive valid daily defaults and malformed daily data is sanitized', () => {
  const a = harness();
  assert.deepEqual(plain(a.normalizeSave({stars: {1: {1: 1}}}).dailyChallenge), {key: '', won: false, best: 0});
  assert.deepEqual(plain(a.normalizeSave({dailyChallenge: null}).dailyChallenge), {key: '', won: false, best: 0});
  assert.deepEqual(plain(a.normalizeSave({dailyChallenge: {key: 4, won: 'true', best: -5}}).dailyChallenge), {key: '', won: false, best: 0});
  assert.deepEqual(plain(a.normalizeSave({dailyChallenge: {key: '2026-10-21 unwanted', won: true, best: 1500.9}}).dailyChallenge), {key: '2026-10-21', won: true, best: 1500});
});

test('a cancelled asynchronous turn cannot change a newly started game or award old progress', async () => {
  const a = harness(); noPaint(a); a.startBoard(a.dailyConfig('2026-10-21'));
  const pending = []; a.context.setTimeout = fn => { pending.push(fn); return pending.length; };
  const old = a.state.game, move = a.legalMoves(old.board, old.size)[0];
  const turn = a.attemptSwap(...move);
  assert.equal(pending.length, 1);
  a.startBoard(a.dailyConfig('2026-10-22'));
  const next = a.state.game, board = snapshot(next.board), resources = JSON.stringify(a.getSave());
  pending.shift()();
  assert.equal(await turn, false);
  assert.equal(a.state.game, next); assert.notEqual(next, old);
  assert.deepEqual(snapshot(next.board), board);
  assert.equal(next.moves, 20); assert.equal(next.score, 0); assert.equal(next.progress, 0);
  assert.equal(JSON.stringify(a.getSave()), resources); assert.equal(a.writes.length, 0);
});

test('a campaign victory refunds its reserved life once while failures and abandonment keep the cost', () => {
  const a = harness(); noPaint(a); a.getSave().lives = 3;
  assert.equal(a.tryStartLevel(1, 1), true);
  assert.equal(a.getSave().lives, 2, 'entry reserves one life');
  const won = a.state.game; won.progress = won.goal; won.score = won.goal;
  a.finishBoard(true);
  assert.equal(a.getSave().lives, 3, 'victory returns the reserved life');
  assert.equal(won.lifeRefunded, true);
  const saved = JSON.stringify(a.getSave()), writes = a.writes.length;
  a.finishBoard(true);
  assert.equal(a.getSave().lives, 3);
  assert.equal(JSON.stringify(a.getSave()), saved); assert.equal(a.writes.length, writes);
  a.stopBoard();
  assert.equal(a.tryStartLevel(1, 1), true); assert.equal(a.getSave().lives, 2);
  a.state.game.moves = 0; a.finishBoard(false);
  assert.equal(a.getSave().lives, 2, 'a failed expedition consumes the reserved life');
  assert.notEqual(a.state.game.lifeRefunded, true);
  a.stopBoard();
  assert.equal(a.tryStartLevel(1, 1), true); assert.equal(a.getSave().lives, 1);
  a.stopBoard();
  assert.equal(a.getSave().lives, 1, 'abandoning an expedition consumes its reserved life');
});

test('victory life refunds respect the normal and dock caps after regeneration during a game', () => {
  for (const dock of [false, true]) {
    const a = harness(); noPaint(a);
    if (dock) a.getSave().buildings.muelle = true;
    const cap = a.livesMax(); a.getSave().lives = cap;
    assert.equal(a.tryStartLevel(1, 1), true); assert.equal(a.getSave().lives, cap - 1);
    a.setNow(a.now() + a.constants.LIFE_MS); a.syncLives(); assert.equal(a.getSave().lives, cap);
    const g = a.state.game; g.progress = g.goal; g.score = g.goal; a.finishBoard(true);
    assert.equal(a.getSave().lives, cap);
    assert.equal(a.getSave().livesAt, a.now());
    assert.equal(g.lifeRefunded, true);
  }
});
