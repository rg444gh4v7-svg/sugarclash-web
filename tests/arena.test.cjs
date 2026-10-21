'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const match = html.match(/\/\* ARENA_START \*\/([\s\S]*?)\/\* ARENA_END \*\//);
assert.ok(match, 'index.html contains the real inline arena module');
const source = match[1];
const modalStart = html.indexOf('let modalRestore=');
const modalEnd = html.indexOf("document.addEventListener('keydown'", modalStart);
assert.ok(modalStart >= 0 && modalEnd > modalStart, 'the real generic modal functions are available');
const modalSource = html.slice(modalStart, modalEnd);

function eventTarget() {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(type, fn) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(fn);
    },
    removeEventListener(type, fn) { listeners.get(type)?.delete(fn); },
    dispatch(type, event = {}) {
      for (const fn of [...(listeners.get(type) || [])]) fn(event);
    },
    listenerCount() { return [...listeners.values()].reduce((n, set) => n + set.size, 0); }
  };
}

function createHarness() {
  const elements = new Map();
  const frames = new Map();
  const observers = [];
  let nextFrame = 0;
  const gradient = { addColorStop() {} };
  const draw = new Proxy({ createLinearGradient() { return gradient; } }, {
    get(target, key) { return key in target ? target[key] : () => {}; }
  });
  function element(id) {
    if (elements.has(id)) return elements.get(id);
    const node = Object.assign(eventTarget(), {
      innerHTML: '', textContent: '', hidden: false, disabled: false, style: {}, attributes: {},
      classList: { add() {}, remove() {} },
      setAttribute(key, value) { this.attributes[key] = value; },
      querySelector() { return null; }
    });
    Object.defineProperty(node, 'innerHTML', {
      get() { return this.markup || ''; },
      set(value) { this.markup = value; this.firstElementChild = value ? {} : null; }
    });
    if (id === 'arena-canvas') Object.assign(node, {
      width: 390, height: 570,
      parentElement: { clientWidth: 360, clientHeight: 480 },
      getContext() { return draw; },
      getBoundingClientRect() { return { left: 0, top: 0, width: 390, height: 570 }; },
      setPointerCapture() {}, focus() {}
    });
    elements.set(id, node);
    return node;
  }
  const browserWindow = Object.assign(eventTarget(), { devicePixelRatio: 3 });
  const document = Object.assign(eventTarget(), { hidden: false });
  const box = {
    $: element, window: browserWindow, document,
    Image: class { set src(value) { this.file = value; } },
    ResizeObserver: class {
      constructor(callback) { this.callback = callback; observers.push(this); }
      observe() {}
      disconnect() { this.disconnected = true; }
    },
    showScreen(name) { box.screen = name; },
    companion() { return '<div class="hero-companion">Confite</div>'; },
    escapeHTML(value) { return String(value); },
    sound(kind) { box.sounds.push(kind); },
    sounds: [],
    requestAnimationFrame(callback) { const id = ++nextFrame; frames.set(id, callback); return id; },
    cancelAnimationFrame(id) { frames.delete(id); },
    save: { coins: 101, gems: 25, lives: 5, records: { warWins: 0, royaleWins: 0, royaleBest: 10 } },
    state: { modal: false },
    persistSave() { box.persisted++; },
    persisted: 0,
    showModal(options) { box.result = options; },
    closeModal() { box.result = null; },
    navigate(name) { box.screen = name; },
    Math
  };
  vm.createContext(box);
  vm.runInContext(source, box);
  return {
    box, frames, observers, elements,
    run(code) { return vm.runInContext(code, box); },
    start(mode = 'war') { vm.runInContext(`startArena(${JSON.stringify(mode)})`, box); },
    value(code) { return vm.runInContext(code, box); }
  };
}

