'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
assert.ok(script.includes('window.SugarClash='), 'Tests load the actual Renacer runtime');
const runtime = script.slice(0, script.indexOf('window.SugarClash='));

function rng(seed) {
  return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
}
function plain(value) { return JSON.parse(JSON.stringify(value)); }
function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function harness() {
  const storage = new Map(), writes = [], nodes = new Map();
  let now = Date.UTC(2026, 9, 23, 12);
  class Clock extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  class Node {
    constructor(id = '') {
      this.id = id; this.children = []; this.parent = null; this.dataset = {};
      this.classes = new Set(); this.attributes = {}; this._html = '';
      this.style = {setProperty(key, value) { this[key] = value; }};
      this.classList = {
        add: (...names) => names.forEach(name => this.classes.add(name)),
        remove: (...names) => names.forEach(name => this.classes.delete(name)),
        toggle: (name, force) => {
          const enabled = force === undefined ? !this.classes.has(name) : force;
          if (enabled) this.classes.add(name); else this.classes.delete(name);
          return enabled;
        },
        contains: name => this.classes.has(name)
      };
    }
    set className(value) { this.classes = new Set(value.split(/\s+/).filter(Boolean)); }
    get className() { return [...this.classes].join(' '); }
    set innerHTML(value) { this._html = value; this.children = []; }
    get innerHTML() { return this._html; }
    appendChild(child) { child.parent = this; this.children.push(child); return child; }
    prepend(child) { child.parent = this; this.children.unshift(child); }
    remove() { if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this); }
    setAttribute(key, value) { this.attributes[key] = value; }
    contains(node) { return !!node && (node === this || this.children.some(child => child.contains(node))); }
    querySelectorAll(selector) {
      const selectors = selector.split(',').map(part => part.trim());
      const matches = node => selectors.some(part => {
        const cls = part.match(/^\.([\w-]+)/)?.[1];
        if (cls && !node.classes.has(cls)) return false;
        const attr = part.match(/\[data-([\w-]+)="([^"]+)"\]/);
        if (attr && String(node.dataset[attr[1]]) !== attr[2]) return false;
        return !!cls || !!attr;
      });
      return this.children.flatMap(child => [...(matches(child) ? [child] : []), ...child.querySelectorAll(selector)]);
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
    focus() {}
  }
  function node(id) { if (!nodes.has(id)) nodes.set(id, new Node(id)); return nodes.get(id); }
  const math = Object.create(Math); math.random = rng(20261023);
  const context = vm.createContext({
    Date: Clock, Math: math, console, Set, Map, JSON,
    document: {
      hidden: false, activeElement: null, addEventListener() {},
      createElement: () => new Node(),
      getElementById: id => ['screen-game', 'board'].includes(id) ? node(id) : null
    },
    window: {addEventListener() {}}, navigator: {}, performance: {now: () => now},
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem(key, value) { storage.set(key, value); writes.push([key, value]); }
    },
    matchMedia: () => ({matches: true}),
    setTimeout(fn, ms) { if (ms === 0) fn(); return 1; },
    clearTimeout() {}, setInterval: () => 1, clearInterval() {},
    requestAnimationFrame: () => 1, cancelAnimationFrame() {}
  });
  vm.runInContext(runtime + `
    const originalRenderGame=renderGame,originalRenderPieces=renderPieces;
    showScreen=name=>{state.screen=name;};
    renderGame=()=>{};renderPieces=()=>{};updateGameHUD=()=>{};bindBoard=()=>{};
    resetHint=()=>{};setTip=()=>{};sound=()=>{};showCombo=()=>{};
    feedbackHit=()=>{};feedbackCombo=()=>{};feedbackVictory=()=>{};
    showModal=config=>{state.modal=true;globalThis.lastModal=config;};
    closeModal=()=>{state.modal=false;};toast=()=>{};
    globalThis.api={encounterConfig,makeRestoration,restorationStep,restorationTargets,campaignWon,
      newPiece,makeBoard,runGroups,matchedCells,legalMoves,powerCreation,canCombine,expandEffects,gravity,reshuffle,pulseNeed,
      levelConfig,startBoard,resolveBoard,attemptSwap,useHammer,shuffleGame,stopBoard,finishBoard,
      dailyConfig,state,getSave:()=>save,
      paint:()=>{originalRenderGame();originalRenderPieces();}};
  `, context);
  context.api.getSave().tutorialSeen = true;
  return {...context.api, context, storage, writes, nodes, setNow: value => now = value};
}

