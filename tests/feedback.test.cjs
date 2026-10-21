'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const match = script.match(/\/\* FEEDBACK_START \*\/([\s\S]*?)\/\* FEEDBACK_END \*\//);
assert.ok(match, 'tests load the actual inline feedback module');
const source = match[1];
function realFunction(name, nextName) {
  const start = script.indexOf('function ' + name + '(');
  const end = script.indexOf('\nfunction ' + nextName + '(', start);
  assert.ok(start >= 0 && end > start, `real ${name} lifecycle hook exists`);
  return script.slice(start, end);
}
const lifecycle = realFunction('stopBoard', 'startBoard') + '\n' + realFunction('showScreen', 'navigate');

function createHarness(reduced = false) {
  const nodes = new Map(), pieces = new Map(), timers = new Map(), listeners = new Map();
  const oscillators = [], clearedIntervals = [];
  let now = 0, timerSequence = 0, rngCalls = 0, frameCalls = 0;
  class Node {
    constructor(id = '') {
      this.id = id; this.children = []; this.parent = null; this.dataset = {}; this.classes = new Set();
      this.rect = { left: 45, top: 180, width: 36, height: 36 };
      this.style = { setProperty(key, value) { this[key] = value; } };
      this.classList = {
        add: name => this.classes.add(name), remove: name => this.classes.delete(name),
        toggle: (name, force) => {
          const on = force === undefined ? !this.classes.has(name) : force;
          if (on) this.classes.add(name); else this.classes.delete(name); return on;
        }
      };
      this.offsetWidth = 36; this.attributes = {};
    }
    set className(value) { this.classes = new Set(value.split(/\s+/).filter(Boolean)); }
    get className() { return [...this.classes].join(' '); }
    appendChild(child) { child.parent = this; this.children.push(child); return child; }
    remove() { if (this.parent) this.parent.children = this.parent.children.filter(child => child !== this); this.parent = null; }
    get childElementCount() { return this.children.length; }
    get firstElementChild() { return this.children[0]; }
    getBoundingClientRect() { return this.rect; }
    setAttribute(key, value) { this.attributes[key] = value; }
    replaceChildren(...children) { this.children = children; for (const child of children) child.parent = this; }
    querySelector(selector) {
      if (this.id === 'board') {
        const id = selector.match(/data-id="(\d+)"/)?.[1];
        if (id) return selector.includes('.candy') ? pieces.get(Number(id))?.children[0] : pieces.get(Number(id));
      }
      if (this.id === 'modal-root' && selector === '.modal') return node('modal');
      if (this.id === 'modal' && selector === '.modal-art') return node('modal-art');
      if (this.id === 'modal' && selector === 'h2') return node('modal-title');
      return null;
    }
    closest(selector) { return this.id === 'board' && selector === '.board-frame' ? node('board-frame') : null; }
  }
  function node(id) { if (!nodes.has(id)) nodes.set(id, new Node(id)); return nodes.get(id); }
  for (let i = 1; i <= 12; i++) {
    const piece = new Node('piece-' + i); piece.rect.left += i * 12;
    piece.appendChild(new Node('candy-' + i)); pieces.set(i, piece);
  }
  node('score-value').rect = { left: 250, top: 90, width: 75, height: 20 };
  const body = new Node('body');
  const document = {
    hidden: false, body,
    createElement() { return new Node(); },
    querySelectorAll(selector) { return selector === '.screen' ? [node('screen-home'), node('screen-game')] : []; },
    addEventListener(type, callback) {
      if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(callback);
    },
    dispatch(type) { for (const callback of listeners.get(type) || []) callback(); }
  };
  class AudioContext {
    constructor() { this.state = 'running'; this.destination = {}; }
    get currentTime() { return now / 1000; }
    createOscillator() {
      const oscillator = {
        frequency: { setValueAtTime(frequency) { assert.ok(Number.isFinite(frequency) && frequency > 0); } },
        connect() {}, disconnect() { this.disconnected = true; }, start() {},
        stop(at) { if (at === undefined) this.cancelled = true; else this.scheduledEnd = at; }
      };
      oscillators.push(oscillator); return oscillator;
    }
    createGain() { return { gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() {} }; }
  }
  const math = Object.create(Math);
  math.random = () => { rngCalls++; throw new Error('Cosmetic feedback must not consume gameplay RNG'); };
  const game = {
    run: 12, chain: 2, mode: 'campaign', t: 1, n: 1, size: 7, score: 180, progress: 180,
    goal: 500, moves: 17, done: false, paused: false, clock: 700, hintTimer: 701,
    board: Array.from({ length: 12 }, (_, i) => ({ id: i + 1, color: i % 6, power: i === 3 ? 'row' : null }))
  };
  const box = {
    $: node, document,
    state: { game, run: 12, screen: 'game' },
    save: { muted: false, coins: 73, gems: 25, lives: 4, stars: { 1: { 1: 1 } } },
    matchMedia: () => ({ matches: reduced }),
    window: { AudioContext, scrollTo() {} }, Math: math,
    setTimeout(fn, ms) { const id = ++timerSequence; timers.set(id, { fn, ms, at: now + ms }); return id; },
    clearTimeout(id) { timers.delete(id); },
    clearInterval(id) { clearedIntervals.push(id); },
    requestAnimationFrame() { frameCalls++; throw new Error('Feedback must use finite animations, not a RAF loop'); },
    stopArena() {}, closeModal() {}, renderNav() {}, syncLives() {}, updateResources() {}
  };
  vm.createContext(box); vm.runInContext(source + '\n' + lifecycle, box);
  return {
    box, nodes, timers, oscillators, clearedIntervals, game,
    run(code) { return vm.runInContext(code, box); },
    snapshot() { return JSON.stringify({ game: box.state.game, save: box.save }); },
    node, rngCalls: () => rngCalls, frameCalls: () => frameCalls,
    advance(ms) {
      const end = now + ms;
      for (;;) {
        const next = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at || a[0] - b[0])[0];
        if (!next) break;
        now = next[1].at; timers.delete(next[0]); next[1].fn();
      }
      now = end;
    }
  };
}

