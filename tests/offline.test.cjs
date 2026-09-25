const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const source=readFileSync(require('node:path').join(__dirname,'../service-worker.js'),'utf8');
function worker(online=true){
  const listeners={},stored=new Map(),deleted=[];
  const cache={match:async key=>stored.get(typeof key==='string'?key:key.url)?.clone(),put:async(key,value)=>stored.set(typeof key==='string'?key:key.url,value),addAll:async()=>{}};
  vm.runInNewContext(source,{URL,Response,self:{location:{origin:'https://game.test'},addEventListener:(name,fn)=>listeners[name]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}},
    caches:{open:async()=>cache,keys:async()=>['sugarclash-v7','sugarclash-v8','another-app'],delete:async key=>deleted.push(key)},
    fetch:async()=>{if(!online)throw new Error('offline');return new Response('new build');}});
  return {stored,deleted,listeners,async request(mode,url='https://game.test/'){
    const pending=[];let response;
    listeners.fetch({request:{method:'GET',mode,url},waitUntil:p=>pending.push(p),respondWith:p=>response=p});
    const result=await response; await Promise.all(pending); return result;
  }};
}
test('Online navigation returns new HTML, not stale cached HTML',async()=>{
  const w=worker();w.stored.set('https://game.test/',new Response('old build'));
  assert.equal(await(await w.request('navigate')).text(),'new build');
  assert.equal(await w.stored.get('./index.html').text(),'new build');
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
  assert.deepEqual(w.deleted,['sugarclash-v7']);
});