function boardOf(a, size = 5) {
  return Array.from({length: size * size}, (_, i) => a.newPiece((Math.floor(i / size) + i % size) % 5));
}
function encounter(cells, kind = 'direct', hp = 1, extra = {}) {
  return {pattern: {id: 'test-path', kind: 'path', cells, hp}, rule: {kind, ...extra}};
}
function restoration(a, cells, kind = 'direct', hp = 1, extra = {}) {
  return a.makeRestoration(encounter(cells, kind, hp, extra), 5);
}
function restoredIndices(value) { return Array.from(value.cells).filter(cell => cell.restored).map(cell => cell.index).sort((a, b) => a - b); }
function cell(value, index) { return value.cells.find(mark => mark.index === index); }
function completeRestoration(g) {
  for (const mark of g.restoration.cells) { mark.hp = 0; mark.restored = true; }
  g.restoration.restored = g.restoration.total;
}
function game(a, cells = [12], kind = 'direct', hp = 1) {
  a.startBoard({...a.levelConfig(1, 1), size: 5, colors: 5, type: 'rescue', goal: 100000, moves: 20});
  const g = a.state.game;
  g.board = boardOf(a); g.ice = Array(25).fill(0); g.encounter = encounter(cells, kind, hp);
  g.restoration = a.makeRestoration(g.encounter, 5);
  return g;
}
function stableRefill(a, board, cleared) {
  for (let seed = 1; seed < 200; seed++) {
    const copy = board.map(piece => piece && {...piece});
    for (const i of cleared) copy[i] = null;
    a.gravity(copy, 5, 5, rng(seed));
    if (!a.matchedCells(copy, 5).length) return rng(seed);
  }
  throw new Error('The wave fixture needs a refill without accidental cascades');
}
function playthroughEvaluator(a) {
  const source = fs.readFileSync(path.join(__dirname, '..', 'scripts', 'renacer-playthrough.cjs'), 'utf8');
  const start = source.indexOf('function evaluate('), end = source.indexOf('\nasync function main()', start);
  assert.ok(start >= 0 && end > start, 'Use the actual playthrough evaluator');
  const context = vm.createContext({a});
  vm.runInContext(source.slice(start, end) + '\n;globalThis.evaluateMove=evaluate;', context);
  return context.evaluateMove;
}

test('campaign encounters provide bounded fixed marks and a known restoration rule', () => {
  const a = harness();
  for (let t = 1; t <= 8; t++) for (let n = 1; n <= 10; n++) {
    const config = a.encounterConfig(t, n), before = JSON.stringify(config);
    const value = a.makeRestoration(config, 7);
    assert.ok(['path', 'water', 'garden', 'home'].includes(config.pattern.kind));
    assert.ok(['direct', 'adjacent', 'power', 'ordered', 'color', 'tide'].includes(config.rule.kind));
    assert.ok(value.total > 0 && value.total <= 49);
    assert.equal(value.cells.length, value.total);
    assert.equal(new Set(value.cells.map(mark => mark.index)).size, value.total);
    assert.ok(value.cells.every(mark => Number.isInteger(mark.index) && mark.index >= 0 && mark.index < 49));
    assert.ok(value.cells.every(mark => [1, 2].includes(mark.hp) && mark.hp === mark.maxHp && mark.restored === false));
    assert.equal(value.restored, 0); assert.equal(value.turn, 0);
    assert.equal(JSON.stringify(config), before);
  }
});

test('direct hits are pure and restore fixed positions, with bounded orthogonal bonus', () => {
  const a = harness(), board = deepFreeze(boardOf(a));
  const current = deepFreeze(restoration(a, [12, 24])), before = JSON.stringify(current), boardBefore = JSON.stringify(board);
  const result = a.restorationStep(current, board, 5, [12, 12, 13], {protectedIndex: 7});
  assert.deepEqual(restoredIndices(result.state), [12]);
  assert.equal(cell(result.state, 24).hp, 1);
  assert.equal(result.state.restored, 1);
  assert.deepEqual(Array.from(result.restored), [12]);
  assert.deepEqual(new Set(result.bonus), new Set([11, 17]));
  assert.equal(JSON.stringify(current), before); assert.equal(JSON.stringify(board), boardBefore);
  assert.notEqual(result.state, current);
});

