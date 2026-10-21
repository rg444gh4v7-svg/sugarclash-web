const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const html=readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
function functionSource(name){
  const start=script.indexOf(`function ${name}(`);assert.ok(start>=0,`Missing ${name}`);
  const open=script.indexOf('{',start);let depth=0,quote='',escaped=false;
  for(let i=open;i<script.length;i++){
    const char=script[i];
    if(quote){if(escaped)escaped=false;else if(char==='\\')escaped=true;else if(char===quote)quote='';continue;}
    if(char==='"'||char==="'"||char==='`'){quote=char;continue;}
    if(char==='{')depth++;else if(char==='}'&&--depth===0)return script.slice(start,i+1);
  }
  assert.fail(`Unterminated ${name}`);
}
function guardian(){
  const start=script.indexOf('function guardianSVG(');
  assert.ok(start>=0,'Missing guardianSVG');
  const end=script.indexOf('\n',start),body=script.slice(start,script.slice(start,end).trimEnd().endsWith('}')?end:script.indexOf('\n}',start)+2);
  const save=Object.freeze({coins:123,gems:45,lives:4,stars:Object.freeze({1:Object.freeze({1:1})})});
  const math=Object.create(Math);math.random=()=>assert.fail('Guardian artwork must be deterministic');
  const ctx=vm.createContext({save,Math:math,setTimeout:()=>assert.fail('Artwork must not start timers'),
    requestAnimationFrame:()=>assert.fail('Artwork must not start loops'),document:{getElementById:()=>assert.fail('Artwork must not depend on DOM state')}});
  vm.runInContext(body,ctx);return ctx;
}
function portraitHarness(){
  const save=Object.freeze({coins:123,gems:45,lives:4,stars:Object.freeze({1:Object.freeze({1:1})})});
  const math=Object.create(Math);math.random=()=>assert.fail('Portrait mapping must not consume gameplay RNG');
  const ctx=vm.createContext({save,Math:math,setTimeout:()=>assert.fail('Portrait mapping must not start timers'),
    requestAnimationFrame:()=>assert.fail('Portrait mapping must not start loops'),
    document:{getElementById:()=>assert.fail('Portrait mapping must not inspect DOM state')},
    guardianSVG:(t,n,key,state)=>`<svg data-native="${t}-${n}-${key}-${state}"></svg>`,
    dgSymbolSVG:kind=>`<svg data-symbol="${kind}"></svg>`});
  for(const name of ['guardianPortrait','paintedPortrait','dgEnemyPortrait'])vm.runInContext(functionSource(name),ctx);
  return {ctx,save};
}
function references(svg){
  assert.equal((svg.match(/<svg\b/g)||[]).length,1);
  assert.match(svg,/<svg\b[^>]*viewBox="0 0 160 160"/);
  assert.doesNotMatch(svg,/NaN|Infinity|undefined|<(?:script|image|foreignObject)\b|\bon\w+\s*=/i);
  for(const match of svg.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/g))assert.ok(match[1].startsWith('#'),'Guardian references must remain local');
  const ids=[...svg.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length,'A guardian cannot duplicate its own SVG IDs');
  for(const match of svg.matchAll(/url\(\s*([^)]+)\)/g)){
    assert.ok(match[1].startsWith('#'),'Guardian paint servers must remain inline');
    assert.ok(ids.includes(match[1].slice(1)),`Unresolved guardian reference ${match[1]}`);
  }
  for(const match of svg.matchAll(/\b(?:href|xlink:href)="#([^"]+)"/g))assert.ok(ids.includes(match[1]));
  return ids;
}
test('All eighty guardians render finite standalone vectors in each restoration state',()=>{
  const ctx=guardian(),before=JSON.stringify(ctx.save);
  for(let t=1;t<=8;t++)for(let n=1;n<=10;n++)for(const state of ['hostile','restored','defeated']){
    const svg=ctx.guardianSVG(t,n,'map',state),ids=references(svg);
    assert.ok(ids.length>0,'Guardians must scope their native vector definitions');
    assert.ok(ids.every(id=>id.startsWith(`guardian-map-${t}-${n}`)));
    assert.equal(svg,ctx.guardianSVG(t,n,'map',state),'Repainting the same guardian must not change its artwork');
  }
  assert.equal(JSON.stringify(ctx.save),before);
});
test('Guardian paint servers stay unique across all map, game, boss and result instances',()=>{
  const ctx=guardian();
  for(const state of ['hostile','restored','defeated']){
    const all=[];
    for(const key of ['map','game','boss','result'])for(let t=1;t<=8;t++)for(let n=1;n<=10;n++)all.push(...references(ctx.guardianSVG(t,n,key,state)));
    assert.equal(new Set(all).size,all.length,`SVG ID collision in ${state} contexts`);
  }
});
test('The eight territories have different guardian geometry and boss silhouettes',()=>{
  const ctx=guardian(),shape=svg=>(svg.match(/<(?:path|circle|ellipse|polygon|rect)\b[^>]*>/g)||[]).join('').replace(/guardian-[\w-]+/g,'guardian');
  for(const n of [1,10])assert.equal(new Set(Array.from({length:8},(_,i)=>shape(ctx.guardianSVG(i+1,n,'identity')))).size,8);
  for(let t=1;t<=8;t++){
    assert.notEqual(shape(ctx.guardianSVG(t,1,'identity')),shape(ctx.guardianSVG(t,10,'identity')));
    assert.notEqual(ctx.guardianSVG(t,10,'state','hostile'),ctx.guardianSVG(t,10,'state','restored'));
    assert.notEqual(ctx.guardianSVG(t,10,'state','restored'),ctx.guardianSVG(t,10,'state','defeated'));
  }
});
test('Untrusted context text and invalid numeric inputs cannot escape guardian markup',()=>{
  const ctx=guardian(),key='map"><script src="https://example.invalid/guardian"></script> ¿#';
  const svg=ctx.guardianSVG(2,10,key,'hostile');references(svg);assert.ok(!svg.includes(key));
  for(const t of [NaN,Infinity,-Infinity,-5,0,99,undefined,null,'bad',{}])for(const n of [NaN,Infinity,-Infinity,-1,0,99,undefined,null,'bad']){
    const art=ctx.guardianSVG(t,n,key,'unknown');references(art);
    assert.ok(!art.includes(key));
  }
});
test('All eighty campaign portraits select a unique sheet cell without touching RNG or saved progress',()=>{
  const {ctx,save}=portraitHarness(),before=JSON.stringify(save),cells=new Set();
  for(let territory=1;territory<=8;territory++)for(let level=1;level<=10;level++){
    const art=ctx.guardianPortrait(territory,level,'map','hostile'),index=level-1;
    assert.match(art,new RegExp(`data-atlas="${territory}"`));assert.match(art,new RegExp(`data-level="${level}"`));
    assert.ok(art.includes(`--guardian-sheet:url('monsters-t${territory}-v18.webp')`));
    assert.ok(art.includes(`--guardian-x:${index%5*25}%`));assert.ok(art.includes(`--guardian-y:${Math.floor(index/5)*100}%`));
    assert.ok(art.includes(`data-native="${territory}-${level}-map-hostile"`),'Native fallback must track the same encounter');
    assert.doesNotMatch(art,/NaN|Infinity|undefined/);cells.add(`${territory}:${index%5}:${Math.floor(index/5)}`);
  }
  assert.equal(cells.size,80);assert.equal(JSON.stringify(save),before);
});
test('Generic painted portraits clamp atlas kinds and indices to valid 5 by 2 cells',()=>{
  const {ctx,save}=portraitHarness(),before=JSON.stringify(save),sheets={combatants:'combatants-v18.webp',buildings:'buildings-v18.webp',hexa:'hex-enemies-a-v18.webp',hexb:'hex-enemies-b-v18.webp'};
  for(const [kind,sheet] of Object.entries(sheets))for(let index=0;index<10;index++){
    const art=ctx.paintedPortrait(kind,index,'fallback');
    assert.ok(art.includes(`data-art="${kind}"`));assert.ok(art.includes(`data-index="${index}"`));assert.ok(art.includes(`--portrait-sheet:url('${sheet}')`));
    assert.ok(art.includes(`--portrait-x:${index%5*25}%`));assert.ok(art.includes(`--portrait-y:${Math.floor(index/5)*100}%`));
  }
  for(const [input,expected] of [[NaN,0],[Infinity,0],[-Infinity,0],[-8,0],[0,0],[4.9,4],[9,9],[99,9],[undefined,0],[null,0],['bad',0],[{},0]]){
    const art=ctx.paintedPortrait('not-a-sheet',input,'safe');
    assert.ok(art.includes('data-art="combatants"'));assert.ok(art.includes(`data-index="${expected}"`));
    assert.doesNotMatch(art,/not-a-sheet|NaN|Infinity|undefined/);
  }
  assert.equal(JSON.stringify(save),before);
});
test('Twenty HEX encounters map once across both ten-cell atlases without revealing invalid indices',()=>{
  const {ctx,save}=portraitHarness(),before=JSON.stringify(save),cells=new Set();
  for(let level=1;level<=20;level++){
    const art=ctx.dgEnemyPortrait(level,'test',level%2?'hostile':'defeated'),kind=level<=10?'hexa':'hexb',index=(level-1)%10;
    assert.ok(art.includes(`data-state="${level%2?'hostile':'defeated'}"`));assert.ok(art.includes(`data-art="${kind}"`));assert.ok(art.includes(`data-index="${index}"`));
    assert.ok(art.includes(`--portrait-x:${index%5*25}%`));assert.ok(art.includes(`--portrait-y:${Math.floor(index/5)*100}%`));
    assert.doesNotMatch(art,/NaN|Infinity|undefined/);cells.add(`${kind}:${index}`);
  }
  assert.equal(cells.size,20);
  for(const [input,kind,index] of [[NaN,'hexa',0],[Infinity,'hexa',0],[-9,'hexa',0],[0,'hexa',0],[1,'hexa',0],[10,'hexa',9],[11,'hexb',0],[20,'hexb',9],[99,'hexb',9],[undefined,'hexa',0],['bad','hexa',0]]){
    const art=ctx.dgEnemyPortrait(input,'unsafe','other');
    assert.ok(art.includes('data-state="hostile"'));assert.ok(art.includes(`data-art="${kind}"`));assert.ok(art.includes(`data-index="${index}"`));
  }
  assert.equal(JSON.stringify(save),before);
});
