const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const source=readFileSync(require('node:path').join(__dirname,'../service-worker.js'),'utf8');
function worker(online=true,storageFull=false){
  const listeners={},stored=new Map(),deleted=[],fetched=[],precache=[];
  const cache={match:async key=>stored.get(typeof key==='string'?key:key.url)?.clone(),put:async(key,value)=>{if(storageFull)throw new Error('quota');stored.set(typeof key==='string'?key:key.url,value);},addAll:async requests=>precache.push(...requests)};
  vm.runInNewContext(source,{URL,Request,Response,self:{location:{origin:'https://game.test',href:'https://game.test/service-worker.js'},addEventListener:(name,fn)=>listeners[name]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}},
    caches:{open:async()=>cache,keys:async()=>['sugarclash-v7','sugarclash-v8','sugarclash-v9','sugarclash-v10','another-app'],delete:async key=>deleted.push(key)},
    fetch:async(request,options)=>{fetched.push({request,options});if(!online)throw new Error('offline');return new Response('new build');}});
  return {stored,deleted,listeners,fetched,precache,async request(mode,url='https://game.test/'){
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
  assert.ok(w.precache.every(request=>request.cache==='reload'));
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
  assert.deepEqual(w.deleted,['sugarclash-v7','sugarclash-v8','sugarclash-v9']);
});