test('two-hit marks take at most one damage per wave and never emit a second completion', () => {
  const a = harness(), board = boardOf(a), first = restoration(a, [12], 'direct', 2);
  const hit = a.restorationStep(first, board, 5, [12, 12, 12], {powered: [12], pulse: true});
  assert.equal(cell(hit.state, 12).hp, 1); assert.equal(hit.state.restored, 0);
  assert.deepEqual(Array.from(hit.restored), []); assert.deepEqual(Array.from(hit.bonus), []);
  const completed = a.restorationStep(hit.state, board, 5, [12]);
  assert.equal(cell(completed.state, 12).hp, 0); assert.equal(completed.state.restored, 1);
  const repeated = a.restorationStep(completed.state, board, 5, [12]);
  assert.equal(repeated.state.restored, 1);
  assert.deepEqual(Array.from(repeated.restored), []); assert.deepEqual(Array.from(repeated.bonus), []);
});

test('adjacent restoration accepts orthogonal clears but rejects diagonals and row wrapping', () => {
  const a = harness(), board = boardOf(a);
  assert.deepEqual(restoredIndices(a.restorationStep(restoration(a, [12], 'adjacent'), board, 5, [7]).state), [12]);
  assert.deepEqual(restoredIndices(a.restorationStep(restoration(a, [12], 'adjacent'), board, 5, [6]).state), []);
  assert.deepEqual(restoredIndices(a.restorationStep(restoration(a, [5], 'adjacent'), board, 5, [4]).state), []);
  const corner = a.restorationStep(restoration(a, [0]), board, 5, [0]);
  assert.deepEqual(new Set(corner.bonus), new Set([1, 5]));
});

test('power-only marks reject a plain clear but accept an actual powered hit or a pulsed clear', () => {
  const a = harness(), board = boardOf(a), current = restoration(a, [12], 'power');
  assert.equal(a.restorationStep(current, board, 5, [12]).state.restored, 0);
  assert.equal(a.restorationStep(current, board, 5, [12], {powered: [12]}).state.restored, 1);
  assert.equal(a.restorationStep(current, board, 5, [12], {pulse: true}).state.restored, 1);
  assert.equal(a.restorationStep(current, board, 5, [7], {pulse: true}).state.restored, 0);
});

test('ordered restoration completes only the first pending stage in a wave', () => {
  const a = harness(), board = boardOf(a), current = restoration(a, [18, 6, 12], 'ordered');
  const first = a.restorationStep(current, board, 5, [6, 12, 18]);
  assert.deepEqual(restoredIndices(first.state), [18]);
  assert.equal(a.restorationStep(first.state, board, 5, [12]).state.restored, 1);
  const second = a.restorationStep(first.state, board, 5, [6, 12]);
  assert.deepEqual(restoredIndices(second.state), [6, 18]);
  assert.deepEqual(restoredIndices(a.restorationStep(second.state, board, 5, [12]).state), [6, 12, 18]);
});

test('color restoration accepts the requested color on or beside a mark, plus power or pulse', () => {
  const a = harness(), board = boardOf(a), current = restoration(a, [12], 'color', 1, {color: 3});
  board[12].color = 2; board[7].color = 3; board[11].color = 1;
  assert.equal(a.restorationStep(current, board, 5, [12]).state.restored, 0);
  assert.equal(a.restorationStep(current, board, 5, [7]).state.restored, 1);
  assert.equal(a.restorationStep(current, board, 5, [11]).state.restored, 0);
  assert.equal(a.restorationStep(current, board, 5, [12], {powered: [12]}).state.restored, 1);
  assert.equal(a.restorationStep(current, board, 5, [12], {pulse: true}).state.restored, 1);
});