test('arena module parses and creates five real allies versus five enemies', () => {
  assert.doesNotThrow(() => new Function(source));
  const h = createHarness(); h.start('war');
  assert.equal(h.box.screen, 'arena');
  assert.equal(h.value('arenaState.units.length'), 10);
  assert.equal(h.value("arenaState.units.filter(u=>u.team==='ally').length"), 5);
  assert.equal(h.value("arenaState.units.filter(u=>u.team==='enemy').length"), 5);
  assert.equal(h.value('arenaState.units.filter(u=>u.player).length'), 1);
  assert.equal(h.value('arenaState.canvas.width'), 780, 'Retina backing buffer caps DPR at two');
  assert.equal(h.value('arenaState.canvas.height'), 1140);
  assert.equal(h.box.persisted, 0, 'entering a free combat mode writes no reward or progress');
});

test('Royale starts with ten independent combatants and a shrinking ring', () => {
  const h = createHarness(); h.start('royale');
  assert.equal(h.value('new Set(arenaState.units.map(u=>u.team)).size'), 10);
  const initialRadius = h.value('arenaRing(arenaState)');
  h.run('arenaState.elapsed=45');
  assert.ok(h.value('arenaRing(arenaState)') < initialRadius);
  h.run('arenaState.elapsed=500');
  assert.ok(h.value('arenaRing(arenaState)') > 0, 'the final ring remains playable');
});

test('pointer coordinates are converted from CSS pixels to logical arena coordinates', () => {
  const h = createHarness(); h.start();
  h.elements.get('arena-canvas').getBoundingClientRect = () => ({ left: 10, top: 20, width: 195, height: 285 });
  h.box.pointer = { clientX: 107.5, clientY: 162.5 };
  h.run('arenaSetTarget(pointer)');
  assert.equal(h.value('arenaState.target.x'), 195);
  assert.equal(h.value('arenaState.target.y'), 285);
});

test('pause and hidden documents freeze simulation and require an explicit resume', () => {
  const h = createHarness(); h.start();
  h.run('pauseArena(true);arenaStep(arenaState,1)');
  assert.equal(h.value('arenaState.elapsed'), 0);
  assert.equal(h.frames.size, 0);
  h.run('pauseArena()');
  h.box.document.hidden = true;
  h.box.document.dispatch('visibilitychange');
  h.run('arenaStep(arenaState,1);arenaFrame(1000)');
  assert.equal(h.value('arenaState.elapsed'), 0);
  assert.equal(h.value('arenaState.paused'), true);
  h.box.document.hidden = false;
  h.box.document.dispatch('visibilitychange');
  assert.equal(h.value('arenaState.paused'), true);
  h.run('pauseArena();arenaStep(arenaState,.04)');
  assert.ok(h.value('arenaState.elapsed') > 0);
});

test('opening a real resource modal pauses the arena and closing it requires a deliberate resume', () => {
  const h = createHarness(); h.start('royale');
  h.run(modalSource);
  h.run('showModal({title:"Tus vidas",body:"Una vida vuelve cada 25 minutos.",actions:[]})');
  assert.equal(h.box.state.modal, true);
  assert.equal(h.value('arenaState.paused'), true);
  assert.equal(h.frames.size, 0);
  const health = h.value('arenaState.player.hp');
  h.run('arenaStep(arenaState,1);arenaFrame(1000)');
  assert.equal(h.value('arenaState.elapsed'), 0);
  assert.equal(h.value('arenaState.player.hp'), health, 'the player cannot die behind the dialog');
  h.run('closeModal()');
  assert.equal(h.box.state.modal, false);
  assert.equal(h.value('arenaState.paused'), true, 'closing a dialog does not unexpectedly restart combat');
  h.run('pauseArena();arenaStep(arenaState,.04)');
  assert.ok(h.value('arenaState.elapsed') > 0);
});

