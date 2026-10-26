'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
const runtime = script.slice(0, script.indexOf('window.SugarClash='));
assert.ok(runtime.length, 'navigation tests load the actual inline runtime');

function harness() {
  const writes = [], frames = new Map(), timers = new Map(), listeners = new Map();
  let sequence = 0, seed = 20261021;
  const decode = value => String(value).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  let document;
  class Element {
    constructor(tag = 'div', attrs = {}) {
      this.tagName = tag.toUpperCase(); this.attributes = { ...attrs }; this.children = []; this.parentElement = null;
      this.dataset = {}; this.events = new Map(); this.classes = new Set((attrs.class || '').split(/\s+/).filter(Boolean));
      this.style = { setProperty(name, value) { this[name] = String(value); } };
      this.disabled = 'disabled' in attrs; this.hidden = 'hidden' in attrs; this.value = attrs.value || '';
      for (const [key, value] of Object.entries(attrs)) if (key.startsWith('data-')) this.dataset[key.slice(5).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = value;
      this.classList = {
        add: (...names) => names.forEach(name => this.classes.add(name)),
        remove: (...names) => names.forEach(name => this.classes.delete(name)),
        contains: name => this.classes.has(name),
        toggle: (name, on = !this.classes.has(name)) => { if (on) this.classes.add(name); else this.classes.delete(name); return on; }
      };
    }
    get id() { return this.attributes.id || ''; }
    set id(value) { this.attributes.id = value; }
    get tabIndex() { return Number(this.attributes.tabindex ?? (this.tagName === 'BUTTON' ? 0 : -1)); }
    set tabIndex(value) { this.attributes.tabindex = String(value); }
    get className() { return [...this.classes].join(' '); }
    set className(value) { this.classes = new Set(value.split(/\s+/).filter(Boolean)); }
    get isConnected() { return this === document.body || !!this.parentElement?.isConnected; }
    get firstElementChild() { return this.children.find(node => node instanceof Element) || null; }
    get childElementCount() { return this.children.filter(node => node instanceof Element).length; }
    get textContent() { return this.children.map(node => typeof node === 'string' ? decode(node) : node.textContent).join(''); }
    set textContent(value) { this.replaceChildren(String(value)); }
    get innerHTML() { return this.markup || ''; }
    set innerHTML(value) { this.markup = String(value); this.replaceChildren(); parse(this.markup, this); }
    appendChild(node) { if (node instanceof Element) node.parentElement = this; this.children.push(node); return node; }
    replaceChildren(...children) {
      if (document?.activeElement && this.contains(document.activeElement)) document.activeElement = document.body;
      for (const child of this.children) if (child instanceof Element) child.parentElement = null;
      this.children = []; children.forEach(child => this.appendChild(child));
    }
    remove() { if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(node => node !== this); this.parentElement = null; }
    contains(node) { return node === this || this.children.some(child => child instanceof Element && child.contains(node)); }
    setAttribute(name, value) { this.attributes[name] = String(value); if (name === 'class') this.className = String(value); }
    getAttribute(name) { return name === 'class' ? this.className : this.attributes[name] ?? null; }
    removeAttribute(name) { delete this.attributes[name]; }
    hasAttribute(name) { return name in this.attributes; }
    focus() { if (this.isConnected && !this.disabled) document.activeElement = this; }
    scrollIntoView() {}
    addEventListener(type, fn) { if (!this.events.has(type)) this.events.set(type, new Set()); this.events.get(type).add(fn); }
    removeEventListener(type, fn) { this.events.get(type)?.delete(fn); }
    getBoundingClientRect() { return { left: 0, top: 0, width: 390, height: 570 }; }
    get clientWidth() { return 360; }
    get clientHeight() { return 480; }
    get offsetWidth() { return 360; }
    getContext() { return new Proxy({}, { get: () => () => {} }); }
    setPointerCapture() {}
    closest(selector) { return matches(this, selector) ? this : this.parentElement?.closest(selector) || null; }
    querySelectorAll(selector) {
      const result = [];
      const visit = parent => { for (const node of parent.children) if (node instanceof Element) { if (matches(node, selector)) result.push(node); visit(node); } };
      visit(this); return result;
    }
    querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  }
  function simple(node, selector) {
    if (!(node instanceof Element)) return false;
    selector = selector.trim();
    const excluded = [...selector.matchAll(/:not\(([^)]+)\)/g)].map(match => match[1]);
    selector = selector.replace(/:not\([^)]+\)/g, '');
    if (excluded.some(part => simple(node, part))) return false;
    const tag = selector.match(/^[\w-]+/);
    if (tag && node.tagName !== tag[0].toUpperCase()) return false;
    for (const [, id] of selector.matchAll(/#([\w-]+)/g)) if (node.id !== id) return false;
    for (const [, name] of selector.matchAll(/\.([\w-]+)/g)) if (!node.classes.has(name)) return false;
    for (const [, key, raw] of selector.matchAll(/\[([\w-]+)(?:=["']?([^\]"']+)["']?)?\]/g)) {
      if (!node.hasAttribute(key)) return false;
      if (raw !== undefined && node.getAttribute(key) !== raw) return false;
    }
    return true;
  }
  function matches(node, selector) {
    return selector.split(',').some(option => {
      const parts = option.trim().split(/\s+(?![^[]*\])/); let current = node;
      if (!simple(current, parts.pop())) return false;
      while (parts.length) { const part = parts.pop(); current = current.parentElement; while (current && !simple(current, part)) current = current.parentElement; if (!current) return false; }
      return true;
    });
  }
  function parse(markup, parent) {
    const stack = [parent], voids = new Set(['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR']);
    for (const token of markup.matchAll(/<!--[^]*?-->|<\/?([\w:-]+)\b([^>]*?)>|([^<]+)/g)) {
      if (token[0].startsWith('<!--')) continue;
      if (token[3] !== undefined) { stack.at(-1).appendChild(token[3]); continue; }
      const tag = token[1].toUpperCase();
      if (token[0].startsWith('</')) { const i = stack.findLastIndex(node => node.tagName === tag); if (i > 0) stack.splice(i); continue; }
      const attrs = {};
      for (const [, name, quoted, single, bare] of token[2].matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[name] = decode(quoted ?? single ?? bare ?? '');
      const node = new Element(tag, attrs); stack.at(-1).appendChild(node);
      if (!voids.has(tag) && !token[0].endsWith('/>')) stack.push(node);
    }
  }
  document = {
    hidden: false, body: null, activeElement: null,
    getElementById(id) { return this.body.querySelector('#' + id); },
    querySelector(selector) { return this.body.querySelector(selector); },
    querySelectorAll(selector) { return this.body.querySelectorAll(selector); },
    createElement(tag) { return new Element(tag); },
    addEventListener(type, fn) { if (!listeners.has(type)) listeners.set(type, new Set()); listeners.get(type).add(fn); },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    dispatch(type, event) { for (const fn of [...(listeners.get(type) || [])]) fn(event); }
  };
  document.body = new Element('body'); document.activeElement = document.body;
  document.body.innerHTML = html.slice(html.indexOf('<body>') + 6, html.indexOf('<script>'));
  const math = Object.create(Math); math.random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
  const now = 1792944000000;
  class Clock extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
  const context = vm.createContext({
    console, document, Date: Clock, Math: math, Set, Map, JSON,
    window: { addEventListener() {}, removeEventListener() {}, scrollTo() {}, devicePixelRatio: 1 },
    navigator: {}, performance: { now: () => 1000 }, matchMedia: () => ({ matches: true }),
    Image: class { set src(value) { this.file = value; } },
    ResizeObserver: class { observe() {} disconnect() {} },
    localStorage: { getItem() { return null; }, setItem(key, value) { writes.push([key, value]); } },
    setTimeout(fn, ms) { const id = ++sequence; timers.set(id, { fn, ms }); return id; }, clearTimeout(id) { timers.delete(id); },
    setInterval() { return ++sequence; }, clearInterval() {},
    requestAnimationFrame(fn) { const id = ++sequence; frames.set(id, fn); return id; }, cancelAnimationFrame(id) { frames.delete(id); }
  });
  vm.runInContext(runtime + `
    renderGame=()=>{};renderPieces=()=>{};updateGameHUD=()=>{};resetHint=()=>{};sound=()=>{};arenaDraw=()=>{};
    globalThis.api={state,navigate,showScreen,renderNav,renderWorld,launchMode,startBoard,startArena,pauseBoard,pauseArena,arenaExit,stopBoard,stopArena,finishBoard,requestLevel,tryStartLevel,levelConfig,campaignNext,
      getSave:()=>save,getArena:()=>arenaState};`, context);
  return {
    ...context.api, context, document, writes, frames,
    run(code) { return vm.runInContext(code, context); },
    node(id) { return document.getElementById(id); },
    action(pattern) { const node = this.node('modal-root').querySelectorAll('[data-modal-action]').find(button => pattern.test(button.textContent)); assert.ok(node, 'dialog action exists: ' + pattern); return node; },
    click(node) { assert.ok(node, 'action exists'); if (node.disabled) return; if (typeof node.onclick === 'function') return node.onclick(); context.testNode = node; return this.run('(function(){' + node.getAttribute('onclick') + '}).call(testNode)'); },
    key(key, shiftKey = false) { const event = { key, shiftKey, prevented: false, preventDefault() { this.prevented = true; } }; document.dispatch('keydown', event); return event; },
    snapshot() { return JSON.stringify(this.getSave()); }
  };
}

function normalLabel(node) { return node.textContent.replace(/\s+/g, ' ').trim(); }

test('four primary destinations expose one current page and secondary destinations stay reachable', () => {
  const h = harness(), destinations = [['home', 'Inicio'], ['world', 'Campaña'], ['modes', 'Modos'], ['village', 'Aldea']];
  for (const [id, label] of destinations) {
    h.navigate(id);
    const buttons = h.node('navigation').querySelectorAll('button');
    const main = buttons.filter(button => destinations.some(([, name]) => normalLabel(button) === name));
    assert.equal(main.length, 4);
    assert.deepEqual(main.map(normalLabel), destinations.map(([, name]) => name));
    const active = main.filter(button => button.getAttribute('aria-current') === 'page');
    assert.equal(active.length, 1); assert.equal(normalLabel(active[0]), label);
    assert.equal(h.document.querySelectorAll('.screen.active').length, 1);
    assert.equal(h.document.querySelector('.screen.active').id, 'screen-' + id);
    assert.ok(h.document.querySelectorAll('button').some(button => button.getAttribute('aria-label') === 'Ajustes' && button.closest('header')));
  }
  h.navigate('world');
  const memories = h.node('screen-world').querySelectorAll('button').find(button => /recuerdos/i.test(button.getAttribute('aria-label') || normalLabel(button)));
  assert.ok(memories); h.click(memories); assert.equal(h.state.screen, 'memories');
  h.navigate('settings');
  assert.ok(h.document.querySelectorAll('header button').some(button => button.getAttribute('aria-current') === 'page' && button.getAttribute('aria-label') === 'Ajustes'));
  assert.equal(h.writes.length, 0, 'visiting views cannot award or persist progress');
});

test('normal navigation focuses the new view after rendering and announces its destination', () => {
  const h = harness();
  for (const destination of ['home', 'world', 'modes', 'village', 'memories', 'settings']) {
    h.navigate(destination);
    const heading = h.node('screen-' + destination).querySelector('h1');
    assert.ok(heading, destination);
    assert.equal(h.document.activeElement, heading, destination);
    assert.equal(heading.getAttribute('tabindex'), '-1', destination);
    assert.ok(h.node('announcer').textContent.trim(), destination);
  }
});

test('an unknown destination cannot blank the app, dismiss a modal or mutate progress', () => {
  const h = harness(); h.navigate('village'); h.run('showGemInfo()');
  const before = h.snapshot(), active = h.document.activeElement, modal = h.node('modal-root').innerHTML;
  h.navigate('not-a-screen');
  assert.equal(h.state.screen, 'village'); assert.equal(h.node('modal-root').innerHTML, modal);
  assert.equal(h.document.activeElement, active);
  assert.equal(h.snapshot(), before); assert.equal(h.writes.length, 0);
});

test('prototype property names are not destinations and cannot bypass navigation validation', () => {
  for (const destination of ['constructor', 'toString', '__proto__']) {
    const h = harness(); h.navigate('world'); const before = h.snapshot();
    assert.doesNotThrow(() => h.navigate(destination), destination);
    assert.equal(h.state.screen, 'world', destination);
    assert.equal(h.document.querySelector('.screen.active').id, 'screen-world', destination);
    assert.equal(h.snapshot(), before); assert.equal(h.writes.length, 0);
  }
});

test('changing campaign chapter preserves useful focus without granting access or spending lives', () => {
  const h = harness(); h.navigate('world');
  const selector = h.node('chapter-select'); assert.ok(selector);
  selector.value = '2'; h.context.testNode = selector;
  const before = h.snapshot();
  h.run('(function(){' + selector.getAttribute('onchange') + '}).call(testNode)');
  assert.equal(h.state.territory, 2);
  assert.equal(h.document.activeElement, h.node('chapter-select'));
  assert.equal(h.snapshot(), before); assert.equal(h.writes.length, 0);
  h.requestLevel(2, 1);
  assert.equal(h.state.game, null); assert.equal(h.getSave().lives, 5);
});

test('free match-3 modes remember their launch view and repeated attempts preserve that return', () => {
  for (const mode of ['daily', 'survival', 'zen']) for (const origin of ['home', 'modes']) {
    const h = harness(); h.navigate(origin); const before = h.snapshot();
    h.launchMode(mode); const game = h.state.game;
    assert.equal(game.mode, mode); assert.equal(game.returnTo, origin);
    assert.equal(h.snapshot(), before, mode + ' entry has no life or reward charge');
    h.finishBoard(false);
    h.click(h.action(mode === 'daily' ? /Volver a intentarlo/ : /Una vez más/));
    assert.notEqual(h.state.game, game); assert.equal(h.state.game.returnTo, origin);
    assert.equal(h.getSave().lives, 5);
  }
});

test('cancelling campaign abandonment keeps the same attempt and confirming leaves without a second life charge', () => {
  const h = harness(); h.navigate('world'); h.requestLevel(1, 1);
  const game = h.state.game, lifeAfterEntry = h.getSave().lives;
  assert.equal(lifeAfterEntry, 4); assert.equal(game.returnTo, 'world');
  h.navigate('village');
  assert.equal(h.state.screen, 'game'); assert.equal(game.paused, true);
  h.click(h.action(/Seguir jugando/));
  assert.equal(h.state.game, game); assert.equal(game.paused, false);
  assert.equal(h.getSave().lives, lifeAfterEntry);
  h.navigate('village'); const before = h.snapshot();
  h.click(h.action(/Salir de la partida/));
  assert.equal(h.state.screen, 'village'); assert.equal(h.state.game, null);
  assert.equal(h.snapshot(), before); assert.equal(h.getSave().lives, 4);
  assert.equal(h.getSave().stars[1]?.[1], undefined);
});

test('a campaign retry keeps its return view and still reserves exactly one new life', () => {
  const h = harness(); h.navigate('home'); h.requestLevel(1, 1); const game = h.state.game;
  assert.equal(game.returnTo, 'home'); h.finishBoard(false);
  h.click(h.action(/Intentar otra vez/));
  assert.notEqual(h.state.game, game); assert.equal(h.state.game.returnTo, 'home');
  assert.equal(h.getSave().lives, 3);
});

test('navigation during a resolving match-3 turn preserves its active session', () => {
  const h = harness(); h.navigate('world'); h.requestLevel(1, 1); const game = h.state.game;
  game.busy = true; const before = h.snapshot(); h.navigate('modes');
  assert.equal(h.state.game, game); assert.equal(h.state.screen, 'game');
  assert.equal(h.snapshot(), before);
});

test('leaving Zen saves its mark once and goes directly to the requested view', () => {
  const h = harness(); h.navigate('modes'); h.launchMode('zen'); h.state.game.score = 475;
  const coins = h.getSave().coins, gems = h.getSave().gems, lives = h.getSave().lives;
  h.navigate('village'); const exit = h.action(/Terminar y guardar/).onclick; exit();
  assert.equal(h.state.screen, 'village'); assert.equal(h.state.game, null);
  assert.equal(h.state.modal, false); assert.equal(h.getSave().records.zen, 475);
  assert.equal(h.getSave().coins, coins); assert.equal(h.getSave().gems, gems); assert.equal(h.getSave().lives, lives);
  const writes = h.writes.length; exit(); assert.equal(h.writes.length, writes);
});

test('the default back action returns active board and combat modes to their recorded launch view', () => {
  for (const origin of ['home', 'modes']) for (const mode of ['daily', 'survival', 'zen', 'war', 'royale']) {
    const h = harness(); h.navigate(origin); h.launchMode(mode);
    if (mode === 'war' || mode === 'royale') h.arenaExit(); else h.pauseBoard(true);
    h.click(h.action(mode === 'zen' ? /Terminar y guardar/ : /Salir de la partida/));
    assert.equal(h.state.screen, origin, origin + ' → ' + mode);
    assert.equal(h.state.game, null); assert.equal(h.getArena(), null);
    assert.equal(h.getSave().lives, 5);
  }
});

test('stale match-3 leave and resume callbacks cannot dismiss or finish a replacement session', () => {
  const h = harness(); h.navigate('modes'); h.launchMode('zen'); h.navigate('world');
  const exit = h.action(/Terminar y guardar/).onclick, resume = h.action(/Seguir jugando/).onclick;
  h.startBoard({ mode: 'survival', t: 1, n: 1, returnTo: 'modes' }); const replacement = h.state.game;
  h.navigate('settings'); const modal = h.node('modal-root').innerHTML, before = h.snapshot();
  exit(); resume();
  assert.equal(h.state.game, replacement); assert.equal(replacement.done, false); assert.equal(replacement.paused, true);
  assert.equal(h.node('modal-root').innerHTML, modal); assert.equal(h.snapshot(), before);
});

test('arena navigation asks before abandoning, cancel preserves prior pause, and confirm respects the destination', () => {
  for (const priorPause of [false, true]) {
    const h = harness(); h.navigate('modes'); h.launchMode('war'); const arena = h.getArena();
    assert.equal(arena.returnTo, 'modes'); if (priorPause) h.pauseArena(true);
    const before = h.snapshot(); h.navigate('village');
    assert.equal(h.getArena(), arena); assert.equal(arena.paused, true); assert.equal(h.state.screen, 'arena');
    h.click(h.action(/Seguir jugando|Continuar partida|Cancelar/));
    assert.equal(h.getArena(), arena); assert.equal(arena.paused, priorPause); assert.equal(h.state.modal, false);
    h.navigate('village'); h.click(h.action(/Salir|Abandonar/));
    assert.equal(h.getArena(), null); assert.equal(h.state.screen, 'village');
    assert.equal(h.snapshot(), before, 'leaving an arena grants no win or currency');
  }
});

test('arena launch origin survives retry and default exit, while stale exit callbacks cannot stop its replacement', () => {
  const h = harness(); h.navigate('home'); h.launchMode('royale'); const old = h.getArena();
  assert.equal(old.returnTo, 'home'); h.run('arenaFinish(false,5)');
  h.click(h.action(/Jugar otra vez/)); const retried = h.getArena();
  assert.notEqual(retried, old); assert.equal(retried.returnTo, 'home');
  h.arenaExit(); const exit = h.action(/Salir|Abandonar/).onclick, resume = h.action(/Seguir jugando/).onclick;
  h.startArena('war', 'modes'); const replacement = h.getArena();
  h.arenaExit('settings'); const modal = h.node('modal-root').innerHTML;
  exit(); resume(); assert.equal(h.getArena(), replacement); assert.equal(replacement.paused, true); assert.equal(h.node('modal-root').innerHTML, modal);
  h.click(h.action(/Salir|Abandonar/)); assert.equal(h.state.screen, 'settings');
});

test('modal keyboard containment covers initial dialog focus and an outside focus, then restores its opener', () => {
  const h = harness(); h.navigate('home');
  const opener = h.document.querySelectorAll('header button').find(button => button.getAttribute('aria-label') === 'Ajustes'); opener.focus();
  h.run('showGemInfo()'); const modal = h.node('modal-root').querySelector('.modal');
  assert.equal(h.node('app').inert, true, 'the page behind a modal cannot receive input');
  const actions = h.node('modal-root').querySelectorAll('button,textarea,input,a,select').filter(node => !node.disabled);
  assert.ok(actions.length); modal.focus();
  assert.equal(h.key('Tab', true).prevented, true); assert.equal(h.document.activeElement, actions.at(-1));
  modal.focus(); assert.equal(h.key('Tab').prevented, true); assert.equal(h.document.activeElement, actions[0]);
  opener.focus(); assert.equal(h.key('Tab').prevented, true); assert.equal(h.document.activeElement, actions[0]);
  h.run('closeModal()'); assert.equal(h.node('app').inert, false); assert.equal(h.document.activeElement, opener);
});
