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
function village(coins=100,buildings={casa:true}){
  const log={persist:0,achievements:0,buildSound:0,renders:[],bubble:'',celebrations:[]};
  const ctx=vm.createContext({save:{coins,buildings:{...buildings}},villageSelectedId:null,
    playBuild:()=>log.buildSound++,persistSave:()=>log.persist++,checkAchievements:()=>log.achievements++,
    renderVillage:id=>log.renders.push(id),setVillageBubble:text=>log.bubble=text,celebrateMilestone:(_element,label)=>log.celebrations.push(label),document:{querySelector:()=>null}});
  const start=script.indexOf('const BUILDINGS = [');
  vm.runInContext(script.slice(start,script.indexOf('\n];',start)+3),ctx);
  for(const name of ['villageBuildingSVG','villageBuildingState','buildingAbilityText','buildStructure','buildStructureWithAd']) vm.runInContext(source(name),ctx);
  return {ctx,log};
}
test('Village has ten distinct finite buildings with no new SVG IDs',()=>{
  const {ctx}=village(),ids=vm.runInContext('BUILDINGS.map(b=>b.id)',ctx);
  assert.equal(ids.length,10);
  const arts=ids.map(id=>ctx.villageBuildingSVG(id));
  assert.equal(new Set(arts).size,10);
  for(const art of arts){assert.doesNotMatch(art,/NaN|undefined|\bid=/);assert.match(art,/<path|<rect/);}
  assert.match(arts.join(''),/class="v-art-window"/);
});
test('Village exposes the first missing prerequisite, not every unbuilt place',()=>{
  const {ctx}=village();
  assert.equal(ctx.villageBuildingState('casa'),'built');
  assert.equal(ctx.villageBuildingState('puesto'),'unlocked-next');
  assert.equal(ctx.villageBuildingState('fuente'),'locked');
  assert.equal(ctx.villageBuildingState('unknown'),'missing');
});
test('Imported sparse progress is preserved without incorrectly skipping prerequisites',()=>{
  const {ctx}=village(1000,{casa:true,faro:true});
  assert.equal(ctx.villageBuildingState('faro'),'built');
  assert.equal(ctx.villageBuildingState('puesto'),'unlocked-next');
  assert.equal(ctx.villageBuildingState('fuente'),'locked');
  ctx.buildStructure('fuente');assert.equal(ctx.save.coins,1000);assert.equal(ctx.save.buildings.fuente,undefined);
  assert.equal(ctx.save.buildings.faro,true);
});
test('Explicit construction charges the exact price once and preserves the selected place',()=>{
  const {ctx,log}=village(100);
  ctx.buildStructure('puesto');ctx.buildStructure('puesto');
  assert.equal(ctx.save.coins,60);assert.equal(ctx.save.buildings.puesto,true);
  assert.equal(ctx.villageSelectedId,'puesto');
  assert.deepEqual(log.renders,['puesto']);assert.equal(log.persist,1);assert.equal(log.achievements,1);assert.equal(log.buildSound,1);
  assert.equal(log.celebrations.length,1);
  assert.equal(ctx.villageBuildingState('fuente'),'unlocked-next');
});
test('Insufficient honey and invalid or locked targets cannot mutate the save',()=>{
  const {ctx,log}=village(12),before=JSON.stringify(ctx.save);
  for(const id of ['unknown','fuente','puesto']) ctx.buildStructure(id);
  assert.equal(JSON.stringify(ctx.save),before);assert.equal(log.persist,0);assert.equal(log.buildSound,0);
  assert.equal(log.celebrations.length,0);
  assert.match(log.bubble,/28/);
});
test('Opt-in demo construction remains clearly simulated and cannot bypass the path',()=>{
  const {ctx,log}=village(0);
  ctx.buildStructureWithAd('faro');assert.equal(ctx.save.buildings.faro,undefined);assert.equal(log.persist,0);
  ctx.buildStructureWithAd('puesto');ctx.buildStructureWithAd('puesto');
  assert.equal(ctx.save.buildings.puesto,true);assert.equal(ctx.save.coins,0);assert.equal(log.persist,1);
  assert.equal(log.celebrations.length,1);
  assert.match(log.bubble,/anuncio simulado/);assert.match(html,/Anuncio simulado · construir/);
});
test('Village separates inspection from spending and gates ambient motion',()=>{
  const render=source('renderVillage');
  assert.match(render,/node\.onclick=\(\)=>selectVillageBuilding\(b\.id\)/);
  assert.match(render,/wrap\.scrollTop=scroll/);
  assert.match(render,/atlasObservers\.get\('village-grid'\)\?\.disconnect/);
  assert.match(html,/#screen-village:not\(\.active\) \.v-node/);
  assert.match(html,/\.page-hidden #screen-village \.v-node/);
  assert.match(html,/@media\(prefers-reduced-motion:reduce\).*v-art-smoke/);
});