test('tide selects its sorted active row without advancing the turn during a wave', () => {
  const a = harness(), board = boardOf(a), current = restoration(a, [17, 2, 10], 'tide');
  const first = a.restorationStep(current, board, 5, [2, 10, 17]);
  assert.deepEqual(restoredIndices(first.state), [2]); assert.equal(first.state.turn, 0);
  assert.equal(a.restorationStep(first.state, board, 5, [10, 17]).state.restored, 1);
  const nextTurn = {...first.state, turn: 1};
  const second = a.restorationStep(nextTurn, board, 5, [10, 17]);
  assert.deepEqual(restoredIndices(second.state), [2, 10]); assert.equal(second.state.turn, 1);
});

test('chained rays and bombs restore the actual powered extension, once per mark', () => {
  const a = harness(), board = boardOf(a);
  board[12].power = 'row'; board[14].power = 'bomb'; board[8].power = 'col';
  const effect = a.expandEffects(board, 5, [12]);
  const result = a.restorationStep(restoration(a, [0, 3, 8, 10, 14, 23], 'power'), board, 5, effect.cells, {powered: effect.cells});
  assert.deepEqual(restoredIndices(result.state), [3, 8, 10, 14, 23]);
  assert.equal(result.state.restored, 5); assert.equal(cell(result.state, 0).hp, 1);
});

test('a prism restores only the color footprint reached by its actual power', () => {
  const a = harness(), board = boardOf(a);
  board[0] = a.newPiece(6, 'prism');
  const targets = board.flatMap((piece, i) => piece.color === 2 ? [i] : []);
  const effect = a.expandEffects(board, 5, [0, ...targets], -1, 2);
  const result = a.restorationStep(restoration(a, [2, 6, 24], 'power'), board, 5, effect.cells, {powered: effect.cells});
  assert.deepEqual(restoredIndices(result.state), [2, 6]);
  assert.equal(cell(result.state, 24).hp, 1);
});

test('a newly created power is protected from restoration clearing and neighbor bonus', () => {
  const a = harness(), board = boardOf(a);
  for (const i of [10, 11, 12, 13]) board[i].color = 0;
  board[11].power = 'row';
  const effect = a.expandEffects(board, 5, [10, 11, 12, 13], 11);
  const result = a.restorationStep(restoration(a, [10, 11]), board, 5, effect.cells, {protectedIndex: 11});
  assert.deepEqual(restoredIndices(result.state), [10]);
  assert.ok(!Array.from(result.bonus).includes(11));
  assert.equal(cell(result.state, 11).hp, 1);
});

test('real wave resolution keeps marks fixed while gravity moves pieces and bonus clears neighbors', async () => {
  const a = harness(), g = game(a, [12, 7]);
  for (const i of [11, 12, 13]) g.board[i].color = 3;
  const groups = a.runGroups(g.board, 5), oldPiece = g.board[12];
  g.rng = stableRefill(a, g.board, [7, 11, 12, 13, 17]);
  await a.resolveBoard(g, groups);
  assert.equal(g.chain, 1);
  assert.deepEqual(restoredIndices(g.restoration), [12]);
  assert.equal(cell(g.restoration, 7).hp, 1, 'bonus does not damage a second mark in the same wave');
  assert.ok(!g.board.includes(oldPiece)); assert.ok(g.board.every(Boolean));
  const before = JSON.stringify(g.restoration);
  a.getSave().boosters.shuffle = 1; a.shuffleGame();
  assert.equal(JSON.stringify(g.restoration), before, 'shuffling pieces never moves restoration marks');
});

test('a real refill cascade can restore another fixed mark in its later wave', async () => {
  const a = harness(), g = game(a, [10, 0]);
  for (const i of [10, 11, 12]) g.board[i].color = 4;
  const refills = [4, 3, 2, 2, 2, 4, 0, 1, 2]; let next = 0;
  g.rng = () => ((refills[next++] ?? 1) + .1) / 5;
  await a.resolveBoard(g, a.runGroups(g.board, 5));
  assert.equal(g.chain, 2);
  assert.deepEqual(restoredIndices(g.restoration), [0, 10]);
  assert.equal(g.restoration.restored, 2);
});