function createWave(h) {
  h.run('feedbackHit(state.game,[0,1,2,3,4,5,6,7,8],{power:true,points:180});feedbackCombo(state.game);feedbackSound("win")');
}

test('feedback presents actual points with a bounded particle count and no gameplay writes or engine RNG', () => {
  const h = createHarness(), before = h.snapshot(); createWave(h);
  assert.equal(h.node('board-flash').children[1].textContent, 'Cascada 2 · +180 de luz');
  assert.equal(h.snapshot(), before);
  assert.equal(h.rngCalls(), 0); assert.equal(h.frameCalls(), 0);
  h.run('for(let i=0;i<12;i++)feedbackHit(state.game,[0,1,2,3,4,5,6,7,8],{power:true,points:180})');
  assert.equal(h.run('scFeedback.layer.childElementCount'), 3);
  assert.ok(h.run('scFeedback.layer.children.every(group=>group.childElementCount<=14)'));
  assert.equal(h.snapshot(), before);
});

test('the real stopBoard hook clears effects, classes, timers and scheduled audio', () => {
  const h = createHarness(); createWave(h);
  assert.ok(h.run('scFeedback.voices.size') > 0);
  assert.ok(h.timers.size > 0);
  const gameBefore = JSON.stringify(h.game), saveBefore = JSON.stringify(h.box.save);
  h.run('stopBoard()');
  assert.equal(h.box.state.run, 13); assert.equal(h.box.state.game, null);
  assert.equal(h.run('scFeedback.layer'), null);
  assert.equal(h.run('scFeedback.classes.size'), 0);
  assert.equal(h.run('scFeedback.voices.size'), 0);
  assert.equal(h.run('scFeedback.lastWave'), null);
  assert.equal(h.timers.size, 0);
  assert.ok(h.oscillators.every(voice => voice.cancelled));
  assert.ok(!h.node('board-flash').classes.has('sc-combo-visible'));
  assert.deepEqual(h.clearedIntervals, [700]);
  assert.equal(JSON.stringify(h.game), gameBefore);
  assert.equal(JSON.stringify(h.box.save), saveBefore);
  assert.doesNotThrow(() => h.run('feedbackCancel();feedbackCancel()'), 'cleanup is idempotent');
});

test('the real showScreen navigation hook cancels feedback before another screen appears', () => {
  const h = createHarness(); createWave(h);
  h.run('showScreen("home")');
  assert.equal(h.box.state.screen, 'home');
  assert.equal(h.box.state.game, null);
  assert.equal(h.run('scFeedback.layer'), null);
  assert.equal(h.timers.size, 0);
  assert.equal(h.run('scFeedback.voices.size'), 0);
  assert.ok(h.node('screen-home').classes.has('active'));
  assert.ok(!h.node('screen-game').classes.has('active'));
});

