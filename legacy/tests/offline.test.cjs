const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const source=readFileSync(path.join(root,'service-worker.js'),'utf8');
const V18_ART=[
  'arena-war-v18.webp','arena-royale-v18.webp','combatants-v18.webp',
  ...Array.from({length:8},(_,i)=>`monsters-t${i+1}-v18.webp`),
  'village-cinematic-v18.webp','hex-realm-v18.webp','hex-enemies-a-v18.webp','hex-enemies-b-v18.webp',
  'buildings-v18.webp','candies-v18.webp'
];
function webpInfo(asset){
  const bytes=readFileSync(path.join(root,asset));
  assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
  let width=0,height=0,alpha=false,offset=12;
  while(offset+8<=bytes.length){
    const kind=bytes.toString('ascii',offset,offset+4),size=bytes.readUInt32LE(offset+4),data=offset+8;
    assert.ok(data+size<=bytes.length,`${asset} has a truncated ${kind} chunk`);
    if(kind==='VP8X'&&size>=10){alpha=alpha||!!(bytes[data]&0x10);width=1+bytes.readUIntLE(data+4,3);height=1+bytes.readUIntLE(data+7,3);}
    else if(kind==='ALPH')alpha=true;
    else if(kind==='VP8 '&&size>=10&&!width){width=bytes.readUInt16LE(data+6)&0x3fff;height=bytes.readUInt16LE(data+8)&0x3fff;}
    else if(kind==='VP8L'&&size>=5&&!width){const bits=bytes.readUInt32LE(data+1);width=1+(bits&0x3fff);height=1+((bits>>>14)&0x3fff);alpha=true;}
    offset=data+size+(size&1);
  }
  assert.ok(width>0&&height>0,`${asset} must expose finite WebP dimensions`);
  return {width,height,alpha};
}
function worker(online=true,storageFull=false){
  const listeners={},stored=new Map(),deleted=[],fetched=[],precache=[],opened=[];
  const cache={match:async key=>stored.get(typeof key==='string'?key:key.url)?.clone(),put:async(key,value)=>{if(storageFull)throw new Error('quota');stored.set(typeof key==='string'?key:key.url,value);},addAll:async requests=>precache.push(...requests)};
  vm.runInNewContext(source,{URL,Request,Response,self:{location:{origin:'https://game.test',href:'https://game.test/service-worker.js'},addEventListener:(name,fn)=>listeners[name]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}},
    caches:{open:async key=>{opened.push(key);return cache;},keys:async()=>['sugarclash-v7','sugarclash-v8','sugarclash-v9','sugarclash-v10','sugarclash-v11','sugarclash-v12','sugarclash-v13','sugarclash-v14','sugarclash-v15','sugarclash-v16','sugarclash-v17','another-app'],delete:async key=>deleted.push(key)},
    fetch:async(request,options)=>{fetched.push({request,options});if(!online)throw new Error('offline');return new Response('new build');}});
  return {stored,deleted,listeners,fetched,precache,opened,async request(mode,url='https://game.test/'){
    const pending=[];let response;
    listeners.fetch({request:{method:'GET',mode,url},waitUntil:p=>pending.push(p),respondWith:p=>response=p});
    const result=await response; await Promise.all(pending); return result;
  }};
}
test('Online navigation returns new HTML, not stale cached HTML',async()=>{
  const w=worker();w.stored.set('https://game.test/',new Response('old build'));
  assert.equal(await(await w.request('navigate')).text(),'new build');
  assert.equal(await w.stored.get('./index.html').text(),'new build');
  assert.equal(w.fetched[0].options.cache,'no-store');
});
test('Direct index.html requests bypass both HTML caches',async()=>{
  const w=worker();w.stored.set('https://game.test/index.html',new Response('old build'));
  assert.equal(await(await w.request('cors','https://game.test/index.html')).text(),'new build');
  assert.equal(w.fetched[0].options.cache,'no-store');
});
test('Installation refreshes precached files instead of reusing HTTP cache',async()=>{
  const w=worker();let done;w.listeners.install({waitUntil:p=>done=p});await done;
  assert.ok(w.precache.some(request=>request.url==='https://game.test/index.html'));
  assert.ok(w.precache.some(request=>request.url==='https://game.test/title-world-v3-hd.jpg'));
  for(const asset of ['guardians-cinematic-v1.webp','worlds-cinematic-v1.webp','icon-crystal-192.png','icon-crystal-512.png','icon-crystal-ios-180.png'])assert.ok(w.precache.some(request=>request.url===`https://game.test/${asset}`),`Missing offline art ${asset}`);
  for(const asset of V18_ART)assert.ok(w.precache.some(request=>request.url===`https://game.test/${asset}`),`Missing v18 offline art ${asset}`);
  assert.ok(w.precache.every(request=>request.cache==='reload'));
  assert.deepEqual(w.opened,['sugarclash-v18']);
});
test('Current PWA artwork and installation icons exist locally and match the manifest sizes',()=>{
  const manifest=JSON.parse(readFileSync(path.join(root,'manifest.json'),'utf8'));
  assert.equal(manifest.icons.length,2);
  assert.deepEqual(manifest.icons.map(icon=>icon.src),['icon-crystal-192.png','icon-crystal-512.png']);
  for(const icon of [...manifest.icons,{src:'icon-crystal-ios-180.png',sizes:'180x180',type:'image/png'}]){
    const bytes=readFileSync(path.join(root,icon.src));assert.equal(bytes.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
    assert.equal(`${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`,icon.sizes);assert.equal(icon.type,'image/png');
  }
  for(const asset of ['guardians-cinematic-v1.webp','worlds-cinematic-v1.webp']){
    const bytes=readFileSync(path.join(root,asset));assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');
  }
});
test('Cinematic v18 scenes and transparent atlases have their production WebP geometry',()=>{
  for(const asset of ['arena-war-v18.webp','arena-royale-v18.webp','village-cinematic-v18.webp','hex-realm-v18.webp']){
    assert.deepEqual(webpInfo(asset),{width:941,height:1672,alpha:false},asset);
  }
  const atlases=['combatants-v18.webp',...Array.from({length:8},(_,i)=>`monsters-t${i+1}-v18.webp`),'hex-enemies-a-v18.webp','hex-enemies-b-v18.webp','buildings-v18.webp'];
  for(const asset of atlases)assert.deepEqual(webpInfo(asset),{width:1600,height:640,alpha:true},asset);
  assert.deepEqual(webpInfo('candies-v18.webp'),{width:1280,height:640,alpha:true});
});
test('Cache quota errors do not hide a successful HTML update',async()=>{
  const w=worker(true,true);w.stored.set('https://game.test/',new Response('old build'));
  assert.equal(await(await w.request('navigate')).text(),'new build');
});
test('Offline navigation falls back to the installed game',async()=>{
  const w=worker(false);w.stored.set('./index.html',new Response('offline game'));
  assert.equal(await(await w.request('navigate')).text(),'offline game');
});
test('Offline assets remain available',async()=>{
  const w=worker(false);w.stored.set('https://game.test/art.jpg',new Response('art'));
  assert.equal(await(await w.request('cors','https://game.test/art.jpg')).text(),'art');
});
test('Activation only removes obsolete Sugar Clash caches',async()=>{
  const w=worker(); let done;w.listeners.activate({waitUntil:p=>done=p});await done;
  assert.deepEqual(w.deleted,['sugarclash-v7','sugarclash-v8','sugarclash-v9','sugarclash-v10','sugarclash-v11','sugarclash-v12','sugarclash-v13','sugarclash-v14','sugarclash-v15','sugarclash-v16','sugarclash-v17']);
});
