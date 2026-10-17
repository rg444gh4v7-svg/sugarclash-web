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
  const start=script.search(new RegExp(`const ${name}\\s*=`));
  assert.ok(start>=0,`Missing constant ${name}`);
  return script.slice(start,script.indexOf(`\n${closing}`,start)+closing.length+1);
}
const bossMarkup=html.slice(html.indexOf('<div id="boss-intro-overlay"'),html.indexOf('<!-- ============ TERRITORIO COMPLETO'));
const bossIds=new Set([...bossMarkup.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
function harness(){
  const nodes=new Map(),log={starts:[],navigation:[],persists:0,noLives:0,toasts:[],timers:[],league:[],weekly:0};
  function node(id){
    if(!nodes.has(id)){
      const classes=new Set(),attributes={},children=[];
      const el={style:{setProperty(name,value){this[name]=value;}},dataset:{},attributes,children,textContent:'',
        classList:{add:(...names)=>names.forEach(name=>classes.add(name)),remove:(...names)=>names.forEach(name=>classes.delete(name)),contains:name=>classes.has(name)},
        setAttribute(name,value){attributes[name]=String(value);},appendChild(child){children.push(child);},
        querySelectorAll:()=>children,insertAdjacentHTML(){},click(){this.onclick?.();}};
      let content='',className='';
      Object.defineProperties(el,{
        innerHTML:{get:()=>content,set:value=>{content=value;children.length=0;}},
        className:{get:()=>className,set:value=>{className=value;classes.clear();value.split(/\s+/).filter(Boolean).forEach(name=>classes.add(name));}}
      });nodes.set(id,el);
    }
    return nodes.get(id);
  }
  const save={stars:Object.fromEntries(Array.from({length:8},(_,i)=>[i+1,{}])),
    unlocked:Object.fromEntries(Array.from({length:8},(_,i)=>[i+1,1])),coins:123,gems:45,lives:5,livesAt:0,introDone:true,
    bestScores:{},buildings:{casa:true},unlockedStories:{}};
  const ctx=vm.createContext({save,currentTerritory:1,TOTAL_LEVELS:10,LIVES_MAX:5,LIFE_REGEN_MS:1500000,
    LEVELS_BY_TERRITORY:Object.fromEntries(Array.from({length:8},(_,i)=>[i+1,Array.from({length:10},(_,n)=>({n:n+1,type:'score',goal:100,moves:15,cols:7}))])),
    document:{getElementById:id=>id.startsWith('bi-')&&!bossIds.has(id)?null:node(id),
      createElement:()=>node(`created-${nodes.size}`),querySelectorAll:()=>[node('star-1'),node('star-2'),node('star-3')]},
    goTo:(screen,id)=>{log.navigation.push({screen,id});if(id)ctx.currentTerritory=id;},
    startLevel:n=>{log.starts.push({territory:ctx.currentTerritory,n});ctx.cur={n,done:false};},
    persistSave:()=>{log.persists++;return true;},openNoLives:()=>log.noLives++,toast:text=>log.toasts.push(text),
    hasBuilding:()=>false,hasHeroAbility:()=>false,updateLivesUI(){},getBestScore:()=>0,
    territoryLandscapeSVG:()=>'<svg></svg>',territoryEmblemSVG:()=>'<svg></svg>',
    atlasFeeling:()=>({label:'Restauración',quote:'El camino continúa.'}),drawAtlasRoute(){},observeAtlas(){},confiteMapSay(){},LEVEL_LORE_T1:{},
    cur:null,pauseOpen:false,hintTimerId:0,clearHint(){},clearTimeout(){},endSugarRush(){},
    playWin(){},playLose(){},spawnConfetti(){},playBuild(){},streakMult:()=>1,piggyAdd(){},
    addWeeklyChestProgress:()=>log.weekly++,awardLeaguePoints:amount=>{log.league.push(amount);return amount;},
    checkAchievements(){},setConfiteGame(){},setConfiteMood(){},confiteSVG:()=>'<g></g>',STORY_MOMENTS:{},
    setTimeout:(fn,ms)=>{log.timers.push({fn,ms});return log.timers.length;}});
  for(const [name,closing] of [['TERRITORIES','];'],['LEVEL_NAMES_ALL','};'],['CAMPAIGN_ARCS','};'],['BOSS_LEVEL_NAMES','};'],['BOSS_CONFITE_LINES','};'],['BOSS_TERRITORY_SUBTITLES','};']])vm.runInContext(constant(name,closing),ctx);
  for(const name of ['campaignUnlockedLevel','territoryProgress','territoryUnlocked','campaignNext','continueCampaign','renderMap','livesMax','syncLives','spendLife','tryStartLevel','showBossIntro','calcStars','finishLevel'])vm.runInContext(source(name),ctx);
  function prepare(territory,cleared){
    ctx.currentTerritory=territory;
    for(let id=1;id<territory;id++)save.stars[id]=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,1]));
    save.stars[territory]=Object.fromEntries(Array.from({length:cleared},(_,i)=>[i+1,1]));
  }
  return {ctx,save,node,log,prepare};
}
test('Every boss intro DOM lookup resolves against the real dialog template',()=>{
  const ids=[...source('showBossIntro').matchAll(/getElementById\((["'])([^"']+)\1\)/g)].map(match=>match[2]);
  assert.ok(ids.includes('bi-sub'),'Boss subtitle must remain exercised');
  for(const id of ids)assert.ok(bossIds.has(id),`Boss dialog is missing #${id}`);
  assert.equal([...bossMarkup.matchAll(/id="bi-sub"/g)].length,1);
});
test('One star per contiguous level restores stale unlocks through all eight bosses without writing progress',()=>{
  const {ctx,save,prepare,log}=harness();
  for(let territory=1;territory<=8;territory++)for(let cleared=0;cleared<=10;cleared++){
    prepare(territory,cleared);save.unlocked[territory]=1;
    const before=JSON.stringify(save);
    assert.equal(ctx.campaignUnlockedLevel(territory),cleared+1,`Territory ${territory}, ${cleared} one-star clears`);
    assert.equal(ctx.territoryProgress(territory),cleared/10);
    assert.equal(JSON.stringify(save),before);
  }
  assert.equal(log.persists,0);
});
test('Sparse imported stars stop at their first gap while existing reachable levels remain available',()=>{
  const {ctx,save}=harness();save.stars[1]={1:1,3:3,4:2,9:1};
  assert.equal(ctx.campaignUnlockedLevel(1),2);
  save.unlocked[1]=8;assert.equal(ctx.campaignUnlockedLevel(1),8);
  save.unlocked[1]=99;assert.equal(ctx.campaignUnlockedLevel(1),11);
  save.unlocked[1]=-4;assert.equal(ctx.campaignUnlockedLevel(1),2);
  save.stars[1]={};delete save.unlocked[1];assert.equal(ctx.campaignUnlockedLevel(1),1);
});
test('Campaign continues to each boss after nine one-star clears despite a stale imported unlock',()=>{
  for(let territory=1;territory<=8;territory++){
    const {ctx,save,prepare,log}=harness();prepare(territory,9);save.unlocked[territory]=1;
    const before=JSON.stringify(save),next=ctx.campaignNext();
    assert.equal(next.territory.id,territory);assert.equal(next.n,10);assert.equal(next.complete,false);
    ctx.continueCampaign();
    assert.deepEqual(log.navigation,[{screen:'map',id:territory}]);
    assert.equal(JSON.stringify(save),before,'Opening an intro must not charge lives or rewrite imported stars');
    assert.equal(log.starts.length,0);assert.equal(log.persists,0);
  }
});
test('Map exposes the proved boss and keeps unearned later routes locked',()=>{
  for(let territory=1;territory<=8;territory++){
    const {ctx,save,node,prepare,log}=harness();prepare(territory,9);save.unlocked[territory]=1;
    const before=JSON.stringify(save);ctx.renderMap();
    const boss=node('level-grid').children[9];assert.equal(boss.attributes['aria-disabled'],'false');
    assert.ok(boss.classList.contains('boss-level'));assert.equal(typeof boss.onclick,'function');
    boss.click();assert.ok(node('boss-intro-overlay').classList.contains('on'));
    assert.equal(log.starts.length,0);assert.equal(JSON.stringify(save),before);
  }
  const {ctx,node,save}=harness();ctx.renderMap();
  const boss=node('level-grid').children[9];assert.equal(boss.attributes['aria-disabled'],'true');
  assert.equal(boss.onclick,undefined);assert.equal(save.lives,5);
});
test('Boss confirmation starts its real level and spends exactly one life',()=>{
  for(let territory=1;territory<=8;territory++){
    const {ctx,save,node,prepare,log}=harness();prepare(territory,9);
    ctx.showBossIntro(10);assert.equal(save.lives,5);assert.equal(log.starts.length,0);
    assert.equal(node('bi-name').textContent,vm.runInContext(`BOSS_LEVEL_NAMES[${territory}]`,ctx));
    const confirm=node('bi-btn').onclick;confirm();confirm();
    assert.equal(save.lives,4);assert.deepEqual(log.starts,[{territory,n:10}]);
    assert.equal(node('boss-intro-overlay').classList.contains('on'),false);
    assert.equal(save.coins,123);assert.equal(save.gems,45);
  }
});
test('Locked territories and routes cannot consume a life through direct entry',()=>{
  const {ctx,save,node,log}=harness();
  assert.equal(ctx.showBossIntro(10),false);assert.equal(node('boss-intro-overlay').classList.contains('on'),false);
  ctx.tryStartLevel(10);ctx.tryStartLevel(2);ctx.tryStartLevel(0);ctx.tryStartLevel(11);
  ctx.currentTerritory=2;ctx.tryStartLevel(1);
  assert.equal(log.starts.length,0);assert.equal(save.lives,5);assert.equal(save.coins,123);assert.equal(save.gems,45);
});
test('An unlocked boss with no lives offers recovery without starting or charging',()=>{
  const {ctx,save,node,prepare,log}=harness();prepare(1,9);save.lives=0;save.livesAt=Date.now();
  ctx.showBossIntro(10);node('bi-btn').click();
  assert.equal(save.lives,0);assert.equal(log.noLives,1);assert.deepEqual(log.starts,[]);
  assert.equal(save.coins,123);assert.equal(save.gems,45);
});
test('A one-star ninth-level win opens the boss; only its win opens the following territory',()=>{
  for(let territory=1;territory<=8;territory++){
    const {ctx,save,prepare}=harness();prepare(territory,8);save.unlocked[territory]=9;
    const finish=n=>{ctx.cur={n,type:'score',score:100,goal:100,movesLeft:0,movesMax:15,done:false};ctx.finishLevel(true);};
    finish(9);assert.equal(save.stars[territory][9],1);assert.equal(ctx.campaignUnlockedLevel(territory),10);
    if(territory<8)assert.equal(ctx.territoryUnlocked(territory+1),false);
    finish(10);assert.equal(save.stars[territory][10],1);assert.equal(ctx.territoryProgress(territory),1);
    assert.equal(ctx.campaignUnlockedLevel(territory),11);
    if(territory<8){assert.equal(ctx.territoryUnlocked(territory+1),true);assert.equal(ctx.campaignNext().territory.id,territory+1);assert.equal(ctx.campaignNext().n,1);}
    else assert.equal(ctx.campaignNext().complete,true);
  }
});
