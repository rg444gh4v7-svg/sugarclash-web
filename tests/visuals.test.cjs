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
function constant(name){
  const start=script.indexOf(`const ${name}=`);
  assert.ok(start>=0,`Missing constant ${name}`);
  if(script[start+`const ${name}=`.length]==='"') return script.slice(start,script.indexOf('\n',start));
  return script.slice(start,script.indexOf('\n};',start)+3);
}
const svgIds=scene=>[...scene.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
function checkSvgReferences(scene){
  const ids=svgIds(scene);
  assert.equal(new Set(ids).size,ids.length,'SVG IDs must be unique within each scene');
  for(const id of ids) assert.match(id,/^[A-Za-z][A-Za-z0-9_-]*$/);
  for(const ref of scene.matchAll(/url\(#([^)]*)\)/g)) assert.ok(ids.includes(ref[1]),`Missing SVG reference ${ref[1]}`);
  return ids;
}
function visuals(){
  const ctx=vm.createContext({document:{createElementNS:()=>({attributes:{},setAttribute(k,v){this.attributes[k]=v;}})}});
  for(const name of ['MOCHI_ATLAS_ART','ATLAS_PALETTES','ATLAS_MOMENTS']) vm.runInContext(constant(name),ctx);
  for(const name of ['mochiLandscapeSVG','territoryLandscapeSVG','atlasFeeling','atlasDecoration','confiteSVG','drawAtlasRoute']) vm.runInContext(source(name),ctx);
  return ctx;
}
test('Eight atlas territories have distinct finite native landscape artwork',()=>{
  const v=visuals(),scenes=Array.from({length:8},(_,i)=>v.territoryLandscapeSVG(i+1));
  assert.equal(new Set(scenes).size,8);
  for(const scene of scenes){
    assert.match(scene,/<svg viewBox="0 0 360 210"/);
    assert.doesNotMatch(scene,/NaN|undefined|Infinity/);
    assert.match(scene,/class="land-far"/);assert.match(scene,/class="land-life"/);assert.match(scene,/class="land-veil"/);
  }
});
test('Atlas SVG IDs are unique across world, banner, game and campaign instances',()=>{
  const v=visuals(),all=[];
  const mochiIdCount=svgIds(vm.runInContext('MOCHI_ATLAS_ART',v)).length;
  assert.ok(mochiIdCount>5,'Mochi preserves native Figma node IDs as well as definitions');
  for(const key of ['world','banner','game','campaign']) for(let id=1;id<=8;id++){
    const scene=key==='campaign'&&id===2?v.mochiLandscapeSVG(key,.5):v.territoryLandscapeSVG(id,key,.5);
    const ids=checkSvgReferences(scene);
    assert.equal(ids.length,id===2?mochiIdCount:5);
    all.push(...ids);
  }
  assert.equal(new Set(all).size,all.length);
});
test('Native Mochi keeps the full Figma canvas and resolves safely scoped vector references',()=>{
  const v=visuals(),key='campaign"><script src="https://example.invalid/art"></script> ¿#';
  const scene=v.mochiLandscapeSVG(key,.5);
  assert.match(scene,/<svg class="mochi-cinematic"[^>]*\bwidth="390"[^>]*\bheight="440"[^>]*\bviewBox="0 0 390 440"/);
  assert.match(scene,/aria-hidden="true"/);
  assert.doesNotMatch(scene,/<(?:image|foreignObject|script)\b|\b(?:href|src)\s*=|url\(\s*[^#]|data:|NaN|undefined|Infinity/i);
  assert.ok(!scene.includes(key),'Context text must never be interpolated as SVG markup');
  const ids=checkSvgReferences(scene);
  assert.ok(ids.length>5);
  assert.ok(ids.every(id=>id.startsWith('mochi-campaign-')));
  assert.match(scene,/<(?:linearGradient|radialGradient)\b/);
  assert.match(scene,/<clipPath\b/);
});
test('Mochi clamps restoration in both full campaign and compact atlas artwork',()=>{
  const v=visuals();
  for(const compact of [false,true]){
    const scene=p=>v.mochiLandscapeSVG('restoration',p,compact);
    assert.equal(scene(-3),scene(0));assert.equal(scene(7),scene(1));
    for(const value of [NaN,Infinity,-Infinity,'0.5',null]) assert.equal(scene(value),scene(0));
    assert.notEqual(scene(0),scene(.5));assert.notEqual(scene(.5),scene(1));
    checkSvgReferences(scene(.5));
  }
  assert.match(v.mochiLandscapeSVG('campaign',0),/data-restoration="0"/);
  assert.match(v.mochiLandscapeSVG('campaign',1),/data-restoration="1"/);
  assert.match(v.mochiLandscapeSVG('atlas',.5,true),/<svg viewBox="0 0 360 210"/);
});
test('Landscape restoration clamps out-of-range progress and rejects non-finite values',()=>{
  const v=visuals(),scene=p=>v.territoryLandscapeSVG(2,'clamp',p);
  assert.equal(scene(-3),scene(0));assert.equal(scene(7),scene(1));
  for(const value of [NaN,Infinity,-Infinity,'0.5',null]) assert.equal(scene(value),scene(0));
  assert.match(scene(0),/--land-life:0\.15;--land-veil:0\.64/);
  assert.match(scene(1),/--land-life:1;--land-veil:0/);
  assert.notEqual(scene(0),scene(.5));assert.notEqual(scene(.5),scene(1));
});
test('Each territory has three emotional phases at the restoration thresholds',()=>{
  const v=visuals(),quotes=new Set();
  for(let id=1;id<=8;id++){
    for(const [progress,stage] of [[-1,0],[0,0],[.339,0],[.34,1],[.99,1],[1,2],[4,2]]){
      const feeling=v.atlasFeeling(id,progress);
      assert.equal(feeling.stage,stage);assert.ok(feeling.label);assert.ok(feeling.quote);
      quotes.add(feeling.quote);
    }
  }
  assert.equal(quotes.size,24);
  assert.equal(v.atlasFeeling(99,1).quote,v.atlasFeeling(1,1).quote);
});
test('Confite preserves five distinct moods and skin palettes without SVG ID collisions',()=>{
  const v=visuals(),moods=['happy','excited','celebrate','worried','sad'],outputs=[];
  for(let i=0;i<5;i++){
    const sk={ears:`#${i+2}a5279`,earInner:`#${i+3}d82ac`,body:`#${i+4}c3571`,cheeks:`#${i+5}c91aa`,eye:`#${i+1}a1831`};
    const faces=moods.map(mood=>v.confiteSVG(mood,sk));
    assert.equal(new Set(faces).size,5);
    for(const face of faces){
      assert.doesNotMatch(face,/NaN|undefined|\bid=/);
      assert.ok(face.includes(`fill="${sk.body}"`));assert.ok(face.includes(`fill="${sk.eye}"`));
      assert.match(face,/class="cf-portrait"/);
    }
    assert.equal(v.confiteSVG('unknown',sk),faces[0]);
    outputs.push(...faces);
  }
  assert.equal(new Set(outputs).size,25);
});
test('Atlas routes keep finite curves and subdued locked branches when rerendered',()=>{
  const v=visuals(),nodes=[
    {dataset:{routeX:26,routeY:102},classList:{contains:()=>false}},
    {dataset:{routeX:57,routeY:246},classList:{contains:c=>c==='is-current'}},
    {dataset:{routeX:76,routeY:390},classList:{contains:c=>c==='locked'}}
  ];
  let removed=0,created;
  const container={querySelector:()=>({remove(){removed++;}}),prepend(svg){created=svg;}};
  v.drawAtlasRoute(container,nodes,1550,2);
  assert.equal(removed,1);assert.equal(created.attributes.viewBox,'0 0 360 1550');
  assert.equal(created.attributes['aria-hidden'],'true');
  const firstCurve=created.innerHTML.match(/d="M([\d.]+) 102C([\d.]+) ([\d.]+) /);
  assert.ok(firstCurve);assert.ok(Math.abs(Number(firstCurve[1])-93.6)<.001);
  assert.ok(Math.abs(Number(firstCurve[2])-93.6)<.001);assert.ok(Math.abs(Number(firstCurve[3])-176.88)<.001);
  assert.match(created.innerHTML,/stroke="#39364d"/);
  assert.match(created.innerHTML,/stroke-opacity="\.32"/);
  assert.match(created.innerHTML,/class="atlas-ground"/);
  assert.doesNotMatch(created.innerHTML,/NaN|undefined/);
  v.drawAtlasRoute(container,nodes,1550);
  assert.equal(removed,2);assert.doesNotMatch(created.innerHTML,/class="atlas-ground"/);
});
test('Ambient character and landscape motion has reduced-motion and hidden-page gates',()=>{
  assert.match(html,/@media\(prefers-reduced-motion:reduce\)\{\.cf-portrait,\.cf-emote-eyes\{animation:none!important\}/);
  assert.match(html,/\.page-hidden \.cf-portrait,\.page-hidden \.cf-emote-eyes\{animation-play-state:paused!important\}/);
  assert.match(html,/document\.documentElement\.classList\.toggle\('page-hidden',document\.hidden\)/);
  assert.match(html,/\.screen:not\(\.active\) \.land-far/);
  assert.match(html,/@media\(prefers-reduced-motion:reduce\)\{\.land-far,\.land-water,\.land-fireflies\{animation:none!important\}/);
});
test('Campaign scenery motion runs only while visible and respects accessibility gates',()=>{
  for(const selector of ['scene-petal','scene-water-glint']){
    assert.match(html,new RegExp(`\\.${selector}\\{[^}]*pointer-events:none[^}]*animation-play-state:paused`));
    assert.match(html,new RegExp(`\\.campaign-scene\\.is-visible \\.${selector}`));
    assert.match(html,new RegExp(`\\.screen:not\\(\\.active\\) \\.${selector}`));
    assert.match(html,new RegExp(`\\.page-hidden \\.${selector}`));
  }
  assert.match(html,/@media\(prefers-reduced-motion:reduce\)\{\.scene-petal,\.scene-water-glint\{animation:none!important\}/);
  assert.match(source('observeAtlas'),/querySelectorAll\('\.territory-card,\.level-node,\.campaign-scene'\)/);
  assert.match(source('renderCampaignMission'),/observeAtlas\(el\)/);
});