test('arena shortcuts leave a generic modal and its keyboard controls untouched', () => {
  const h = createHarness(); h.start();
  h.run(modalSource);
  h.run('showModal({title:"Gemas para el camino",actions:[]})');
  let prevented = 0;
  for (const key of [' ', 'Shift', 'Escape', 'p', 'w', 'ArrowUp']) {
    h.box.window.dispatch('keydown', { key, repeat: false, preventDefault() { prevented++; } });
  }
  assert.equal(prevented, 0, 'Space remains available to activate the focused modal action');
  assert.equal(h.value('arenaState.paused'), true);
  assert.equal(h.value('arenaState.pulse'), 0);
  assert.equal(h.value('arenaState.dash'), 0);
  assert.equal(h.value('arenaState.keys.size'), 0);
  h.run('closeModal();pauseArena()');
  h.box.window.dispatch('keydown', { key: 'w', repeat: false, preventDefault() { prevented++; } });
  assert.equal(h.value('arenaState.keys.has("w")'), true, 'arena input resumes after the dialog is gone');
});

test('Pulse needs a nearby rival and cancels its prepared strike', () => {
  const h = createHarness(); h.start();
  h.run(`{
    const s=arenaState,p=s.player,e=s.units[5];s.units=[p,e];
    p.x=195;p.y=420;e.x=195;e.y=100;
    arenaPulse();
  }`);
  assert.equal(h.value('arenaState.pulse'), 0, 'an out-of-range Pulse does not consume its cooldown');
  h.run(`{
    const s=arenaState,p=s.player,e=s.units[1];e.x=195;e.y=320;
    s.marks=[{owner:e,team:'enemy',x:p.x,y:p.y,r:27,remaining:.7,max:.82,damage:23}];
    arenaPulse();
  }`);
  assert.equal(h.value('arenaState.marks.length'), 0);
  assert.ok(h.value('arenaState.units[1].stun') > 0);
  assert.ok(h.value('arenaState.units[1].hp') < 100);
  assert.ok(h.value('arenaState.pulse') > 0);
});

test('a telegraphed strike hits its fixed area, so moving away avoids damage', () => {
  const h = createHarness(); h.start();
  h.run(`{
    const s=arenaState,p=s.player,e=s.units[5];s.units=[p,e];
    p.x=200;p.y=400;e.x=100;e.y=100;e.skill=20;
    s.marks=[{owner:e,team:'enemy',x:100,y:400,r:27,remaining:.1,max:.82,damage:23}];
    arenaStep(s,.2);
  }`);
  assert.equal(h.value('arenaState.player.hp'), 140);
  assert.equal(h.value('arenaState.marks.length'), 0);
  h.run(`{
    const s=arenaState,p=s.player,e=s.units[1];
    s.marks=[{owner:e,team:'enemy',x:p.x,y:p.y,r:27,remaining:.1,max:.82,damage:23}];
    arenaStep(s,.2);
  }`);
  assert.equal(h.value('arenaState.player.hp'), 117, 'remaining in the marked area takes the advertised strike');
});

test('Impulso moves the player and grants only a brief damage dodge', () => {
  const h = createHarness(); h.start();
  const originalY = h.value('arenaState.player.y');
  h.run('arenaDash()');
  assert.ok(h.value('arenaState.player.y') < originalY);
  assert.ok(h.value('arenaState.player.invulnerable') > 0);
  h.run('arenaHurt(arenaState,arenaState.player,20,null)');
  assert.equal(h.value('arenaState.player.hp'), 140);
  h.run('arenaState.player.invulnerable=0;arenaHurt(arenaState,arenaState.player,20,null)');
  assert.equal(h.value('arenaState.player.hp'), 120);
  assert.ok(h.value('arenaState.dash') > 0);
});

test('a fallen war player returns at their own spawn rather than ending the match', () => {
  const h = createHarness(); h.start();
  h.run('arenaHurt(arenaState,arenaState.player,1000,null);arenaStep(arenaState,1)');
  assert.equal(h.value('arenaState.finished'), false);
  assert.equal(h.value('arenaState.player.hp'), 0);
  h.run('arenaStep(arenaState,3)');
  assert.ok(h.value('arenaState.player.hp') > 0);
  assert.equal(h.value('arenaState.player.x'), h.value('arenaState.player.homeX'));
  assert.equal(h.value('arenaState.player.y'), h.value('arenaState.player.homeY'));
});

