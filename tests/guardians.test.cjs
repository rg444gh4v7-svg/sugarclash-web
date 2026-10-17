const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const html=readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
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