test('real power chains feed their extended footprint to power-only restoration', async () => {
  const a = harness(), g = game(a, [3, 8, 10, 14, 23], 'power');
  g.board[12].power = 'row'; g.board[14].power = 'bomb'; g.board[8].power = 'col';
  await a.resolveBoard(g, [], [], [12]);
  assert.equal(g.restoration.restored, g.restoration.total);
  assert.deepEqual(restoredIndices(g.restoration), [3, 8, 10, 14, 23]);
});

test('combining two prisms gives the full board a powered hit, including power-only marks', async () => {
  const a = harness(), g = game(a, [12, 24], 'power');
  g.board[0] = a.newPiece(6, 'prism'); g.board[1] = a.newPiece(6, 'prism');
  g.rng = stableRefill(a, g.board, Array.from({length: 25}, (_, i) => i));
  assert.equal(await a.attemptSwap(0, 1), true);
  assert.equal(g.chain, 1);
  assert.deepEqual(restoredIndices(g.restoration), [12, 24]);
});

test('a single prism keeps its color footprint instead of powering unrelated cells', async () => {
  const a = harness(), g = game(a, [2, 6, 24], 'power');
  g.board[0] = a.newPiece(6, 'prism'); g.board[1].color = 2;
  g.rng = stableRefill(a, g.board, [0, 1, 2, 3, 5, 6, 7, 10, 11, 19, 23]);
  assert.equal(await a.attemptSwap(0, 1), true);
  assert.equal(g.chain, 1);
  assert.deepEqual(restoredIndices(g.restoration), [2, 6]);
  assert.equal(cell(g.restoration, 24).hp, 1);
});

test('two prisms reached by a partial ray chain do not imply a full-board powered sweep', async () => {
  const a = harness(), g = game(a, [12, 24], 'power');
  g.board[10].power = 'row'; g.board[11] = a.newPiece(6, 'prism'); g.board[13] = a.newPiece(6, 'prism');
  const effect = a.expandEffects(g.board, 5, [10]);
  assert.equal(Array.from(effect.triggered).filter(i => g.board[i]?.power === 'prism').length, 2);
  assert.ok(effect.cells.length < g.board.length);
  g.rng = stableRefill(a, g.board, [...new Set([...effect.cells, 7, 17])]);
  await a.resolveBoard(g, [], [], [10]);
  assert.equal(g.chain, 1);
  assert.deepEqual(restoredIndices(g.restoration), [12]);
  assert.equal(cell(g.restoration, 24).hp, 1);
});

test('a full-board cascade with two triggered prisms does not power ordinary matches outside their footprint', async () => {
  const a = harness(), g = game(a, [18], 'power');
  const colors = [0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 1, 1, 1, 1, 1, 2, 2, 4, 4, 4, 2, 2, 2, 2, 2];
  g.board = colors.map(color => a.newPiece(color));
  g.board[0].power = 'col'; g.board[1].power = 'col';
  g.board[5] = a.newPiece(6, 'prism'); g.board[6] = a.newPiece(6, 'prism');
  const groups = a.runGroups(g.board, 5), seeds = [...new Set(groups.flatMap(group => group.cells))];
  const effect = a.expandEffects(g.board, 5, seeds);
  const powered = a.expandEffects(g.board, 5, effect.triggered).cells;
  assert.equal(effect.cells.length, 25);
  assert.equal(Array.from(effect.triggered).filter(i => g.board[i]?.power === 'prism').length, 2);
  assert.equal(powered.length, 13); assert.ok(!Array.from(powered).includes(18));
  g.chain = 1; // A real refill wave does not create a new first-wave special.
  g.rng = stableRefill(a, g.board, effect.cells);
  await a.resolveBoard(g, groups, [], null, null, false);
  assert.equal(g.chain, 2);
  assert.equal(g.restoration.restored, 0);
  assert.equal(cell(g.restoration, 18).hp, 1);
});

