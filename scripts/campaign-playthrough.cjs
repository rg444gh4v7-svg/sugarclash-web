#!/usr/bin/env node
'use strict';

// Actual inline engine, deterministic legal swaps, and an in-memory save only.
// Optional DOM adapter: node scripts/campaign-playthrough.cjs --dom-module /path/to/linkedom
// No dependency is added to the game. Prints a JSON audit; exits nonzero if a
// level cannot be reached, cannot finish, or has not been won within the limit.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

function option(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i < 0 ? fallback : process.argv[i + 1];
}
const attemptsLimit = Number(option('max-attempts', 10));
const baseSeed = Number(option('seed', 7331)) >>> 0;
assert.ok(Number.isInteger(attemptsLimit) && attemptsLimit > 0 && attemptsLimit <= 100);
let domPath = option('dom-module', process.env.SUGARCLASH_DOM_MODULE);
if (!domPath) {
  try { domPath = require.resolve('linkedom'); }
  catch {
    throw new Error('Supply the existing Linkedom path with --dom-module PATH (no game dependencies are installed).');
  }
}
const { parseHTML } = require(domPath);
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const script = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
new Function(script);
const { window } = parseHTML(html);
const storage = new Map();
let rngState = baseSeed;
let now = Date.parse('2026-10-17T12:00:00Z');
let regenerationWaits = 0;
const random = () => ((rngState = (rngState * 1664525 + 1013904223) >>> 0) / 4294967296);
const math = Object.create(Math);
math.random = random;
class ClockDate extends Date {
  constructor(...args) { super(...(args.length ? args : [now])); }
  static now() { return now; }
}
const drawing = new Proxy({ createImageData: (w, h) => ({ data: new Uint8ClampedArray(w * h * 4) }) }, {
  get: (obj, key) => key in obj ? obj[key] : () => {},
});
window.HTMLCanvasElement.prototype.getContext = () => drawing;
Object.assign(window, {
  Math: math, Date: ClockDate, console,
  localStorage: { getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value) },
  location: { protocol: 'file:', reload() {} },
  matchMedia: () => ({ matches: true }), getComputedStyle: () => ({ gap: '4px' }),
  setTimeout: () => 1, clearTimeout() {}, setInterval: () => 1, clearInterval() {},
  requestAnimationFrame: () => 1, cancelAnimationFrame() {},
  ResizeObserver: class { observe() {} },
});
const context = vm.createContext(window);
const run = code => vm.runInContext(code, context);
run(script);
run(`
// Presentation waits/particles are removed; board generation, rules, random
// refills, objectives, pulse, life spending, finishing and save progression stay real.
delay=async()=>{}; renderGrid=()=>{}; popCombo=()=>{};
spawnCandyParticles=()=>{}; spawnConfetti=()=>{};
let __qaTerminals=[],__qaSpecials={crystal:0,stripe:0,wrapped:0},__qaShuffles=0;
const __qaFinish=finishLevel;
finishLevel=function(won){
  if(won&&!checkWin()) throw new Error('Engine awarded an unearned victory');
  __qaTerminals.push({won,territory:currentTerritory,n:cur.n});
  return __qaFinish(won);
};
const __qaCreate=checkAndCreateStripe;
checkAndCreateStripe=function(...args){
  const p=__qaCreate(...args);
  if(p){ const kind=board[p.r][p.c]===SPECIAL?'crystal':stripes[p.r][p.c]==='W'?'wrapped':'stripe'; __qaSpecials[kind]++; }
  return p;
};
const __qaShuffle=shuffleBoard;
shuffleBoard=function(){__qaShuffles++;return __qaShuffle();};

function __qaChooseMove(){
  let best=null;
  for(let r=0;r<cur.rows;r++) for(let c=0;c<cur.cols;c++) for(const [dr,dc] of [[0,1],[1,0]]){
    const rr=r+dr,cc=c+dc;
    if(rr>=cur.rows||cc>=cur.cols) continue;
    swapCells(r,c,rr,cc); swapStripes(r,c,rr,cc);
    try{
      const matches=findMatches(),power=specialSwapCells(r,c,rr,cc),seeds=power||matches;
      if(!seeds.length) continue;
      const effects=expandMatchEffects(seeds),cells=effects.cells;
      let value=seeds.length*(seeds.length>=5?150:seeds.length>=4?100:50)+(cells.length-seeds.length)*30;
      if(cur.type==='collect') value+=cells.filter(p=>board[p.r][p.c]===cur.color).length*350;
      if(cur.type==='crystals') value+=effects.crystalBursts*1400;
      // Prefer earned future powers when immediate objectives are otherwise close.
      if(!power){
        for(const [pr,pc] of [[rr,cc],[r,c]]){
          const color=board[pr][pc];
          if(color===SPECIAL||stripes[pr][pc]||!matches.some(p=>p.r===pr&&p.c===pc)) continue;
          const length=(vr,vc)=>{let count=1;for(const sign of [-1,1]){let ar=pr+vr*sign,ac=pc+vc*sign;while(ar>=0&&ar<cur.rows&&ac>=0&&ac<cur.cols&&board[ar][ac]===color){count++;ar+=vr*sign;ac+=vc*sign;}}return count;};
          const h=length(0,1),v=length(1,0);
          if(h>=5||v>=5){value+=900;break;}
          if(h>=3&&v>=3){value+=550;break;}
          if(h>=4||v>=4){value+=350;break;}
        }
      }
      if(!best||value>best.value) best={r,c,rr,cc,value};
    }finally{ swapCells(r,c,rr,cc); swapStripes(r,c,rr,cc); }
  }
  return best;
}
`);

