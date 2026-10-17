const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function source(name){
  const start=script.indexOf(`function ${name}(`);
  assert.ok(start>=0,`Missing function ${name}`);
  const lineEnd=script.indexOf('\n',start);
  if(script.slice(start,lineEnd).trimEnd().endsWith('}')) return script.slice(start,lineEnd);
  return script.slice(start,script.indexOf('\n}',start)+2);
}
function element(tagName='div'){
  const el={tagName:tagName.toUpperCase(),textContent:'',children:[],attributes:{},style:{},dataset:{},className:'',
    appendChild(child){this.children.push(child);return child;},
    setAttribute(key,value){this.attributes[key]=String(value);if(key.startsWith('data-'))this.dataset[key.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=String(value);},
    getAttribute(key){return this.attributes[key];}};
  let markup='';
  Object.defineProperty(el,'innerHTML',{get:()=>markup,set:value=>{markup=value;el.children=[];}});
  return el;
}
function archive(lore={}){
  const nodes=new Map(),log={navigation:[],toasts:[],persist:0,league:[],timers:[],celebrations:0};
  const save={minigameLore:lore,coins:125,gems:40,lives:3,stars:{1:{1:2}},unlocked:{1:2}};
  const ctx=vm.createContext({save,minigamePractice:false,modeReturnScreen:'minigames',document:{
    getElementById:id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);},
    createElement:tag=>element(tag)},
    confiteSVG:mood=>`<g data-mood="${mood}"></g>`,territoryLandscapeSVG:(id,key)=>`<svg data-territory="${id}" data-context="${key}"></svg>`,celebrateMilestone:()=>log.celebrations++,
    goTo:id=>log.navigation.push(id),toast:text=>log.toasts.push(text),persistSave:()=>log.persist++,
    awardLeaguePoints:(amount,reason)=>{log.league.push({amount,reason});return amount;},
    setTimeout:(callback,ms)=>{log.timers.push({callback,ms});return log.timers.length;},
    showMinigameLoreReveal:id=>log.reveal=id});
  const start=script.indexOf('const MINIGAMES = [');
  assert.ok(start>=0,'Missing narrative chapter definitions');
  vm.runInContext(script.slice(start,script.indexOf('\n];',start)+3),ctx);
  for(const name of ['minigameLoreDone','minigameUnlocked','minigameLoreCount','startMode','startMinigameChapter','unlockMinigameLore','cinematicScene']) vm.runInContext(source(name),ctx);
  return {ctx,nodes,log};
}
function svgIds(scene){ return [...scene.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]); }
function checkReferences(scene){
  const ids=svgIds(scene);
  assert.ok(ids.length>0,'Scene must contain its own definitions');
  assert.equal(new Set(ids).size,ids.length,'Scene IDs must be unique');
  for(const id of ids) assert.match(id,/^[A-Za-z][A-Za-z0-9_-]*$/);
  for(const match of scene.matchAll(/url\(#([^)]*)\)/g)) assert.ok(ids.includes(match[1]),`Missing SVG reference ${match[1]}`);
  return ids;
}
test('Archive chapters unlock in narrative order from recovered memories',()=>{
  const {ctx,log}=archive(),before=JSON.stringify(ctx.save);
  assert.equal(ctx.minigameUnlocked('survival'),true);
  assert.equal(ctx.minigameUnlocked('moba'),false);
  assert.equal(ctx.minigameUnlocked('br'),false);
  assert.equal(ctx.minigameUnlocked('unknown'),false);
  assert.equal(ctx.minigameLoreCount(),0);
  assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persist,0);
  ctx.save.minigameLore.survival={quote:'first'};
  assert.equal(ctx.minigameUnlocked('moba'),true);assert.equal(ctx.minigameUnlocked('br'),false);
  assert.equal(ctx.minigameLoreCount(),1);
  ctx.save.minigameLore.moba={quote:'second'};
  assert.equal(ctx.minigameUnlocked('br'),true);assert.equal(ctx.minigameLoreCount(),2);
  ctx.save.minigameLore.br={quote:'third'};
  assert.equal(ctx.minigameLoreCount(),3);
});
test('Chapter entry dispatches only accessible modes and preserves the save',()=>{
  const {ctx,log}=archive(),before=JSON.stringify(ctx.save);
  for(const id of ['moba','br','unknown']) ctx.startMinigameChapter(id);
  assert.deepEqual(log.navigation,[]);assert.equal(log.toasts.length,3);
  assert.match(log.toasts[0],/Eco I.*El Primer Latido/);
  assert.match(log.toasts[1],/Eco II.*La Última Guerra del Azúcar/);
  ctx.startMinigameChapter('survival');
  assert.deepEqual(log.navigation,['survival']);
  assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persist,0);
  ctx.save.minigameLore.survival={};ctx.startMinigameChapter('moba');
  ctx.save.minigameLore.moba={};ctx.startMinigameChapter('br');
  assert.deepEqual(log.navigation,['survival','moba','br']);
});
test('Survival navigation starts the shared match-3 screen before looking for an intermediate screen',()=>{
  let starts=0;
  const document=new Proxy({}, {get:(_,key)=>assert.fail(`Survival must not access document.${String(key)} before startSurvival`)});
  const ctx=vm.createContext({document,startSurvival:()=>starts++});vm.runInContext(source('goTo'),ctx);
  ctx.goTo('survival');assert.equal(starts,1);
});
test('HUD refresh keeps Survival seconds after swaps while ordinary levels retain their move counter',()=>{
  const nodes=new Map(),node=id=>{
    if(!nodes.has(id)){
      const el=element(),classes=new Set();
      el.classList={toggle:(name,on)=>on?classes.add(name):classes.delete(name),contains:name=>classes.has(name)};
      el.style.setProperty=(key,value)=>el.style[key]=value;nodes.set(id,el);
    }
    return nodes.get(id);
  };
  const ctx=vm.createContext({document:{getElementById:node},cur:{isSurvival:true,movesLeft:9999,score:0},
    survivalTimeMs:12000,SURVIVAL_MAX_TIME:18000,updateDuelRaceUI(){},updateFreneticBadge(){}});
  for(const name of ['updateSurvivalHud','updateHud'])vm.runInContext(source(name),ctx);
  ctx.updateHud();assert.equal(node('hud-moves').textContent,'12.0s');
  ctx.cur.movesLeft--;ctx.cur.score=450;ctx.survivalTimeMs=6300;ctx.updateHud();
  assert.equal(node('hud-moves').textContent,'6.3s');assert.equal(node('hud-score').textContent,'450');
  assert.equal(node('survival-timer-fill').style.width,'35%');assert.equal(node('survival-timer-fill').className,'warn');
  assert.equal(node('restoration-percent').textContent,'100%');assert.equal(node('hud-moves').classList.contains('moves-critical'),false);
  ctx.cur={isSurvival:false,movesLeft:3,score:200,type:'score',goal:1000};ctx.updateHud();
  assert.equal(String(node('hud-moves').textContent),'3');assert.equal(node('hud-score').textContent,'200');
  assert.equal(node('progress-fill').style.width,'20%');assert.equal(node('hud-moves').classList.contains('moves-critical'),true);
});
test('Recovering a lore memory grants its currency and league reward exactly once',()=>{
  const {ctx,log}=archive(),before=JSON.stringify(ctx.save);
  assert.equal(ctx.unlockMinigameLore('unknown'),false);
  assert.equal(JSON.stringify(ctx.save),before);
  assert.equal(ctx.unlockMinigameLore('survival'),true);
  const entry=ctx.save.minigameLore.survival;
  assert.equal(typeof entry.at,'number');assert.ok(Number.isFinite(entry.at));
  assert.match(entry.quote,/latido/);assert.equal(ctx.save.coins,175);
  assert.equal(log.persist,1);assert.deepEqual(log.league,[{amount:10,reason:'Eco I recuperado'}]);
  assert.equal(log.timers.length,1);assert.equal(log.timers[0].ms,650);
  log.timers[0].callback();assert.equal(log.reveal,'survival');assert.equal(log.celebrations,1);
  const recovered=JSON.stringify(ctx.save);
  assert.equal(ctx.unlockMinigameLore('survival'),false);
  assert.equal(JSON.stringify(ctx.save),recovered);assert.equal(ctx.save.minigameLore.survival,entry);
  assert.equal(log.persist,1);assert.equal(log.league.length,1);assert.equal(log.timers.length,1);assert.equal(log.celebrations,1);
});
test('Echo scenes are distinct standalone vectors with unique IDs in archive and live contexts',()=>{
  const ctx=vm.createContext({});vm.runInContext(source('echoSceneSVG'),ctx);
  const all=[],scenes=[];
  for(const key of ['archive','live']) for(const id of ['survival','moba','br']){
    const scene=ctx.echoSceneSVG(id,key);scenes.push(scene);
    assert.match(scene,/<svg\b[^>]*viewBox="0 0 360 210"/);
    assert.match(scene,/aria-hidden="true"/);
    assert.doesNotMatch(scene,/<(?:image|foreignObject|script)\b|\b(?:href|src)\s*=|url\(\s*[^#]|data:|NaN|undefined|Infinity/i);
    const ids=checkReferences(scene);
    assert.ok(ids.every(value=>value.startsWith(`echo-${key}-${id}-`)));
    all.push(...ids);
  }
  assert.equal(new Set(scenes).size,6);assert.equal(new Set(all).size,all.length);
  assert.equal(ctx.echoSceneSVG('unknown','archive'),ctx.echoSceneSVG('survival','archive'));
  assert.equal(ctx.echoSceneSVG('survival'),ctx.echoSceneSVG('survival','archive'));
});
test('Echo vector contexts are sanitized before entering IDs or references',()=>{
  const ctx=vm.createContext({});vm.runInContext(source('echoSceneSVG'),ctx);
  const key='archive"><script src="https://example.invalid/scene"></script> ¿#';
  const scene=ctx.echoSceneSVG('moba',key);
  assert.ok(!scene.includes(key));assert.doesNotMatch(scene,/<script|\bsrc=|https:|NaN|undefined/);
  checkReferences(scene);
});
test('Archive rendering is idempotent, exposes native entry buttons and never writes progress',()=>{
  const {ctx,nodes,log}=archive();
  for(const name of ['echoSceneSVG','renderMinigames']) vm.runInContext(source(name),ctx);
  const saveReference=ctx.save,before=JSON.stringify(ctx.save);
  ctx.renderMinigames();
  const cards=nodes.get('mg-list').children;
  assert.equal(cards.length,3);assert.ok(cards.every(card=>card.tagName==='BUTTON'));
  assert.deepEqual(cards.map(card=>card.dataset.echo),['survival','moba','br']);
  assert.ok(cards.every(card=>card.getAttribute('aria-disabled')==='false'));
  assert.ok(cards.every(card=>!card.disabled),'Every mode remains playable while its memory is locked');
  assert.match(cards[1].innerHTML,/práctica/i);assert.match(cards[2].innerHTML,/práctica/i);
  assert.doesNotMatch(cards[1].innerHTML,/Esos no somos nosotros/);assert.doesNotMatch(cards[2].innerHTML,/La niebla no perseguía/);
  for(const [i,label] of ['Supervivencia','5v5','Royale'].entries()) assert.ok(cards[i].innerHTML.includes(label));
  assert.equal(nodes.get('mg-progress-badge').textContent,'0/3');
  assert.equal(nodes.get('mg-archive-fill').style.width,'0%');
  cards[0].onclick();assert.equal(ctx.minigamePractice,false);
  cards[1].onclick();assert.equal(ctx.minigamePractice,true);
  cards[2].onclick();assert.equal(ctx.minigamePractice,true);
  assert.deepEqual(log.navigation,['survival','moba','br']);assert.equal(log.toasts.length,0);
  const first=cards.map(card=>card.innerHTML);
  ctx.renderMinigames();
  assert.deepEqual(nodes.get('mg-list').children.map(card=>card.innerHTML),first);
  assert.equal(ctx.save,saveReference);assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persist,0);
});
test('Recovered echoes retain replay, reveal their quote and advance the archive meter',()=>{
  const {ctx,nodes,log}=archive({survival:{quote:'preserved historical value'},moba:{quote:'second'}});
  for(const name of ['echoSceneSVG','renderMinigames']) vm.runInContext(source(name),ctx);
  const before=JSON.stringify(ctx.save);ctx.renderMinigames();
  const cards=nodes.get('mg-list').children;
  assert.equal(nodes.get('mg-progress-badge').textContent,'2/3');assert.equal(nodes.get('mg-archive-fill').style.width,'67%');
  assert.ok(cards[0].className.includes('completed'));assert.ok(cards[1].className.includes('completed'));
  assert.ok(!cards[2].className.includes('locked'));
  assert.match(cards[0].innerHTML,/Ese latido/);assert.doesNotMatch(cards[2].innerHTML,/La niebla no perseguía/);
  cards[0].onclick();cards[2].onclick();assert.deepEqual(log.navigation,['survival','br']);
  assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persist,0);
});
function drawingContext(){
  const calls=[];let depth=0;
  const record=(name,args)=>{
    for(const value of args) if(typeof value==='number') assert.ok(Number.isFinite(value),`${name} received a non-finite coordinate`);
    if(name==='save')depth++;
    if(name==='restore'){depth--;assert.ok(depth>=0,'Canvas restores must have a matching save');}
    calls.push({name,args});
  };
  const ctx=new Proxy({}, {
    get(target,name){
      if(name in target)return target[name];
      if(name==='createLinearGradient'||name==='createRadialGradient')return (...args)=>{
        record(name,args);return {addColorStop:(...values)=>record('addColorStop',values)};
      };
      return (...args)=>record(name,args);
    },
    set(target,name,value){if(typeof value==='number')assert.ok(Number.isFinite(value),`${name} must stay finite`);target[name]=value;return true;}
  });
  return {ctx,calls,assertBalanced:()=>assert.equal(depth,0,'Canvas transformations must not leak between frames')};
}
test('Combat arenas reuse deterministic native canvas artwork for each mode and size',()=>{
  const canvases=[],drawings=[],window={devicePixelRatio:1},ctx=vm.createContext({window,document:{createElement:tag=>{
    assert.equal(tag,'canvas');const drawing=drawingContext(),canvas={getContext:kind=>{assert.equal(kind,'2d');return drawing.ctx;}};
    canvases.push(canvas);drawings.push(drawing);return canvas;
  }}});
  vm.runInContext(source('minigameArenaArt'),ctx);
  const war=ctx.minigameArenaArt('moba',340,460),rift=ctx.minigameArenaArt('br',340,460);
  assert.equal(ctx.minigameArenaArt('moba',340,460),war);assert.equal(ctx.minigameArenaArt('br',340,460),rift);
  assert.notEqual(war,rift);assert.equal(canvases.length,2);
  assert.equal(war.width,340);assert.equal(war.height,460);
  assert.notEqual(ctx.minigameArenaArt('moba',680,920),war);assert.equal(canvases.length,3);
  window.devicePixelRatio=2;const retina=ctx.minigameArenaArt('moba',340,460);
  assert.notEqual(retina,war);assert.equal(retina.width,680);assert.equal(retina.height,920);
  assert.equal(ctx.minigameArenaArt('moba',340,460),retina);assert.equal(canvases.length,4);
  window.devicePixelRatio=3;assert.equal(ctx.minigameArenaArt('moba',340,460),retina);assert.equal(canvases.length,4);
  assert.deepEqual(drawings[3].calls.find(call=>call.name==='scale').args,[2,2]);
  for(const drawing of drawings){drawing.assertBalanced();assert.ok(drawing.calls.some(call=>call.name==='fill'));}
});
test('Combat canvas buffers support Retina while capping density and preserving responsive proportions',()=>{
  for(const [density,expected] of [[1,1],[2,2],[3,2],[.5,1],[0,1],[undefined,1],['2',2],[NaN,1]]){
    const drawing=drawingContext(),canvas={style:{},getContext:()=>drawing.ctx};
    const ctx=vm.createContext({window:{devicePixelRatio:density}});vm.runInContext(source('minigameCanvasContext'),ctx);
    assert.equal(ctx.minigameCanvasContext(canvas,340,460),drawing.ctx);
    assert.equal(canvas.width,340*expected);assert.equal(canvas.height,460*expected);
    assert.equal(canvas.width/canvas.height,340/460);
    assert.deepEqual(drawing.calls.find(call=>call.name==='setTransform').args,[expected,0,0,expected,0,0]);
    assert.equal(canvas.style.width,'auto');assert.equal(canvas.style.height,'auto');
    assert.equal(canvas.style.maxWidth,'min(100%, 340px)');assert.equal(canvas.style.maxHeight,'min(100%, 460px)');
  }
});
test('Combat pointer coordinates remain in logical arena space at every supported screen density',()=>{
  for(const density of [1,2,3]) for(const fraction of [1,.5]){
    const rect={left:15,top:23,width:340*fraction,height:460*fraction};
    const canvas={width:340*Math.min(density,2),height:460*Math.min(density,2),getBoundingClientRect:()=>rect};
    const ctx=vm.createContext({MOBA_W:340,MOBA_H:460,BR_W:340,BR_H:460,document:{getElementById:id=>{
      assert.ok(id==='mb-canvas'||id==='br-canvas');return canvas;
    }}});
    for(const name of ['mobaPointerPos','brPointerPos'])vm.runInContext(source(name),ctx);
    const event={clientX:rect.left+rect.width*.25,clientY:rect.top+rect.height*.75};
    for(const pointer of [ctx.mobaPointerPos,ctx.brPointerPos]){
      const position=pointer(event);assert.equal(position.x,85);assert.equal(position.y,345);
    }
  }
});
test('Combat motion reads reduced-motion and page visibility changes without adding listeners',()=>{
  let queries=0;const media={matches:false},document={hidden:false};
  const ctx=vm.createContext({document,window:{matchMedia:query=>{queries++;assert.equal(query,'(prefers-reduced-motion: reduce)');return media;}}});
  vm.runInContext(source('minigameMotionAllowed'),ctx);
  assert.equal(ctx.minigameMotionAllowed(),true);
  media.matches=true;assert.equal(ctx.minigameMotionAllowed(),false);
  media.matches=false;document.hidden=true;assert.equal(ctx.minigameMotionAllowed(),false);
  document.hidden=false;assert.equal(ctx.minigameMotionAllowed(),true);assert.equal(queries,1);
});
test('Both combat renderers draw finite frames without changing combat state or starting timers',()=>{
  for(const reduced of [false,true]){
    const war=drawingContext(),rift=drawingContext(),arenas=[];
    const unit={x:170,y:230,hp:60,maxHp:100,icon:'★',alive:true,isPlayer:true};
    const heroes=[{...unit,team:'ally'},{...unit,x:90,hp:120,maxHp:120,isPlayer:false,isHero:true,team:'ally'},
      {...unit,x:240,hp:0,isPlayer:false,team:'enemy'}];
    const units=[{...unit},{...unit,x:80,hp:150,isPlayer:false}];
    const zone={cx:170,cy:230,r:42},flashes=[{x:170,y:230,r:75,life:.4,hue:'#FF5C5C',ring:true}];
    const joystick={active:true,baseX:170,baseY:390,dx:12,dy:-8};
    const ctx=vm.createContext({document:{hidden:false,createElement:()=>{
      const canvas={getContext:()=>drawingContext().ctx};arenas.push(canvas);return canvas;
    }},window:{devicePixelRatio:2,matchMedia:()=>({matches:reduced})},
      mbCtx:war.ctx,brCtx:rift.ctx,MOBA_W:340,MOBA_H:460,MOBA_HERO_R:12,BR_W:340,BR_H:460,BR_UNIT_R:11,
      mobaHeroes:heroes,brUnits:units,brZone:zone,mobaFlashes:flashes,brFlashes:flashes,mobaJoystick:joystick,brJoystick:joystick,
      getActiveSkin:()=>({cheeks:'#d6a5ae'})});
    for(const name of ['minigameArenaArt','minigameMotionAllowed','minigameDrawUnit','mobaRender','brRender']) vm.runInContext(source(name),ctx);
    const before=JSON.stringify([heroes,units,zone,flashes,joystick]);
    ctx.mobaRender();ctx.brRender();ctx.mobaRender();ctx.brRender();
    assert.equal(JSON.stringify([heroes,units,zone,flashes,joystick]),before);assert.equal(arenas.length,2);
    for(const drawing of [war,rift]){
      drawing.assertBalanced();assert.equal(drawing.calls.filter(call=>call.name==='drawImage').length,2);
      for(const {args} of drawing.calls.filter(call=>call.name==='drawImage'))assert.deepEqual(args.slice(1),[0,0,340,460]);
      for(const {args} of drawing.calls.filter(call=>call.name==='fillRect'))assert.ok(args[2]>=0&&args[3]>=0,'Health bars must remain drawable');
    }
  }
});
test('Painted enemy sprites crop the final cell of their 4 by 2 sheet and retain clamped health bars',()=>{
  for(const [width,height] of [[1024,512],[2048,1024]])for(const [hp,ratio] of [[-10,0],[60,.6],[120,1]]){
    const drawing=drawingContext(),sprite={complete:true,naturalWidth:width,naturalHeight:height};
    const unit={x:170,y:230,hp,maxHp:100,icon:'★',alive:true,isPlayer:false},before=JSON.stringify(unit),r=12;
    const ctx=vm.createContext({cinematicImages:{guardian:sprite}});vm.runInContext(source('minigameDrawUnit'),ctx);
    ctx.minigameDrawUnit(drawing.ctx,unit,r,'#9885ab',true);
    const images=drawing.calls.filter(call=>call.name==='drawImage');assert.equal(images.length,1);
    assert.equal(images[0].args[0],sprite);
    assert.deepEqual(images[0].args.slice(1),[width*3/4,height/2,width/4,height/2,unit.x-r*1.35,unit.y-r*1.6,r*2.7,r*2.7]);
    const bars=drawing.calls.filter(call=>call.name==='fillRect');assert.equal(bars.length,2);
    const w=r*2+3;assert.deepEqual(bars[1].args,[unit.x-w/2,unit.y-r-7,w*ratio,3]);
    assert.equal(JSON.stringify(unit),before);drawing.assertBalanced();
  }
});
test('Unit drawing keeps its native fallback while sprites load or fail and leaves allied icons readable',()=>{
  for(const sprite of [undefined,{complete:false,naturalWidth:1024,naturalHeight:512},{complete:true,naturalWidth:0,naturalHeight:0}]){
    const drawing=drawingContext(),ctx=vm.createContext(sprite===undefined?{}:{cinematicImages:{guardian:sprite}});
    vm.runInContext(source('minigameDrawUnit'),ctx);
    ctx.minigameDrawUnit(drawing.ctx,{x:170,y:230,hp:60,maxHp:100,isPlayer:false},12,'#9885ab',true);
    assert.equal(drawing.calls.filter(call=>call.name==='drawImage').length,0);
    assert.ok(drawing.calls.some(call=>call.name==='arc'));assert.equal(drawing.calls.filter(call=>call.name==='fillRect').length,2);drawing.assertBalanced();
  }
  const drawing=drawingContext(),ctx=vm.createContext({cinematicImages:{guardian:{complete:true,naturalWidth:1024,naturalHeight:512}}});
  vm.runInContext(source('minigameDrawUnit'),ctx);ctx.minigameDrawUnit(drawing.ctx,{x:170,y:230,hp:100,maxHp:100,icon:'★',isPlayer:true},12,'#d6a5ae',false);
  assert.equal(drawing.calls.filter(call=>call.name==='drawImage').length,0);assert.ok(drawing.calls.some(call=>call.name==='fillText'&&call.args[0]==='★'));drawing.assertBalanced();
});
function hexArchive(unlocked=4){
  const nodes=new Map(),log={starts:[],persist:0};
  const node=id=>{if(!nodes.has(id))nodes.set(id,element());return nodes.get(id);};
  const symbols=['story','timed','zen'].map(dgSymbol=>Object.assign(element(),{dataset:{dgSymbol}}));
  const save={dgUnlocked:unlocked,dgStars:{1:3,2:2,3:1},soulShards:125,playerLevel:3,xp:70,dgTimedBest:3400,dgZenBest:6200,
    dgAmbientOn:true,dgPowerups:{bomb:2,curse:1,crystal:0},pieceSkin:'gothic',unlockedPieceSkins:{gothic:true}};
  const ctx=vm.createContext({save,document:{getElementById:node,createElement:tag=>element(tag),
    querySelector:selector=>node(selector),querySelectorAll:()=>symbols},
    confiteSVG:mood=>`<g data-mood="${mood}"></g>`,dgStartLevel:n=>log.starts.push(n),persistSave:()=>log.persist++});
  for(const name of ['dgShadowCountForLevel','dgLevelDef','dgXpForLevel','dgConfitePortrait','dgSymbolSVG','dgLandscapeSVG','dgSceneMarkup','renderDgMenu','renderDgLevels','renderDgShop'])vm.runInContext(source(name),ctx);
  for(const [name,end] of [['DG_LEVEL_NAMES','\n};'],['DG_PIECE_SKINS','\n];'],['DG_LEVELS','\n']]){
    const start=script.indexOf(`const ${name} =`);assert.ok(start>=0,`Missing ${name}`);
    const finish=script.indexOf(end,start);vm.runInContext(script.slice(start,finish+end.length),ctx);
  }
  return {ctx,nodes,log,symbols};
}
test('HEX landscapes resolve native vector definitions uniquely across all six screen contexts',()=>{
  const ctx=vm.createContext({});vm.runInContext(source('dgLandscapeSVG'),ctx);
  const ids=[];
  for(const key of ['menu','levels','shop','game','curse','victory']){
    const scene=ctx.dgLandscapeSVG(key,key==='victory');
    assert.match(scene,/<svg\b[^>]*viewBox="0 0 360 220"/);assert.match(scene,/aria-hidden="true"/);
    assert.doesNotMatch(scene,/<(?:image|foreignObject|script)\b|\b(?:href|src)\s*=|url\(\s*[^#]|data:|NaN|undefined|Infinity/i);
    const local=checkReferences(scene);assert.ok(local.every(id=>id.startsWith(`hex-land-${key}-`)));ids.push(...local);
  }
  assert.equal(new Set(ids).size,ids.length);
  assert.notEqual(ctx.dgLandscapeSVG('victory',true),ctx.dgLandscapeSVG('victory',false));
  const unsafe='menu"><script src="https://example.invalid/scene"></script>',sanitized=ctx.dgLandscapeSVG(unsafe);
  assert.ok(!sanitized.includes(unsafe));assert.doesNotMatch(sanitized,/<script|\bsrc=|https:/);checkReferences(sanitized);
});
test('HEX story route has twenty native nodes and preserves unlocked-level click gating',()=>{
  for(const unlocked of [1,4,20]){
    const {ctx,nodes,log}=hexArchive(unlocked),before=JSON.stringify(ctx.save);ctx.renderDgLevels();
    const steps=nodes.get('dg-level-grid').children;assert.equal(steps.length,20);
    steps.forEach((step,i)=>{
      const button=step.children[0],accessible=i<unlocked;
      assert.equal(button.tagName,'BUTTON');assert.equal(button.disabled,!accessible);
      assert.equal(typeof button.onclick,accessible?'function':'undefined');
      if(accessible){assert.match(button.getAttribute('aria-label'),new RegExp(`Nivel ${i+1}:`));button.onclick();}
      else {assert.match(button.getAttribute('aria-label'),/bloqueado/);assert.match(step.children[1].innerHTML,/Tras la niebla/);}
      assert.equal(button.className.includes('is-current'),i+1===unlocked);
    });
    assert.deepEqual(log.starts,Array.from({length:unlocked},(_,i)=>i+1));
    assert.equal(String(nodes.get('dg-total-stars').textContent),'6');
    assert.match(nodes.get('dg-levels-scene').innerHTML,/dg-scene-confite/);
    assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persist,0);
    ctx.renderDgLevels();assert.equal(nodes.get('dg-level-grid').children.length,20);
  }
});
test('HEX menu and relic shop rerender without granting, spending or changing saved progress',()=>{
  const {ctx,nodes,log,symbols}=hexArchive(),saveReference=ctx.save,before=JSON.stringify(ctx.save);
  const snapshot=()=>JSON.stringify([...nodes].map(([id,el])=>[id,el.innerHTML,el.textContent,el.style]));
  ctx.renderDgMenu();ctx.renderDgShop();const first=snapshot();
  ctx.renderDgMenu();ctx.renderDgShop();assert.equal(snapshot(),first);
  assert.equal(String(nodes.get('dg-shards').textContent),'125');assert.equal(String(nodes.get('dg-shop-shards').textContent),'125');
  assert.equal(nodes.get('dg-xp-text').textContent,'70 / 180 XP');assert.equal(nodes.get('dg-xp-fill').style.width,'39%');
  assert.ok(symbols.every(symbol=>symbol.innerHTML.includes('<svg')));
  assert.match(nodes.get('dg-shop-powerups').innerHTML,/HEX BOMB/);assert.match(nodes.get('dg-shop-powerups').innerHTML,/Tienes 2/);
  assert.match(nodes.get('dg-shop-skins').innerHTML,/Equipado/);assert.match(nodes.get('dg-shop-skins').innerHTML,/dgUnlockSkinWithAd\('void'\)/);
  assert.equal(ctx.save,saveReference);assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persist,0);
});