test('campaign victory needs both the primary objective and every restoration mark', () => {
  const a = harness(), g = game(a, [12, 17]);
  g.progress = g.goal; g.score = g.goal;
  assert.equal(a.campaignWon(g), false); a.finishBoard(true);
  assert.equal(g.done, false); assert.equal(a.writes.length, 0);
  completeRestoration(g); g.progress = g.goal - 1;
  assert.equal(a.campaignWon(g), false); a.finishBoard(true);
  assert.equal(g.done, false); assert.equal(a.writes.length, 0);
  g.progress = g.goal;
  assert.equal(a.campaignWon(g), true); a.finishBoard(true);
  assert.equal(g.done, true); assert.ok(a.getSave().stars[1][1]);
  assert.equal(a.campaignWon({progress: 50, goal: 50}), true, 'legacy unit fixtures without restoration retain their primary gate');
});

test('rendering the actual game and piece layer cannot restore cells or write progress', () => {
  const a = harness(), g = game(a, [7, 12, 17]);
  const before = JSON.stringify({game: g, save: a.getSave()}), writes = a.writes.length;
  for (let pass = 0; pass < 3; pass++) a.paint();
  assert.equal(JSON.stringify({game: g, save: a.getSave()}), before);
  assert.equal(a.writes.length, writes);
  assert.ok(a.nodes.get('screen-game').innerHTML.includes('Tablero'));
});

test('earned restoration grants first-win progression once and replay does not repeat first rewards', () => {
  const a = harness(), first = game(a, [12]);
  first.progress = first.goal; first.score = first.goal; completeRestoration(first);
  a.finishBoard(true);
  const earned = plain(a.getSave()), writes = a.writes.length;
  a.finishBoard(true);
  assert.deepEqual(plain(a.getSave()), earned); assert.equal(a.writes.length, writes);
  const replay = game(a, [12]);
  replay.progress = replay.goal; replay.score = replay.goal; completeRestoration(replay);
  a.finishBoard(true);
  assert.equal(a.getSave().gems, earned.gems);
  assert.equal(a.getSave().stats.released, earned.stats.released);
  assert.deepEqual(plain(a.getSave().stars), earned.stars);
  assert.ok(a.getSave().coins > earned.coins, 'replay retains its advertised normal honey');
});

test('double activation of one continue handler charges only 25 gems and adds only five moves', () => {
  const a = harness(), g = game(a, [12]);
  a.getSave().gems = 100; g.moves = 0; a.finishBoard(false);
  const resume = a.context.lastModal.actions[0].onClick, lives = a.getSave().lives;
  resume();
  assert.equal(a.getSave().gems, 75); assert.equal(g.moves, 5);
  assert.equal(g.done, false); assert.equal(g.continued, true);
  const before = JSON.stringify({game: g, save: a.getSave()}), writes = a.writes.length;
  resume();
  assert.equal(JSON.stringify({game: g, save: a.getSave()}), before);
  assert.equal(a.writes.length, writes); assert.equal(a.getSave().lives, lives);
});

test('a stale continue handler cannot charge gems or change a replacement game', () => {
  const a = harness(), old = game(a, [12]);
  a.getSave().gems = 100; old.moves = 0; a.finishBoard(false);
  const stale = a.context.lastModal.actions[0].onClick;
  const next = game(a, [0, 24]);
  const before = JSON.stringify({game: next, save: a.getSave()}), writes = a.writes.length;
  stale();
  assert.equal(a.state.game, next); assert.equal(old.continued, false);
  assert.equal(JSON.stringify({game: next, save: a.getSave()}), before);
  assert.equal(a.writes.length, writes); assert.equal(a.getSave().gems, 100);
});

test('a cancelled wave cannot restore a new session or award the old objective', async () => {
  const a = harness(), old = game(a, [12]);
  for (const i of [11, 12, 13]) old.board[i].color = 3;
  const pending = [];
  a.context.setTimeout = fn => { pending.push(fn); return pending.length; };
  const turn = a.resolveBoard(old, a.runGroups(old.board, 5));
  assert.equal(pending.length, 1);
  const next = game(a, [0, 24]);
  const before = JSON.stringify({game: next, save: a.getSave()}), writes = a.writes.length;
  pending.shift()(); await turn;
  assert.equal(a.state.game, next);
  assert.equal(JSON.stringify({game: next, save: a.getSave()}), before);
  assert.equal(a.writes.length, writes);
  assert.equal(next.restoration.restored, 0); assert.equal(next.progress, 0);
});