async function attempt(t, n, attemptNumber) {
  const seed = (baseSeed + t * 1000003 + n * 10007 + (attemptNumber - 1) * 7919) >>> 0;
  rngState = seed;
  const next = run('campaignNext()');
  assert.equal(next.territory.id, t, 'Campaign must reach this territory through earned stars');
  assert.equal(next.n, n, 'Campaign must reach levels in order');
  assert.equal(run(`territoryUnlocked(${t})`), true);
  if (run('save.lives') <= 0) {
    now += run('LIFE_REGEN_MS');
    regenerationWaits++;
    run('syncLives()');
  }
  const livesBefore = run('save.lives');
  const terminalsBefore = run('__qaTerminals.length');
  const statBefore = JSON.parse(run('JSON.stringify({specials:__qaSpecials,activated:save.crystalsActivated||0,chocolate:save.chocolateDestroyed||0,shuffles:__qaShuffles})'));
  run('continueCampaign()');
  const bossIntro = window.document.getElementById('boss-intro-overlay');
  const bossShown = bossIntro.classList.contains('on');
  if (n === 10) {
    assert.equal(bossShown, true, `Boss intro must open for ${t}/10`);
    const button = window.document.getElementById('bi-btn');
    assert.equal(typeof button.onclick, 'function', 'Boss must expose its actual start handler');
    button.onclick();
    assert.equal(bossIntro.classList.contains('on'), false, 'Boss button must close the intro');
  } else assert.equal(bossShown, false);
  assert.equal(run('currentTerritory'), t);
  assert.equal(run('cur.n'), n);
  assert.equal(run('cur.done'), false);
  assert.equal(run('save.lives'), livesBefore - 1, 'Every attempt must spend a real life');
  assert.equal(window.document.querySelector('.screen.active').id, 'screen-game');
  const initial = JSON.parse(run('JSON.stringify(cur)'));
  let moves = 0, pulses = 0;
  while (!run('cur.done')) {
    assert.ok(moves < 100, `Turn cap exceeded at ${t}/${n}`);
    const boardBefore = run('JSON.stringify([board,stripes,obstacles,cur,save])');
    const move = run('__qaChooseMove()');
    assert.equal(run('JSON.stringify([board,stripes,obstacles,cur,save])'), boardBefore, 'Move evaluation must not mutate game state');
    assert.ok(move, `No legal move at ${t}/${n}`);
    const pulsingBefore = run('sugarRushActive');
    run('triggerSugarRush()');
    if (!pulsingBefore && run('sugarRushActive')) pulses++;
    const left = run('cur.movesLeft');
    await run(`doSwap(${move.r},${move.c},${move.rr},${move.cc})`);
    assert.equal(run('cur.movesLeft'), left - 1, 'A chosen legal move must consume exactly one turn');
    assert.equal(run('busy'), false, 'A completed action must release the board');
    assert.equal(run('findMatches().length'), 0, 'Cascade must settle fully');
    moves++;
  }
  assert.equal(run('__qaTerminals.length'), terminalsBefore + 1, 'Every attempt must use one real finishLevel call');
  const terminal = run('__qaTerminals[__qaTerminals.length-1]');
  const won = run('checkWin()');
  assert.equal(terminal.won, won);
  const final = JSON.parse(run('JSON.stringify(cur)'));
  if (won) assert.ok(run(`save.stars[${t}][${n}]`) > 0, 'Win must be saved by normal progression');
  const statAfter = JSON.parse(run('JSON.stringify({specials:__qaSpecials,activated:save.crystalsActivated||0,chocolate:save.chocolateDestroyed||0,shuffles:__qaShuffles})'));
  const result = {
    attempt: attemptNumber, seed, won, type: initial.type,
    target: initial.type === 'score' ? initial.goal : initial.target,
    achieved: initial.type === 'score' ? final.score : final.progress,
    score: final.score, moves, movesAvailable: initial.movesMax, movesLeft: final.movesLeft,
    pulses, created: Object.fromEntries(Object.keys(statAfter.specials).map(k => [k, statAfter.specials[k] - statBefore.specials[k]])),
    crystalsActivated: statAfter.activated - statBefore.activated,
    chocolateDestroyed: statAfter.chocolate - statBefore.chocolate,
    shuffles: statAfter.shuffles - statBefore.shuffles,
    bossEntry: n === 10 ? 'intro → start button → life spent → game' : null,
  };
  run('exitToMap()');
  return result;
}

