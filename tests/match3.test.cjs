const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function source(name){
  const start=script.search(new RegExp(`(?:async )?function ${name}\\(`));
  assert.ok(start>=0,`Missing function ${name}`);
  return script.slice(start,script.indexOf('\n}',start)+2);
}
function engine(rows=5,cols=5){
  const ctx=vm.createContext({cur:{rows,cols},SPECIAL:6,save:{},Math,
    board:Array.from({length:rows},(_,r)=>Array.from({length:cols},(_,c)=>(r+c)%6)),
    stripes:Array.from({length:rows},()=>Array(cols).fill(null)),
    obstacles:Array.from({length:rows},()=>Array(cols).fill(0)),
    persistSave(){},_stripeCreatedReact(){},_wrapCreatedReact(){},setConfiteGame(){},setConfiteMood(){}});
  for(const name of ['checkAndCreateStripe','expandMatchEffects','findMatches','applyGravity','shuffleBoard','canCombineSpecials','specialSwapCells','hasPossibleMove']) vm.runInContext(source(name),ctx);
  ctx.swapCells=(r,c,rr,cc)=>{[ctx.board[r][c],ctx.board[rr][cc]]=[ctx.board[rr][cc],ctx.board[r][c]];};
  return ctx;
}
const plain=value=>JSON.parse(JSON.stringify(value));
test('Entire inline game script compiles',()=>new Function(script));
test('Four contiguous candies create a persistent horizontal special',()=>{
  const e=engine(); e.board[2]=[1,1,1,1,4];
  const p=e.checkAndCreateStripe(e.findMatches(),2,2);
  assert.deepEqual(plain(p),{r:2,c:2}); assert.equal(e.stripes[2][2],'H');
  const effect=e.expandMatchEffects(e.findMatches(),p);
  assert.equal(effect.stripeTriggers,0);
  assert.ok(!effect.cells.some(({r,c})=>r===2&&c===2));
  effect.cells.forEach(({r,c})=>e.board[r][c]=-1);
  e.applyGravity();
  assert.ok(e.stripes.flat().includes('H'));
});
test('Vertical run creates V and a true crossing creates W',()=>{
  const e=engine(); for(let r=0;r<4;r++) e.board[r][2]=1;
  e.checkAndCreateStripe(e.findMatches(),1,2); assert.equal(e.stripes[1][2],'V');
  const t=engine(); t.board[2]=[4,1,1,1,5]; t.board[1][2]=t.board[3][2]=1;
  t.checkAndCreateStripe(t.findMatches(),2,2); assert.equal(t.stripes[2][2],'W');
});
test('Unrelated matches cannot manufacture a special at the destination',()=>{
  const e=engine(5,8); e.board[2]=[1,1,1,2,3,3,3,4];
  assert.equal(e.checkAndCreateStripe(e.findMatches(),2,1),null);
  assert.equal(e.checkAndCreateStripe(e.findMatches(),4,1),null);
});
test('Creating a match does not overwrite an existing special',()=>{
  const e=engine(); e.board[2]=[1,1,1,1,4]; e.stripes[2][2]='W';
  assert.equal(e.checkAndCreateStripe(e.findMatches(),2,2),null);
  assert.equal(e.stripes[2][2],'W');
});
test('Chain effects trigger each special once, without mutating input',()=>{
  const e=engine(); e.stripes[2][1]='H'; e.stripes[2][3]='V'; e.stripes[4][3]='W'; e.board[4][4]=6;
  const before=JSON.stringify([e.board,e.stripes]);
  const effects=e.expandMatchEffects([{r:2,c:1}]);
  assert.equal(effects.stripeTriggers,2); assert.equal(effects.wrapTriggers,1); assert.equal(effects.crystalBursts,1);
  assert.equal(new Set(effects.cells.map(p=>p.r*5+p.c)).size,effects.cells.length);
  assert.equal(JSON.stringify([e.board,e.stripes]),before);
});
test('Gravity carries a special with its candy and leaves obstacle damage in place',()=>{
  const e=engine(); e.board[4][1]=-1; e.board[3][1]=-1; e.stripes[2][1]='H'; e.obstacles[2][1]=1;
  const color=e.board[2][1]; e.applyGravity();
  assert.equal(e.board[4][1],color); assert.equal(e.stripes[4][1],'H'); assert.equal(e.obstacles[2][1],1);
});
test('Shuffle preserves candy-special pairs and obstacle damage',()=>{
  const e=engine(8,7); e.stripes[2][1]='V'; e.stripes[6][3]='W'; e.obstacles[3][3]=1;
  const inventory=()=>e.board.flatMap((row,r)=>row.map((v,c)=>`${v}:${e.stripes[r][c]}`)).sort();
  const before=inventory(); const obstacles=JSON.stringify(e.obstacles);
  let seed=444; e.Math=Object.create(Math); e.Math.random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296);
  e.shuffleBoard();
  assert.deepEqual(inventory(),before); assert.equal(JSON.stringify(e.obstacles),obstacles);
  assert.equal(e.findMatches().length,0); assert.equal(e.hasPossibleMove(),true);
});
test('Empty slots do not match',()=>{
  const e=engine(); e.board[2]=[-1,-1,-1,-1,4];
  assert.ok(e.findMatches().every(({r,c})=>e.board[r][c]>=0));
});
test('A full cascade preserves its newly created special and awards points',async()=>{
  const e=engine(); Object.assign(e.cur,{type:'score',score:0,cascade:0,movesLeft:10});
  e.board[2]=[1,1,1,1,4];
  const protectedCell=e.checkAndCreateStripe(e.findMatches(),2,2);
  const noop=()=>{};
  Object.assign(e,{boardRun:1,sugarRushActive:false,hasHeroAbility:()=>false,hasBuilding:()=>false,
    processObstacleDamage:noop,damageCanvasFog:noop,updateComboPill:noop,updateFreneticBadge:noop,
    popCombo:noop,playPop:noop,spawnCandyParticles:noop,shakeGrid:noop,renderGrid:noop,
    updateHud:noop,reactConfite:noop,clearStripeAt:(r,c)=>e.stripes[r][c]=null,
    cellEl:()=>null,getFreneticDelay:x=>x,delay:async()=>{},hasPossibleMove:()=>true,
    fillEmpty:()=>{for(let r=0;r<5;r++)for(let c=0;c<5;c++)if(e.board[r][c]===-1)e.board[r][c]=(r+c+2)%6;return [];}});
  vm.runInContext(source('processCascade'),e);
  await e.processCascade(protectedCell);
  assert.equal(e.cur.score,400); assert.equal(e.cur.cascade,1);
  assert.equal(e.stripes.flat().filter(Boolean).length,1);
  assert.equal(e.findMatches().length,0);
});
test('Five aligned candies create a crystal which survives its creation wave',async()=>{
  const e=engine(5,6); e.board[2]=[1,1,1,1,1,4];
  const original=e.findMatches(); const p=e.checkAndCreateStripe(original,2,2);
  assert.equal(e.board[2][2],6); assert.equal(e.stripes[2][2],null);
  const effect=e.expandMatchEffects(original,p);
  assert.equal(effect.crystalBursts,0); assert.equal(effect.cells.length,4);
});
test('A crystal swap targets its chosen color and both exchanged cells',()=>{
  const e=engine(); e.board[1][1]=6; e.board[1][2]=2;
  const targets=e.specialSwapCells(1,1,1,2);
  assert.ok(targets.some(p=>p.r===1&&p.c===1));
  assert.ok(e.board.flatMap((row,r)=>row.map((v,c)=>({v,r,c}))).filter(p=>p.v===2).every(p=>targets.some(q=>q.r===p.r&&q.c===p.c)));
  assert.ok(targets.every(p=>e.board[p.r][p.c]===2||(p.r===1&&p.c===1)));
});
test('Two crystals clear the board and two striped powers can activate without a color match',()=>{
  const e=engine(); e.board[0][0]=e.board[0][1]=6;
  assert.equal(e.specialSwapCells(0,0,0,1).length,25);
  const t=engine(); t.stripes[1][1]='H';t.stripes[1][2]='V';
  assert.equal(t.findMatches().length,0);assert.equal(t.canCombineSpecials(1,1,1,2),true);
  assert.ok(t.expandMatchEffects(t.specialSwapCells(1,1,1,2)).cells.length>=9);
  assert.equal(t.specialSwapCells(3,3,3,4),null);
});
test('A cancelled board run cannot continue clearing the board after its animation',async()=>{
  const e=engine(); Object.assign(e.cur,{type:'score',score:0,cascade:0,movesLeft:10}); e.board[2]=[1,1,1,2,4];
  const before=JSON.stringify(e.board),noop=()=>{};
  Object.assign(e,{boardRun:1,sugarRushActive:false,hasHeroAbility:()=>false,hasBuilding:()=>false,
    processObstacleDamage:noop,damageCanvasFog:noop,updateComboPill:noop,updateFreneticBadge:noop,popCombo:noop,
    playPop:noop,spawnCandyParticles:noop,cellEl:()=>null,getFreneticDelay:x=>x,delay:async()=>{e.boardRun++;},clearStripeAt:noop});
  vm.runInContext(source('processCascade'),e); await e.processCascade();
  assert.equal(JSON.stringify(e.board),before);
});
test('Pulse activation is player-controlled and lasts two turns without a timer',()=>{
  const e=vm.createContext({cur:{done:false},busy:false,pauseOpen:false,moveStreak:2,sugarRushActive:false,
    hasBuilding:()=>false,document:{getElementById:()=>({classList:{add(){}}})},
    setConfiteGame(){},setConfiteMood(){},bounceConfite(){},playCrystal(){},updateStreakPips(){}});
  vm.runInContext(source('triggerSugarRush'),e); e.triggerSugarRush(); assert.equal(e.sugarRushActive,false);
  e.moveStreak=3;e.triggerSugarRush(); assert.equal(e.sugarRushActive,true); assert.equal(e.cur.pulseMoves,2);
  e.triggerSugarRush(); assert.equal(e.cur.pulseMoves,2);
});
test('Campaign resumes the first unfinished accessible chapter without resetting progress',()=>{
  const e=vm.createContext({TERRITORIES:Array.from({length:8},(_,i)=>({id:i+1})),TOTAL_LEVELS:10,
    LEVELS_BY_TERRITORY:Object.fromEntries(Array.from({length:8},(_,i)=>[i+1,Array.from({length:10},(_,n)=>({n:n+1}))])),
    save:{stars:{1:Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,3])),2:{1:2,2:1}},unlocked:{1:11,2:3}},
    territoryUnlocked:id=>id<=2,territoryProgress:id=>id===1?1:id===2?.2:0});
  vm.runInContext(source('campaignNext'),e);
  assert.equal(e.campaignNext().territory.id,2); assert.equal(e.campaignNext().n,3);
  const before=JSON.stringify(e.save); e.campaignNext(); assert.equal(JSON.stringify(e.save),before);
});