test('a previously queued score callback cannot alter a replacement game after navigation', () => {
  const h = createHarness(); createWave(h);
  const oldScoreCallback = [...h.timers.values()].find(timer => timer.ms === 610)?.fn;
  assert.ok(oldScoreCallback);
  h.run('stopBoard()');
  h.box.state.game = { ...h.game, run: h.box.state.run, score: 0, progress: 0 };
  h.box.state.screen = 'game';
  const before = h.snapshot();
  oldScoreCallback();
  assert.equal(h.snapshot(), before);
  assert.ok(!h.node('score-value').classes.has('sc-score-up'));
  assert.equal(h.timers.size, 0);
  assert.equal(h.run('scFeedback.layer'), null);
});

test('hiding the page cancels live feedback and suppresses new hidden effects and audio', () => {
  const h = createHarness(); createWave(h);
  const before = h.snapshot(), voicesBefore = h.oscillators.length;
  h.box.document.hidden = true; h.box.document.dispatch('visibilitychange');
  assert.equal(h.run('scFeedback.layer'), null);
  assert.equal(h.run('scFeedback.voices.size'), 0);
  assert.equal(h.timers.size, 0);
  h.run('feedbackHit(state.game,[0,1,2],{points:180});feedbackCombo(state.game);feedbackSound("power")');
  assert.equal(h.run('scFeedback.layer'), null);
  assert.equal(h.oscillators.length, voicesBefore);
  assert.equal(h.snapshot(), before);
});

test('reduced motion keeps readable static hit and combo feedback without flying particles', () => {
  const h = createHarness(true), before = h.snapshot();
  h.run('feedbackHit(state.game,[0,1,2,3],{points:180});feedbackCombo(state.game)');
  assert.equal(h.run('scFeedback.layer'), null);
  assert.ok(h.node('board').classes.has('sc-hit-still'));
  assert.ok(h.node('board-flash').classes.has('sc-combo-visible'));
  assert.equal(h.node('board-flash').children[1].textContent, 'Cascada 2 · +180 de luz');
  h.advance(1200);
  assert.ok(!h.node('board').classes.has('sc-hit-still'));
  assert.ok(!h.node('board-flash').classes.has('sc-combo-visible'));
  assert.equal(h.timers.size, 0);
  assert.equal(h.snapshot(), before);
  assert.equal(h.rngCalls(), 0); assert.equal(h.frameCalls(), 0);
});

test('refreshing a cascade caption cancels its older expiry instead of hiding the new caption early', () => {
  const h = createHarness(true);
  h.run('feedbackHit(state.game,[0,1,2],{points:180});feedbackCombo(state.game)');
  h.advance(500); h.game.chain = 3;
  h.run('feedbackHit(state.game,[0,1,2],{points:260});feedbackCombo(state.game)');
  h.advance(501);
  assert.ok(h.node('board-flash').classes.has('sc-combo-visible'));
  assert.equal(h.node('board-flash').children[1].textContent, 'Cascada 3 · +260 de luz');
  h.advance(500);
  assert.ok(!h.node('board-flash').classes.has('sc-combo-visible'));
});

test('first-wave special feedback preserves its newly queued power note when adopting the current run', () => {
  const h = createHarness();
  h.run('feedbackSound("power")');
  const voices = h.run('scFeedback.voices.size'); assert.ok(voices > 0);
  h.run('feedbackHit(state.game,[0,1,2],{power:true,points:180})');
  assert.equal(h.run('scFeedback.voices.size'), voices);
  assert.ok(h.oscillators.every(voice => !voice.cancelled));
});

test('victory flourish requires the completed current game and cannot grant rewards', () => {
  const h = createHarness();
  h.run('feedbackVictory(state.game)');
  assert.equal(h.run('scFeedback.layer'), null);
  h.game.done = true; h.game.progress = h.game.goal - 1;
  h.run('feedbackVictory(state.game)');
  assert.equal(h.run('scFeedback.layer'), null);
  h.game.progress = h.game.goal;
  const before = h.snapshot();
  h.run('feedbackVictory(state.game)');
  assert.ok(h.node('modal').classes.has('sc-earned-win'));
  assert.equal(h.run('scFeedback.layer.firstElementChild.childElementCount'), 9);
  assert.equal(h.snapshot(), before);
  h.run('feedbackCancel();state.run++;feedbackVictory(state.game)');
  assert.equal(h.run('scFeedback.layer'), null, 'an old completed game cannot celebrate over a replacement');
});