(async () => {
  const levels = [];
  let failure = null;
  for (let t = 1; t <= 8 && !failure; t++) {
    for (let n = 1; n <= 10 && !failure; n++) {
      const record = { territory: t, level: n, name: run(`LEVEL_NAMES_ALL[${t}][${n}]`), attempts: [] };
      levels.push(record);
      try {
        for (let i = 1; i <= attemptsLimit; i++) {
          const result = await attempt(t, n, i);
          record.attempts.push(result);
          if (result.won) break;
        }
        record.won = record.attempts.some(a => a.won);
        if (!record.won) failure = `No victory within ${attemptsLimit} attempts at ${t}/${n}`;
      } catch (error) {
        record.error = error.stack;
        failure = `Engine/access failure at ${t}/${n}: ${error.message}`;
      }
      console.error(`${t}/${n}: ${record.won ? 'WIN' : 'FAILED'} (${record.attempts.length} attempts)`);
    }
  }
  const attempts = levels.flatMap(level => level.attempts);
  const report = {
    format: 1, sourceSha256: crypto.createHash('sha256').update(html).digest('hex'),
    baseSeed, attemptsLimit, scope: 'Dulcelandia campaign, 8 territories × 10 levels, actual inline engine',
    method: 'Fresh in-memory localStorage; sequential continueCampaign and real boss start handlers; legal objective-weighted greedy swaps and manual pulse; no boosters, continues, ads, forged board, score or goal changes. Presentation timers and rendering skipped; virtual clock advances only for natural life regeneration. This is a deterministic engine audit, not a browser layout check or a human win-rate estimate.',
    summary: { levelsWon: levels.filter(l => l.won).length, levelsVisited: levels.length, attempts: attempts.length,
      losses: attempts.filter(a => !a.won).length, moves: attempts.reduce((sum, a) => sum + a.moves, 0),
      bossEntriesPassed: levels.filter(l => l.level === 10 && l.attempts.some(a => a.won)).length,
      regenerationWaits, complete: !failure && run('campaignNext().complete'), failure },
    levels,
  };
  console.log(JSON.stringify(report, null, 2));
  if (!report.summary.complete) process.exitCode = 1;
})().catch(error => { console.error(error); process.exitCode = 1; });
