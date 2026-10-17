const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const html=readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function source(name){
  const start=script.indexOf(`function ${name}(`);
  assert.ok(start>=0,`Missing function ${name}`);
  const end=script.indexOf('\n',start);
  return script.slice(start,script.slice(start,end).trimEnd().endsWith('}')?end:script.indexOf('\n}',start)+2);
}
function constant(name,closing='};'){
  const start=script.search(new RegExp(`const ${name}\\s*=`));assert.ok(start>=0,`Missing constant ${name}`);
  return script.slice(start,script.indexOf(`\n${closing}`,start)+closing.length+1);
}
function fixture(){
  let frameId=0,timerId=0;
  const frames=new Map(),timers=new Map(),elements=new Map(),celebrations=[];
  const media={matches:false},save=Object.freeze({coins:123,gems:45,lives:4,stars:Object.freeze({1:Object.freeze({1:1})})});
  const math=Object.create(Math);math.random=()=>assert.fail('Milestone effects must not consume gameplay randomness');
  function element(id,screen){
    const classes=new Set(),children=[];
    const el={id,children,isConnected:true,offsetWidth:240,dataset:{},style:{setProperty(name,value){this[name]=value;}},
      classList:{add:(...names)=>names.forEach(name=>classes.add(name)),remove:(...names)=>names.forEach(name=>classes.delete(name)),contains:name=>classes.has(name),toggle(name,on){if(on??!classes.has(name))classes.add(name);else classes.delete(name);}},
      setAttribute(name,value){this[name]=String(value);},removeAttribute(name){delete this[name];},
      appendChild(child){child.parent=el;children.push(child);return child;},append(...nodes){nodes.forEach(node=>this.appendChild(node));},
      remove(){this.isConnected=false;if(this.parent)this.parent.children.splice(this.parent.children.indexOf(this),1);},
      querySelectorAll:selector=>children.filter(child=>selector.startsWith('.')&&child.classList.contains(selector.slice(1))),
      closest:selector=>selector.includes('.screen')?((!selector.includes('.active')||screen?.classList.contains('active'))?screen:null):null,
      matches:selector=>selector.startsWith('.')&&classes.has(selector.slice(1)),
      getBoundingClientRect:()=>({x:0,y:0,left:0,top:0,width:240,height:180}),
      addEventListener(){},removeEventListener(){}};
    let className='';Object.defineProperty(el,'className',{get:()=>className,set:value=>{className=value;classes.clear();value.split(/\s+/).filter(Boolean).forEach(name=>classes.add(name));}});
    elements.set(id,el);return el;
  }
  const screen=element('screen-map');screen.classList.add('screen','active');
  const target=element('target',screen);element('milestone-status');
  const document={hidden:false,documentElement:element('root'),
    createElement:tag=>element(`created-${elements.size}-${tag}`),getElementById:id=>elements.get(id)||null,
    querySelector:selector=>selector==='.screen.active'?(screen.classList.contains('active')?screen:null):elements.get(selector.replace(/^#/,''))||null,
    querySelectorAll:selector=>[...elements.values()].filter(el=>selector.startsWith('.')&&el.classList.contains(selector.slice(1))),
    addEventListener(){},removeEventListener(){}};
  const ctx=vm.createContext({save,Math:math,window:{matchMedia:()=>media},document,
    pendingMilestones:new Map(),milestoneFrames:new Set(),milestoneCleanups:new Set(),requestAnimationFrame:callback=>{const id=++frameId;frames.set(id,callback);return id;},cancelAnimationFrame:id=>frames.delete(id),
    setTimeout:(callback,ms)=>{const id=++timerId;timers.set(id,{callback,ms});return id;},clearTimeout:id=>timers.delete(id),
    persistSave:()=>assert.fail('Visual milestones must not write saves'),rnd:()=>assert.fail('Visual milestones must not use gameplay RNG'),
    celebrateMilestone:(el,label)=>celebrations.push({el,label})});
  for(const name of ['queueMilestone','scheduleMilestone','cancelMilestoneEffects'])vm.runInContext(source(name),ctx);
  function drainFrames(limit=12){
    let count=0;
    while(frames.size){assert.ok(++count<=limit,'Milestones must not create a perpetual RAF loop');const batch=[...frames.values()];frames.clear();batch.forEach(callback=>callback(count*16));}
  }
  function drainTimers(limit=12){
    let count=0;
    while(timers.size){assert.ok(++count<=limit,'Milestones must not create a perpetual timer loop');const batch=[...timers.values()];timers.clear();batch.forEach(({callback})=>callback());}
  }
  return {ctx,save,document,media,screen,target,elements,frames,timers,celebrations,drainFrames,drainTimers,element};
}
function victoryFixture(){
  const f=fixture(),ids=Array.from({length:8},(_,i)=>i+1),save={coins:123,gems:45,lives:4,
    stars:Object.fromEntries(ids.map(id=>[id,{}])),unlocked:Object.fromEntries(ids.map(id=>[id,1])),bestScores:{},unlockedStories:{},heroAdUnlocked:{}};
  f.document.getElementById=id=>f.elements.get(id)||f.element(id,f.screen);
  f.document.querySelectorAll=()=>[];
  Object.assign(f.ctx,{save,currentTerritory:1,TOTAL_LEVELS:10,cur:null,pauseOpen:false,hintTimerId:0,
    TERRITORIES:ids.map(id=>({id})),LEVELS_BY_TERRITORY:Object.fromEntries(ids.map(id=>[id,Array.from({length:10},(_,i)=>({n:i+1}))])),
    CAMPAIGN_ARCS:Object.fromEntries(ids.map(id=>[id,{resolution:'El lugar respira.',steps:['El sendero','La niebla','El guardián']}])),
    LEVEL_NAMES_ALL:Object.fromEntries(ids.map(id=>[id,Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,`Ruta ${i+1}`]))])),
    clearHint(){},clearTimeout(){},endSugarRush(){},playWin(){},playLose(){},spawnConfetti(){},playBuild(){},
    hasHeroAbility:()=>false,hasBuilding:()=>false,streakMult:()=>1,piggyAdd(){},addWeeklyChestProgress(){},awardLeaguePoints:()=>0,
    checkAchievements(){},persistSave:()=>true,setConfiteGame(){},setConfiteMood(){},confiteSVG:()=>'<g></g>',guardianPortrait:()=>'<span></span>',
    STORY_MOMENTS:{},getDailyKey:()=> '2026-10-17',finishLeagueDuel(){},finishCanvasLevel(){}});
  vm.runInContext(constant('HEROES','];'),f.ctx);
  for(const name of ['campaignUnlockedLevel','territoryProgress','territoryUnlocked','availableHeroIds','calcStars','finishLevel'])vm.runInContext(source(name),f.ctx);
  const finish=(won,n=1,options={})=>{f.ctx.cur={n,type:'score',score:100,goal:100,movesLeft:0,movesMax:15,done:false,...options};f.ctx.finishLevel(won);};
  return {...f,save,finish};
}
function unlockFixture(){
  const f=victoryFixture(),log={persists:0,renders:[]};
  Object.assign(f.save,{coins:500,activeSkin:'default',unlockedSkins:{default:true},equippedHero:'dulce'});
  f.document.querySelector=()=>f.target;
  Object.assign(f.ctx,{persistSave:()=>log.persists++,renderHeroes:()=>log.renders.push('heroes'),renderSkins:()=>log.renders.push('skins'),
    renderMemories:()=>log.renders.push('memories'),refreshAllConfite(){},toast(){}});
  for(const [name,closing] of [['CONFITE_SKINS','];'],['STORY_MOMENTS','};']])vm.runInContext(constant(name,closing),f.ctx);
  for(const name of ['equipHero','unlockHeroWithAd','buySkin','activateSkin','unlockSkinWithAd','unlockMemoryWithAd'])vm.runInContext(source(name),f.ctx);
  return {...f,log};
}
test('Milestone queues deduplicate by screen and target without adding saved fields',()=>{
  const f=fixture(),before=JSON.stringify(f.save);
  f.ctx.queueMilestone('map',1,{level:2,next:3});f.ctx.queueMilestone('map',1,{level:2,next:3});
  assert.equal(f.ctx.pendingMilestones.size,1);
  f.ctx.queueMilestone('world',1,{level:10,next:2});assert.equal(f.ctx.pendingMilestones.size,2);
  assert.equal(JSON.stringify(f.save),before);assert.deepEqual(f.celebrations,[]);
});
test('A visible milestone is consumed once even when the same screen rerenders',()=>{
  const f=fixture();f.ctx.queueMilestone('map',1,{level:2,next:3});
  f.ctx.scheduleMilestone('map',1,'#target');f.drainFrames();
  assert.equal(f.celebrations.length,1);assert.equal(f.celebrations[0].el,f.target);assert.equal(f.ctx.pendingMilestones.size,0);
  f.ctx.scheduleMilestone('map',1,'#target');f.drainFrames();assert.equal(f.celebrations.length,1);
});
test('Entering a game before the queued map frame does not lose its celebration',()=>{
  const f=fixture();f.ctx.queueMilestone('map',1,{level:2,next:3});f.ctx.scheduleMilestone('map',1,'#target');
  f.screen.classList.remove('active');f.drainFrames();
  assert.equal(f.celebrations.length,0);assert.equal(f.ctx.pendingMilestones.size,1);
  f.screen.classList.add('active');f.ctx.scheduleMilestone('map',1,'#target');f.drainFrames();
  assert.equal(f.celebrations.length,1);assert.equal(f.ctx.pendingMilestones.size,0);
});
test('Hidden pages defer milestones until their target becomes visible again',()=>{
  const f=fixture();f.ctx.queueMilestone('map',1,{level:2,next:3});f.document.hidden=true;
  f.ctx.scheduleMilestone('map',1,'#target');f.drainFrames();
  assert.equal(f.celebrations.length,0);assert.equal(f.ctx.pendingMilestones.size,1);
  f.document.hidden=false;f.ctx.scheduleMilestone('map',1,'#target');f.drainFrames();
  assert.equal(f.celebrations.length,1);assert.equal(f.ctx.pendingMilestones.size,0);
});
test('Cancelling screen effects stops pending frames while preserving an unseen milestone',()=>{
  const f=fixture();f.ctx.queueMilestone('map',1,{level:2,next:3});f.ctx.scheduleMilestone('map',1,'#target');
  f.ctx.cancelMilestoneEffects();f.drainFrames();
  assert.equal(f.celebrations.length,0);assert.equal(f.ctx.pendingMilestones.size,1);
  f.ctx.scheduleMilestone('map',1,'#target');f.drainFrames();assert.equal(f.celebrations.length,1);
});
test('Milestone feedback has finite deterministic sparks and removes all transient effects',()=>{
  const f=fixture(),before=JSON.stringify(f.save);vm.runInContext(source('celebrateMilestone'),f.ctx);
  f.ctx.celebrateMilestone(f.target,'Un nuevo camino');
  assert.ok(f.target.classList.contains('milestone-bloom'));assert.equal(f.target.children.length,1);
  assert.equal(f.target.children[0].children.filter(el=>el.classList.contains('milestone-spark')).length,12);
  assert.equal(f.elements.get('milestone-status').textContent,'Un nuevo camino');
  assert.equal(f.timers.size,1);assert.ok([...f.timers.values()].every(timer=>timer.ms>0&&timer.ms<=3000));
  for(const spark of f.target.children[0].children)assert.doesNotMatch(JSON.stringify(spark.style),/NaN|Infinity|undefined/);
  f.drainTimers();f.drainFrames();
  assert.equal(f.target.children.length,0);assert.equal(f.target.classList.contains('milestone-bloom'),false);
  assert.equal(f.ctx.milestoneCleanups.size,0);assert.equal(f.elements.get('milestone-status').textContent,'');
  assert.equal(JSON.stringify(f.save),before);
});
test('Reduced-motion feedback omits flying sparks while keeping a readable finite announcement',()=>{
  const f=fixture();vm.runInContext(source('celebrateMilestone'),f.ctx);f.media.matches=true;
  f.ctx.celebrateMilestone(f.target,'El color vuelve');
  assert.equal(f.target.children.length,1);assert.equal(f.target.children[0].children.filter(el=>el.classList.contains('milestone-spark')).length,0);
  assert.equal(f.elements.get('milestone-status').textContent,'El color vuelve');
  f.drainTimers();assert.equal(f.target.children.length,0);assert.equal(f.ctx.milestoneCleanups.size,0);
});
test('Hidden pages cannot start sparks and screen changes clean up an effect already in flight',()=>{
  const f=fixture();vm.runInContext(source('celebrateMilestone'),f.ctx);f.document.hidden=true;
  f.ctx.celebrateMilestone(f.target,'Oculto');assert.equal(f.target.children.length,0);assert.equal(f.timers.size,0);
  f.document.hidden=false;f.ctx.celebrateMilestone(f.target,'Visible');
  assert.equal(f.ctx.milestoneCleanups.size,1);f.ctx.cancelMilestoneEffects();
  assert.equal(f.ctx.milestoneCleanups.size,0);assert.equal(f.target.children.length,0);assert.equal(f.timers.size,0);
  assert.equal(f.target.classList.contains('milestone-bloom'),false);
});
test('Only a first campaign victory queues a restoration; duplicate finishes and replays stay quiet',()=>{
  const f=victoryFixture(),fields=Object.keys(f.save).sort();
  f.finish(true,1);assert.equal(f.save.stars[1][1],1);assert.equal(f.ctx.pendingMilestones.size,1);assert.equal(f.celebrations.length,1);
  const detail=f.ctx.pendingMilestones.get('map:1');assert.equal(detail.level,1);assert.equal(detail.next,2);
  const coins=f.save.coins;f.ctx.finishLevel(true);assert.equal(f.save.coins,coins);assert.equal(f.ctx.pendingMilestones.size,1);assert.equal(f.celebrations.length,1);
  f.ctx.pendingMilestones.clear();f.finish(true,1);assert.equal(f.ctx.pendingMilestones.size,0);assert.equal(f.celebrations.length,1);
  f.finish(false,2);assert.equal(f.ctx.pendingMilestones.size,0);assert.equal(f.celebrations.length,1);
  assert.deepEqual(Object.keys(f.save).sort(),fields,'Celebrations must reuse saved progression instead of adding event flags');
});
test('A first boss victory announces only a newly accessible territory, and imported wins do not replay it',()=>{
  for(let territory=1;territory<=8;territory++){
    const f=victoryFixture();f.ctx.currentTerritory=territory;
    for(let id=1;id<territory;id++)f.save.stars[id]=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,1]));
    f.save.stars[territory]=Object.fromEntries(Array.from({length:9},(_,i)=>[i+1,1]));
    f.finish(true,10);assert.ok(f.ctx.pendingMilestones.has(`map:${territory}`));
    assert.equal(f.ctx.pendingMilestones.has(`world:${territory+1}`),territory<8);
    f.ctx.pendingMilestones.clear();f.finish(true,10);assert.equal(f.ctx.pendingMilestones.size,0);
  }
  const imported=victoryFixture();imported.save.stars[1]={1:3};imported.finish(true,1);
  assert.equal(imported.ctx.pendingMilestones.size,0);assert.equal(imported.celebrations.length,0);
});
test('Daily, Survival, Canvas and League outcomes do not create campaign-unlock celebrations',()=>{
  for(const options of [{isDaily:true},{isSurvival:true},{isCanvas:true},{isLeague:true}]){
    const f=victoryFixture();f.finish(true,1,options);assert.equal(f.ctx.pendingMilestones.size,0);assert.equal(f.celebrations.length,0);
  }
});
test('Milestone animation styles and page visibility both retain their accessibility gates',()=>{
  assert.match(html,/@media\(prefers-reduced-motion:reduce\)\{[^}]*\.milestone-ring[^}]*animation:none!important/);
  assert.match(html,/\.page-hidden \.milestone-fx[^}]*animation-play-state:paused!important/);
  assert.match(source('goTo'),/cancelMilestoneEffects\(\)/);
  assert.match(source('syncVisualVisibility'),/document\.hidden[\s\S]*cancelMilestoneEffects\(\)/);
});
test('Natural hero access queues once at its real progression threshold and excludes the final trophy',()=>{
  const f=victoryFixture();f.ctx.currentTerritory=2;f.save.stars[1]=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,1]));
  f.save.stars[2]={1:1,2:1,3:1,4:1};assert.ok(!f.ctx.availableHeroIds().includes('mochiko'));
  f.finish(true,5);assert.ok(f.ctx.availableHeroIds().includes('mochiko'));assert.equal(f.ctx.pendingMilestones.get('heroes:all').hero,'mochiko');
  f.ctx.pendingMilestones.clear();f.finish(true,5);assert.equal(f.ctx.pendingMilestones.size,0);
  const early=victoryFixture();early.ctx.currentTerritory=2;early.save.heroAdUnlocked.mochiko=true;early.save.stars[2]={1:1,2:1,3:1,4:1};
  early.finish(true,5);assert.equal(early.ctx.pendingMilestones.has('heroes:all'),false);
  const final=victoryFixture();final.ctx.currentTerritory=8;
  for(let t=1;t<=8;t++)final.save.stars[t]=Object.fromEntries(Array.from({length:t===8?9:10},(_,i)=>[i+1,1]));
  final.finish(true,10);assert.equal(final.ctx.pendingMilestones.has('heroes:all'),false);assert.equal(final.ctx.availableHeroIds().includes('hexbr'),false);
});
test('Hero ad unlocks celebrate a real change once; already available heroes, invalid IDs and the final trophy stay quiet',()=>{
  const f=unlockFixture(),coins=f.save.coins;
  for(const id of ['unknown','hexbr','dulce'])f.ctx.unlockHeroWithAd(id);
  assert.equal(f.celebrations.length,0);assert.equal(f.log.persists,0);
  f.ctx.unlockHeroWithAd('mochiko');f.ctx.unlockHeroWithAd('mochiko');
  assert.equal(f.save.heroAdUnlocked.mochiko,true);assert.equal(f.celebrations.length,1);assert.equal(f.log.persists,1);assert.equal(f.save.coins,coins);
  f.ctx.equipHero('mochiko');f.ctx.equipHero('dulce');assert.equal(f.celebrations.length,1);
  const natural=unlockFixture();natural.save.stars[2]={1:1,2:1,3:1,4:1,5:1};natural.ctx.unlockHeroWithAd('mochiko');
  assert.equal(natural.save.heroAdUnlocked.mochiko,undefined);assert.equal(natural.celebrations.length,0);assert.equal(natural.log.persists,0);
});
test('Skin purchases and simulated ad unlocks celebrate once while activation and rejected purchases stay silent',()=>{
  const f=unlockFixture(),cost=vm.runInContext('CONFITE_SKINS.find(s=>s.id==="nocturno").cost',f.ctx),coins=f.save.coins;
  f.ctx.buySkin('nocturno');f.ctx.buySkin('nocturno');
  assert.equal(f.save.coins,coins-cost);assert.equal(f.save.unlockedSkins.nocturno,true);assert.equal(f.celebrations.length,1);
  f.ctx.activateSkin('default');f.ctx.activateSkin('nocturno');assert.equal(f.celebrations.length,1);
  const ad=unlockFixture();ad.save.coins=0;ad.ctx.buySkin('origen');ad.ctx.buySkin('unknown');assert.equal(ad.celebrations.length,0);
  ad.ctx.unlockSkinWithAd('dorado');ad.ctx.unlockSkinWithAd('dorado');ad.ctx.unlockSkinWithAd('unknown');
  assert.equal(ad.save.coins,0);assert.equal(ad.save.unlockedSkins.dorado,true);assert.equal(ad.celebrations.length,1);
});
test('A memory ad unlock uses its real quote and celebrates once without inventing keys',()=>{
  const f=unlockFixture();f.ctx.unlockMemoryWithAd('unknown');assert.equal(f.celebrations.length,0);assert.equal(f.log.persists,0);
  f.ctx.unlockMemoryWithAd('1_5');f.ctx.unlockMemoryWithAd('1_5');
  assert.equal(f.save.unlockedStories['1_5'],vm.runInContext('STORY_MOMENTS["1_5"]',f.ctx));
  assert.equal(f.celebrations.length,1);assert.equal(f.log.persists,1);assert.deepEqual(Object.keys(f.save.unlockedStories),['1_5']);
});
