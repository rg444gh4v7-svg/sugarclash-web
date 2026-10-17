const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const html=readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function source(name){
  const start=script.indexOf(`function ${name}(`);
  assert.ok(start>=0,`Missing function ${name}`);
  const lineEnd=script.indexOf('\n',start);
  if(script.slice(start,lineEnd).trimEnd().endsWith('}'))return script.slice(start,lineEnd);
  return script.slice(start,script.indexOf('\n}',start)+2);
}
function harness(lore={},practice=false){
  const nodes=new Map(),log={navigation:[],toasts:[],persist:0,league:[],achievements:0,reveals:[],loreCalls:[],confite:[],timers:[],celebrations:0};
  const node=id=>{
    if(!nodes.has(id)){
      const classes=new Set();
      nodes.set(id,{innerHTML:'',textContent:'',style:{},attributes:{},setAttribute(name,value){this.attributes[name]=String(value);},classList:{add:name=>classes.add(name),remove:name=>classes.delete(name),contains:name=>classes.has(name)}});
    }
    return nodes.get(id);
  };
  const save={minigameLore:lore,coins:125,gems:40,lives:3,mobaWins:2,brWins:1,brBestPlacement:4,achievements:{existing:true},stars:{1:{1:2}},unlocked:{1:2}};
  const ctx=vm.createContext({save,minigamePractice:practice,modeReturnScreen:'minigames',document:{getElementById:node},
    goTo:id=>log.navigation.push(id),toast:text=>log.toasts.push(text),persistSave:()=>log.persist++,
    awardLeaguePoints:(amount,reason)=>{log.league.push({amount,reason});return amount;},
    checkAchievements:()=>log.achievements++,showMinigameLoreReveal:id=>log.reveals.push(id),
    setTimeout:(callback,ms)=>{log.timers.push({callback,ms});return log.timers.length;},
    echoSceneSVG:(id,key)=>`<svg data-mode="${id}" data-context="${key}"></svg>`,celebrateMilestone:()=>log.celebrations++,
    mgConfiteSay:(prefix,text,mood)=>log.confite.push({prefix,text,mood}),spawnConfetti(){},cancelAnimationFrame(){},
    mobaRunning:true,mobaRAF:1,mobaRevived:true,mobaHeroes:Array.from({length:5},()=>({team:'enemy',alive:false})),
    brRunning:true,brRAF:1,brRevived:true,BR_TOTAL:10});
  const start=script.indexOf('const MINIGAMES = [');
  assert.ok(start>=0,'Missing narrative chapter definitions');
  vm.runInContext(script.slice(start,script.indexOf('\n];',start)+3),ctx);
  for(const name of ['minigameLoreDone','minigameUnlocked','renderQuickModes','startMode','startMinigameChapter','unlockMinigameLore','showPracticeResult','mobaEndGame','brEndGame'])vm.runInContext(source(name),ctx);
  const unlock=ctx.unlockMinigameLore;
  ctx.unlockMinigameLore=id=>{log.loreCalls.push(id);return unlock(id);};
  return {ctx,nodes,node,log};
}
function section(id){
  const start=html.indexOf(`<section id="screen-${id}"`);
  assert.ok(start>=0,`Missing ${id} screen`);
  return html.slice(start,html.indexOf('</section>',start));
}
test('Title and world expose playable modes without opening a folded camp menu',()=>{
  const {ctx,node,log}=harness(),before=JSON.stringify(ctx.save);
  for(const id of ['title','world']){
    const visible=section(id).replace(/<details\b(?![^>]*\bopen\b)[\s\S]*?<\/details>/g,'');
    assert.match(visible,new RegExp(`id="${id}-quick-modes"`),`${id} shortcuts must sit outside closed details`);
    ctx.renderQuickModes(id);
    for(const mode of id==='title'?['moba','br']:['survival','moba','br']){
      const button=new RegExp(`<button\\b[^>]*onclick="startMode\\('${mode}','${id}'\\)"[^>]*>[\\s\\S]*?<\\/button>`);
      assert.match(node(`${id}-quick-modes`).innerHTML,button,`${id} must expose a native ${mode} button`);
    }
  }
  assert.match(section('title'),/onclick="goTo\('minigames'\)"[^>]*>[^<]*Todos los modos/i);
  assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persist,0);
});
test('Direct mode entry offers locked combat as practice and leaves all saved resources intact',()=>{
  const {ctx,log}=harness(),reference=ctx.save,before=JSON.stringify(ctx.save);
  for(const mode of ['moba','br']){
    ctx.startMode(mode);assert.equal(ctx.minigamePractice,true);
  }
  ctx.startMode('survival');assert.equal(ctx.minigamePractice,false);
  assert.deepEqual(log.navigation,['moba','br','survival']);
  ctx.startMode('unknown');assert.deepEqual(log.navigation,['moba','br','survival']);
  assert.equal(ctx.save,reference);assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persist,0);
});
test('Quick modes remember a valid return screen and ignore unsupported origins',()=>{
  const {ctx,log}=harness(),before=JSON.stringify(ctx.save);
  for(const origin of ['title','world','minigames']){
    ctx.startMode('moba',origin);assert.equal(ctx.modeReturnScreen,origin);assert.equal(ctx.minigamePractice,true);
  }
  ctx.startMode('br','settings');assert.equal(ctx.modeReturnScreen,'minigames');
  const state={practice:ctx.minigamePractice,origin:ctx.modeReturnScreen},navigation=log.navigation.slice();
  ctx.startMode('unknown','world');
  assert.equal(ctx.minigamePractice,state.practice);assert.equal(ctx.modeReturnScreen,state.origin);assert.deepEqual(log.navigation,navigation);
  assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persist,0);
});
test('Direct entry and chapter replay return to story rules after the required memory is recovered',()=>{
  const {ctx,log}=harness({survival:{quote:'first'},moba:{quote:'second'}},true),before=JSON.stringify(ctx.save);
  for(const mode of ['moba','br','survival']){
    ctx.minigamePractice=true;ctx.startMode(mode);assert.equal(ctx.minigamePractice,false);
    ctx.minigamePractice=true;ctx.startMinigameChapter(mode);assert.equal(ctx.minigamePractice,false);
  }
  assert.deepEqual(log.navigation,['moba','moba','br','br','survival','survival']);
  assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persist,0);
});
test('Archive chapter entry still enforces the memory sequence for a new player',()=>{
  const {ctx,log}=harness(),before=JSON.stringify(ctx.save);
  ctx.startMinigameChapter('moba');ctx.startMinigameChapter('br');
  assert.deepEqual(log.navigation,[]);assert.equal(log.toasts.length,2);
  assert.match(log.toasts[0],/Eco I.*El Primer Latido/);assert.match(log.toasts[1],/Eco II.*La Última Guerra del Azúcar/);
  assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persist,0);
});
test('Practice victories and defeats do not reveal story, award currency or write progress',()=>{
  for(const mode of ['moba','br'])for(const won of [true,false])for(const revived of [false,true]){
    const {ctx,nodes,log}=harness({},true),before=JSON.stringify(ctx.save),reference=ctx.save;
    ctx.mobaRevived=revived;ctx.brRevived=revived;
    if(mode==='moba')ctx.mobaEndGame(won);else ctx.brEndGame(won,2);
    assert.equal(ctx.save,reference);assert.equal(JSON.stringify(ctx.save),before,`${mode} practice must preserve saved progress`);
    assert.equal(log.persist,0);assert.equal(log.achievements,0);assert.deepEqual(log.league,[]);assert.deepEqual(log.loreCalls,[]);
    assert.deepEqual(log.reveals,[]);assert.deepEqual(log.timers,[]);assert.equal(log.celebrations,0);
    const shown=[...nodes.values()].map(el=>`${el.textContent} ${el.innerHTML}`).concat(log.confite.map(message=>message.text)).join('\n');
    for(const spoiler of vm.runInContext('MINIGAMES.flatMap(m=>[m.quote,m.truth])',ctx))assert.ok(!shown.includes(spoiler),'Practice must keep the locked memories hidden');
    assert.doesNotMatch(shown,/ECO (?:II|III) RECUPERADO|Bruja Hexadecimal|obligarlo a obedecer/);
  }
});
test('Story combat retains its currency, records, league points and one-time memory rewards',()=>{
  for(const [mode,won,others,coins,wins,placement,league] of [
    ['moba',true,0,245,3,4,[18,10]],
    ['br',true,0,269,2,1,[24,10]],
    ['br',false,2,217,1,3,[8,10]],
  ]){
    const lore=mode==='moba'?{survival:{quote:'first'}}:{survival:{quote:'first'},moba:{quote:'second'}};
    const {ctx,log}=harness(lore);
    if(mode==='moba')ctx.mobaEndGame(won);else ctx.brEndGame(won,others);
    assert.equal(ctx.save.coins,coins);assert.equal(ctx.save[mode==='moba'?'mobaWins':'brWins'],wins);
    assert.equal(ctx.save.brBestPlacement,placement);assert.ok(ctx.save.minigameLore[mode]);
    assert.deepEqual(log.league.map(reward=>reward.amount),league);assert.deepEqual(log.loreCalls,[mode]);
    assert.equal(log.achievements,1);assert.equal(log.timers.length,1);
    log.timers[0].callback();assert.deepEqual(log.reveals,[mode]);assert.equal(log.celebrations,1);
  }
});
