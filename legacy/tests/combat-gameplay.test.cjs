const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function source(name){
  const start=script.indexOf(`function ${name}(`);
  assert.ok(start>=0,`Missing ${name}`);
  return script.slice(start,script.indexOf('\n}',start)+2);
}
function fighter(id,x,y,extra={}){
  return {id,x,y,hp:100,maxHp:100,alive:true,atkCd:0,...extra};
}
function combat(mode='moba',seed=1){
  const nodes=new Map(),log={hits:0,messages:[],result:null};
  const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const math=Object.create(Math);math.random=random;
  const ctx=vm.createContext({Math:math,save:{equippedHero:'dulce'},minigamePractice:true,
    document:{getElementById:id=>{
      if(!nodes.has(id))nodes.set(id,{textContent:'',style:{},classList:{add(){},remove(){}}});
      return nodes.get(id);
    }},minigameCanvasContext:()=>({}),requestAnimationFrame:()=>1,cancelAnimationFrame(){},
    playPop:()=>log.hits++,playCrystal(){},playShuffle(){},
    mgConfiteSay:(...message)=>log.messages.push(message)});
  const run=code=>vm.runInContext(code,ctx);
  for(const name of ['minigameBeginStrike','minigameHit','minigameAdvanceStrike'])run(source(name));
  if(mode==='moba'){
    run(script.slice(script.indexOf('const MOBA_W ='),script.indexOf('\nfunction mobaClampHero(')));
    run('let mobaRevived=false;function mobaBindInput(){}function updateMobaHud(){}function mobaRender(){}');
    for(const name of ['mobaClampHero','mobaNearestEnemy','mobaUseAbility','updateMobaAbilityBtn','mobaStep','startMoba'])run(source(name));
    ctx.recordResult=won=>log.result=won;
    run('function mobaCheckEnd(){if(!mobaHeroes.some(h=>h.team==="enemy"&&h.alive)){recordResult(true);mobaRunning=false;}else if(!mobaHeroes.some(h=>h.team==="ally"&&h.alive)){recordResult(false);mobaRunning=false;}}');
    ctx.startMoba();
  }else{
    run(script.slice(script.indexOf('const BR_W ='),script.indexOf('\nfunction brClamp(')));
    run('let brRevived=false;function brBindInput(){}function updateBrHud(){}function brRender(){}');
    for(const name of ['brClamp','brNearest','brAttack','brUseDash','updateBrAbilityBtn','brStep','startBR'])run(source(name));
    ctx.recordResult=won=>log.result=won;
    run('function brCheckEnd(){if(!brPlayer.alive){recordResult(false);brRunning=false;}else if(brUnits.filter(u=>u.alive).length<=1){recordResult(true);brRunning=false;}}');
    ctx.startBR();
  }
  return {ctx,run,log};
}
test('A bot announces a fixed strike and only damages a target that remains in its mark and reach',()=>{
  const {ctx,log}=combat();
  for(const behavior of ['stay','sidestep','retreat','dead']){
    const attacker=fighter('bot',100,100),target=fighter('player',140,100),flashes=[];
    ctx.minigameBeginStrike(attacker,target);
    assert.equal(target.hp,100);assert.equal(attacker.strike.x,140);
    if(behavior==='sidestep'){target.x=130;target.y=125;}
    if(behavior==='retreat')target.x=165;
    if(behavior==='dead')target.alive=false;
    for(let i=0;i<23;i++)ctx.minigameAdvanceStrike(attacker,[target],46,9,50,flashes,'#FF5C5C');
    assert.equal(target.hp,100,'Preparation must not deal early damage');
    ctx.minigameAdvanceStrike(attacker,[target],46,9,50,flashes,'#FF5C5C');
    assert.equal(target.hp,behavior==='stay'?91:100);
    assert.equal(attacker.strike,null);assert.equal(attacker.atkCd,50,'Even a miss costs recovery time');
    assert.equal(flashes.length,behavior==='stay'?1:0);
  }
  assert.equal(log.hits,1);
});
test('War movement can avoid a prepared hit while stationary players take damage',()=>{
  for(const moving of [false,true]){
    const {ctx,run}=combat();
    ctx.player=fighter('p',170,230,{isPlayer:true,team:'ally',atkCd:9999});
    ctx.enemy=fighter('e',210,230,{team:'enemy'});
    run('mobaHeroes=[player,enemy];mobaPlayer=player;');
    ctx.mobaStep();assert.ok(ctx.enemy.strike);assert.equal(ctx.player.hp,100);
    if(moving)run('mobaJoystick={active:true,dx:0,dy:40};');
    for(let i=0;i<24;i++)ctx.mobaStep();
    assert.equal(ctx.player.hp,moving?100:91);
  }
});
test('Pulse interrupts nearby enemy strikes without affecting allies or distant enemies',()=>{
  const {ctx,run}=combat();
  ctx.player=fighter('p',170,230,{isPlayer:true,team:'ally'});
  ctx.near=fighter('near',210,230,{team:'enemy'});
  ctx.far=fighter('far',300,230,{team:'enemy'});
  ctx.ally=fighter('ally',180,230,{team:'ally'});
  for(const attacker of [ctx.near,ctx.far,ctx.ally])ctx.minigameBeginStrike(attacker,ctx.player);
  run('mobaPlayer=player;mobaHeroes=[player,near,far,ally];');
  ctx.mobaUseAbility();
  assert.equal(ctx.near.hp,74);assert.equal(ctx.near.strike,null);assert.equal(ctx.near.atkCd,24);
  assert.equal(ctx.far.hp,100);assert.ok(ctx.far.strike);
  assert.equal(ctx.ally.hp,100);assert.ok(ctx.ally.strike);
  assert.equal(run('mobaAbilityCd'),260);
  ctx.mobaUseAbility();assert.equal(ctx.near.hp,74,'Cooldown prevents repeated interruptions');
});
test('An empty Pulse preserves cooldown while Dash can start before a drag and evade a real bot strike',()=>{
  const war=combat();war.run('mobaHeroes=mobaHeroes.filter(h=>h.team==="ally");');
  war.ctx.mobaUseAbility();assert.equal(war.run('mobaAbilityCd'),0);
  const mouse=combat('br');mouse.ctx.brUseDash();
  assert.equal(mouse.run('brDashCd'),380);assert.equal(mouse.run('brDashTimer'),55,'Mouse users can click Dash before returning to the canvas');
  const {ctx,run}=combat('br');
  ctx.player=fighter('p',170,230,{isPlayer:true,atkCd:9999});
  ctx.enemy=fighter('e',205,230);
  run('brPlayer=player;brUnits=[player,enemy];');
  ctx.brStep();assert.ok(ctx.enemy.strike);
  for(let i=0;i<12;i++)ctx.brStep();
  run('brJoystick={active:true,dx:0,dy:40};');
  ctx.brUseDash();assert.equal(run('brDashCd'),380);
  for(let i=0;i<12;i++)ctx.brStep();
  assert.equal(ctx.player.hp,100,'Reacting halfway through the windup must still allow a dash escape');
});
test('Joining combat, dodging announced attacks and using Pulse changes the War outcome',()=>{
  for(const active of [false,true]){
    const {ctx,run,log}=combat();
    for(let frame=0;log.result===null&&frame<3600;frame++){
      const {player,units,joystick}=run('({player:mobaPlayer,units:mobaHeroes,joystick:mobaJoystick})');
      if(active&&player.alive){
        const enemies=units.filter(u=>u.alive&&u.team==='enemy')
          .sort((a,b)=>Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y));
        const target=enemies[0];
        if(target){
          const threat=enemies.find(u=>u.strike&&u.strike.targetId===player.id);
          let dx=target.x-player.x,dy=target.y-player.y,distance=Math.hypot(dx,dy);
          if(threat){dx=-(threat.y-player.y);dy=threat.x-player.x;distance=Math.hypot(dx,dy);}
          else if(distance<35){dx=0;dy=0;distance=1;}
          joystick.active=true;joystick.dx=dx/distance*40;joystick.dy=dy/distance*40;
          if(enemies.some(u=>Math.hypot(u.x-player.x,u.y-player.y)<=75))ctx.mobaUseAbility();
        }
      }
      ctx.mobaStep();
    }
    assert.equal(log.result,active,'An active player must be able to turn the initial losing encounter');
  }
});
test('Full battles against AI terminate with finite health and positions across repeated starting layouts',()=>{
  for(const mode of ['moba','br'])for(let seed=1;seed<=12;seed++){
    const {ctx,run,log}=combat(mode,seed);
    let frames=0;
    while(log.result===null&&frames<18000){ctx[mode==='moba'?'mobaStep':'brStep']();frames++;}
    assert.notEqual(log.result,null,`${mode}, seed ${seed} stalled`);
    const units=run(mode==='moba'?'mobaHeroes':'brUnits');
    assert.ok(units.every(u=>Number.isFinite(u.x)&&Number.isFinite(u.y)&&u.hp>=0&&u.hp<=u.maxHp));
    assert.ok(frames>24,'The match must contain real combat rather than end during setup');
  }
});