test('destroying the enemy core awards one win and no currency', () => {
  const h = createHarness(); h.start();
  h.run(`{
    const s=arenaState;s.units=[s.player];s.player.x=195;s.player.y=130;
    s.enemyCore.hp=1;arenaStep(s,.04);arenaFinish(true,1);
  }`);
  assert.equal(h.box.save.records.warWins, 1);
  assert.equal(h.box.persisted, 1, 'result handling is idempotent');
  assert.equal(h.box.save.coins, 101);
  assert.equal(h.box.save.gems, 25);
  assert.equal(h.box.save.lives, 5);
  assert.equal(h.frames.size, 0);
  assert.ok(h.box.result);
});

test('waiting does not win a war or a Royale', () => {
  for (const mode of ['war', 'royale']) {
    const h = createHarness(); h.start(mode);
    h.run('for(let i=0;i<4000&&!arenaState.finished;i++)arenaStep(arenaState,.04)');
    assert.equal(h.value('arenaState.finished'), true, `${mode} reaches an earned outcome`);
    assert.equal(h.box.save.records.warWins, 0);
    assert.equal(h.box.save.records.royaleWins, 0);
    if (mode === 'royale') assert.ok(h.box.save.records.royaleBest > 1);
    assert.equal(h.box.save.coins, 101);
  }
});

test('movement, range and Pulse can win Royale through the actual combat engine', () => {
  const h = createHarness(); h.start('royale');
  h.run(`for(let i=0;i<4000&&!arenaState.finished;i++){
    const s=arenaState,p=s.player,t=arenaNearest(s,p);
    if(t){
      const d=arenaDistance(p,t),a=Math.atan2(p.y-t.y,p.x-t.x);
      if(arenaDistance(p,{x:195,y:285})>arenaRing(s)-45)s.target={x:195,y:285};
      else if(d<76)s.target={x:p.x+Math.cos(a)*100,y:p.y+Math.sin(a)*100};
      else if(d>83)s.target={x:t.x+Math.cos(a)*80,y:t.y+Math.sin(a)*80};
    }
    for(const m of s.marks)if(Math.hypot(p.x-m.x,p.y-m.y)<m.r+16){
      const a=Math.atan2(p.y-m.y,p.x-m.x);
      s.target={x:p.x+Math.cos(a)*90,y:p.y+Math.sin(a)*90};
    }
    if(s.elapsed%1<.04)arenaPulse();
    arenaStep(s,.04);
  }`);
  assert.equal(h.value('arenaState.finished'), true);
  assert.equal(h.box.save.records.royaleWins, 1);
  assert.equal(h.box.save.records.royaleBest, 1);
  assert.equal(h.value('arenaState.units.filter(arenaAlive).length'), 1);
  assert.ok(h.value('arenaState.player.hp') > 0);
});

test('stopping or replacing a mode removes frames, observers and input listeners', () => {
  const h = createHarness(); h.start();
  const windowListeners = h.box.window.listenerCount();
  h.start('royale');
  assert.equal(h.box.window.listenerCount(), windowListeners, 'restarting does not stack keyboard handlers');
  assert.equal(h.frames.size, 1);
  assert.equal(h.observers[0].disconnected, true);
  h.run('stopArena()');
  assert.equal(h.value('arenaState'), null);
  assert.equal(h.frames.size, 0);
  assert.equal(h.box.window.listenerCount(), 0);
  assert.equal(h.box.document.listenerCount(), 0);
  assert.equal(h.elements.get('arena-canvas').listenerCount(), 0);
  assert.equal(h.observers.at(-1).disconnected, true);
});