test('invalid swaps do not advance tide and a valid turn advances it only once across cascades', async () => {
  const a = harness(), g = game(a, [0, 10, 20], 'tide');
  const valid = a.legalMoves(g.board, 5), keys = new Set(valid.map(pair => pair.join(',')));
  let invalid;
  for (let i = 0; i < 25 && !invalid; i++) for (const j of [i % 5 < 4 ? i + 1 : -1, i + 5 < 25 ? i + 5 : -1]) {
    if (j >= 0 && !keys.has([i, j].join(','))) { invalid = [i, j]; break; }
  }
  assert.ok(invalid);
  assert.equal(await a.attemptSwap(...invalid), false);
  assert.equal(g.restoration.turn, 0); assert.equal(g.moves, 20);
  g.board = a.makeBoard(5, 5, rng(49));
  const move = a.legalMoves(g.board, 5)[0];
  assert.equal(await a.attemptSwap(...move), true);
  assert.equal(g.restoration.turn, 1); assert.equal(g.moves, 19);
  const turn = g.restoration.turn, moves = g.moves;
  await a.useHammer(0);
  assert.equal(g.restoration.turn, turn, 'a hammer without a spent move does not change the active tide row');
  assert.equal(g.moves, moves);
});

test('daily and zen stay outside campaign restoration and do not unlock campaign rewards', async () => {
  const a = harness(); a.getSave().lives = 0;
  a.startBoard(a.dailyConfig('2026-10-23'));
  const daily = a.state.game;
  assert.ok(!daily.restoration); assert.equal(a.getSave().lives, 0);
  daily.progress = daily.goal; daily.score = daily.goal; a.finishBoard(true);
  assert.equal(a.getSave().coins, 40); assert.equal(a.getSave().gems, 30);
  assert.deepEqual(plain(a.getSave().stars), {}); assert.equal(a.getSave().stats.released, 0);
  a.startBoard({mode: 'zen', t: 1, n: 1});
  const zen = a.state.game;
  assert.ok(!zen.restoration); assert.equal(zen.moves, Infinity); assert.equal(zen.goal, Infinity);
  const move = a.legalMoves(zen.board, zen.size)[0];
  assert.equal(await a.attemptSwap(...move), true);
  assert.equal(zen.done, false); assert.ok(zen.score > 0); assert.ok(!zen.restoration);
  const resources = {coins: a.getSave().coins, gems: a.getSave().gems, lives: a.getSave().lives};
  a.finishBoard(false);
  assert.equal(a.getSave().records.zen, zen.score);
  assert.deepEqual({coins: a.getSave().coins, gems: a.getSave().gems, lives: a.getSave().lives}, resources);
  assert.deepEqual(plain(a.getSave().stars), {});
});

test('playthrough evaluation considers visible restoration without mutating the game or reading refill RNG', () => {
  const a = harness(), g = game(a, [12, 17], 'power');
  g.board = a.makeBoard(5, 5, rng(71)); g.pulse = a.pulseNeed();
  let refillCalls = 0;
  g.rng = () => { refillCalls++; throw new Error('Evaluation must not look ahead at falling pieces'); };
  const evaluate = playthroughEvaluator(a);
  const before = JSON.stringify({game: g, save: a.getSave()}), refs = g.board.slice();
  const moves = a.legalMoves(g.board, 5); assert.ok(moves.length);
  for (const move of moves) assert.ok(Number.isFinite(evaluate(g, move)));
  assert.equal(JSON.stringify({game: g, save: a.getSave()}), before);
  assert.ok(g.board.every((piece, i) => piece === refs[i]));
  assert.equal(refillCalls, 0); assert.equal(g.restoration.turn, 0); assert.equal(a.writes.length, 0);
});

test('the bot values a double-prism sweep against every remaining power-only mark', () => {
  const a = harness(), g = game(a, [12, 24], 'power');
  g.board[0] = a.newPiece(6, 'prism'); g.board[1] = a.newPiece(6, 'prism');
  const evaluate = playthroughEvaluator(a), before = JSON.stringify(g);
  assert.equal(evaluate(g, [0, 1]), 25 + 2 * 40 + 2 * 60);
  assert.equal(JSON.stringify(g), before);
});
