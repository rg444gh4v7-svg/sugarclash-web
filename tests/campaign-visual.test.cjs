const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function source(name){
  const start=script.indexOf(`function ${name}(`);
  assert.ok(start>=0,`Missing function ${name}`);
  return script.slice(start,script.indexOf('\n}',start)+2);
}
function constant(name,closing='};'){
  const start=script.search(new RegExp(`const ${name}\\s*=`));
  assert.ok(start>=0,`Missing constant ${name}`);
  return script.slice(start,script.indexOf(`\n${closing}`,start)+closing.length+1);
}
function campaign(territory=2,cleared=4,reduced=false){
  const save={coins:123,gems:45,lastTerritory:1,buildings:{casa:true},
    stars:Object.fromEntries(Array.from({length:8},(_,i)=>[i+1,Object.fromEntries(
      Array.from({length:i+1<territory?10:i+1===territory?cleared:0},(_,n)=>[n+1,n%3+1]))])),
    unlocked:Object.fromEntries(Array.from({length:8},(_,i)=>[i+1,i+1<territory?11:i+1===territory?cleared+1:1]))};
  const log={observed:[],mochi:[],landscapes:[],scroll:[],media:[],persists:0};
  const mission={innerHTML:'',style:{values:{},setProperty(key,value){this.values[key]=value;}}};
  const atlas={open:false,scrollIntoView:options=>log.scroll.push(options)};
  const ctx=vm.createContext({save,TOTAL_LEVELS:10,
    LEVELS_BY_TERRITORY:Object.fromEntries(Array.from({length:8},(_,i)=>[i+1,Array.from({length:10},(_,n)=>({n:n+1}))])),
    document:{getElementById:id=>{
      assert.ok(id==='campaign-mission'||id==='world-atlas',`Unexpected DOM lookup ${id}`);
      return id==='campaign-mission'?mission:atlas;
    }},
    window:{matchMedia:query=>{log.media.push(query);return {matches:reduced};}},
    observeAtlas:element=>log.observed.push(element),
    mochiLandscapeSVG:(key,progress)=>{log.mochi.push({key,progress});return `<svg data-mochi="${key}" data-progress="${progress}"></svg>`;},
    territoryLandscapeSVG:(id,key,progress)=>{log.landscapes.push({id,key,progress});return `<svg data-territory="${id}"></svg>`;},
    confiteSVG:mood=>`<g data-mood="${mood}"></g>`,persistSave:()=>log.persists++});
  for(const [name,closing] of [['TERRITORIES','];'],['CAMPAIGN_ARCS','};'],['ATLAS_MOMENTS','};']]) vm.runInContext(constant(name,closing),ctx);
  for(const name of ['territoryProgress','territoryUnlocked','campaignNext','atlasFeeling','renderCampaignMission','openWorldAtlas']) vm.runInContext(source(name),ctx);
  return {ctx,mission,atlas,log};
}
test('Mochi mission renders real campaign progress, territory, route and continuation CTA',()=>{
  const {ctx,mission,log}=campaign();ctx.renderCampaignMission();
  assert.match(mission.innerHTML,/Capítulo 02 · 40% restaurado/);
  assert.match(mission.innerHTML,/<h2>Los Jardines de Mochi<\/h2>/);
  assert.match(mission.innerHTML,/<p class="campaign-purpose">Sigue la melodía a través del jardín\.<\/p>/);
  assert.match(mission.innerHTML,/<button class="campaign-play" onclick="continueCampaign\(\)">Continuar · Ruta 5<\/button>/);
  assert.match(mission.innerHTML,/aria-label="Continuar historia en Los Jardines de Mochi, nivel 5"/);
  assert.match(mission.innerHTML,/La melodía bajo la niebla · Ruta 5\/10/);
  assert.match(mission.innerHTML,/campaign-scene is-mochi/);
  assert.ok(mission.innerHTML.includes(ctx.atlasFeeling(2,.4).quote));
  assert.equal(mission.style.values['--mission-color'],'#FFB7C5');
  assert.deepEqual(log.mochi,[{key:'campaign',progress:.4}]);assert.equal(log.landscapes.length,0);
  assert.match(mission.innerHTML,/id="confite-map"[^>]*>[\s\S]*?data-mood="happy"/);
  assert.match(mission.innerHTML,/id="confite-world-bubble" aria-live="polite"/);
});
test('Route ten presents the guardian and the final narrative stage before completion',()=>{
  const {ctx,mission,log}=campaign(2,9);ctx.renderCampaignMission();
  assert.match(mission.innerHTML,/Capítulo 02 · 90% restaurado/);
  assert.match(mission.innerHTML,/Libera el último sendero de la niebla\./);
  assert.match(mission.innerHTML,/<button class="campaign-play" onclick="continueCampaign\(\)">Continuar · Guardián<\/button>/);
  assert.match(mission.innerHTML,/nivel 10"[^>]*>✦<\/button>/);
  assert.match(mission.innerHTML,/Ruta 10\/10/);
  assert.doesNotMatch(mission.innerHTML,/Historia restaurada|Volver a jugar/);
  assert.deepEqual(log.mochi,[{key:'campaign',progress:.9}]);
});
test('Completed campaign returns to the Great Crystal with replay and celebrating Confite',()=>{
  const {ctx,mission,log}=campaign(8,10);ctx.renderCampaignMission();
  assert.match(mission.innerHTML,/Historia restaurada/);
  assert.match(mission.innerHTML,/<h2>La Capital de Cristal<\/h2>/);
  assert.match(mission.innerHTML,/Dulcelandia vuelve a respirar\. Aún quedan recuerdos por visitar\./);
  assert.match(mission.innerHTML,/aria-label="Volver al Gran Cristal"/);
  assert.match(mission.innerHTML,/<button class="campaign-play" onclick="continueCampaign\(\)">Volver a jugar<\/button>/);
  assert.match(mission.innerHTML,/Vuelve a casa/);assert.match(mission.innerHTML,/data-mood="celebrate"/);
  assert.match(mission.innerHTML,/campaign-landscape legacy/);assert.doesNotMatch(mission.innerHTML,/scene-water-glint/);
  assert.deepEqual(log.landscapes,[{id:8,key:'campaign',progress:1}]);assert.equal(log.mochi.length,0);
});
test('Rerendering replaces the mission idempotently without writing campaign progress or currency',()=>{
  const {ctx,mission,log}=campaign(),saveReference=ctx.save,before=JSON.stringify(ctx.save);
  ctx.renderCampaignMission();const first=mission.innerHTML;
  ctx.renderCampaignMission();
  assert.equal(mission.innerHTML,first);assert.equal(ctx.save,saveReference);assert.equal(JSON.stringify(ctx.save),before);
  assert.equal(log.persists,0);assert.deepEqual(log.observed,[mission,mission]);
  assert.equal([...mission.innerHTML.matchAll(/\bid="confite-map"/g)].length,1);
  assert.equal([...mission.innerHTML.matchAll(/\bid="confite-world-bubble"/g)].length,1);
  assert.equal([...mission.innerHTML.matchAll(/class="campaign-play"/g)].length,1);
  assert.equal([...mission.innerHTML.matchAll(/class="scene-petal"/g)].length,4);
});
test('Opening the complete atlas respects the current reduced-motion preference without touching the save',()=>{
  for(const reduced of [false,true]){
    const {ctx,atlas,log}=campaign(2,4,reduced),before=JSON.stringify(ctx.save);
    ctx.openWorldAtlas();
    assert.equal(atlas.open,true);assert.equal(log.scroll.length,1);
    assert.equal(log.scroll[0].behavior,reduced?'auto':'smooth');assert.equal(log.scroll[0].block,'start');
    assert.deepEqual(log.media,['(prefers-reduced-motion:reduce)']);
    assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persists,0);
  }
});
