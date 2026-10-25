'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const project = path.join(__dirname, '..');
const worker = fs.readFileSync(path.join(project, 'service-worker.js'), 'utf8');

function createWorker(base = 'https://sugarclash.example/') {
  const location = new URL('service-worker.js', base);
  const listeners = new Map();
  const stores = new Map();
  const calls = [];
  const deleted = [];
  let skipped = 0, claimed = 0;
  const key = request => new URL(typeof request === 'string' ? request : request.url || request.href, location).href;
  class WorkerRequest {
    constructor(input, options = {}) {
      this.url = key(input);
      this.method = options.method || input.method || 'GET';
      this.mode = options.mode || input.mode || 'cors';
      this.cache = options.cache || input.cache || 'default';
    }
  }
  function makeCache() {
    const data = new Map();
    return {
      data,
      async match(request) { return data.get(key(request))?.clone(); },
      async put(request, response) { data.set(key(request), response.clone()); },
      async addAll(requests) {
        for (const request of requests) {
          const response = await box.fetch(request);
          if (!response.ok) throw new Error('Asset unavailable');
          await this.put(request, response);
        }
      }
    };
  }
  const caches = {
    async open(name) { if (!stores.has(name)) stores.set(name, makeCache()); return stores.get(name); },
    async keys() { return [...stores.keys()]; },
    async delete(name) { deleted.push(name); return stores.delete(name); }
  };
  const box = {
    self: {
      location,
      addEventListener(name, callback) { listeners.set(name, callback); },
      async skipWaiting() { skipped++; },
      clients: { async claim() { claimed++; } }
    },
    URL, Request: WorkerRequest, Response, caches,
    fetch: null
  };
  function network(callback = async request => new Response('network:' + new URL(request.url).pathname)) {
    box.fetch = async (request, options) => {
      calls.push({ request, options });
      return callback(request, options);
    };
  }
  network();
  vm.createContext(box);
  vm.runInContext(worker, box);
  const cacheName = vm.runInContext('CACHE_NAME', box);
  const assets = Array.from(vm.runInContext('ASSETS', box));
  return {
    box, calls, caches, stores, deleted, network, cacheName, assets,
    skipped: () => skipped,
    claimed: () => claimed,
    request(url = './', mode = 'navigate', method = 'GET') {
      return new WorkerRequest(new URL(url, location).href, { mode, method });
    },
    async lifecycle(name) {
      const promises = [];
      listeners.get(name)({ waitUntil(promise) { promises.push(promise); } });
      await Promise.all(promises);
    },
    async fetchEvent(request) {
      let response;
      const promises = [];
      listeners.get('fetch')({
        request,
        waitUntil(promise) { promises.push(promise); },
        respondWith(promise) { response = Promise.resolve(promise); }
      });
      const result = response ? await response : undefined;
      await Promise.all(promises);
      return result;
    }
  };
}

test('the Renacer worker has a complete local asset catalog', () => {
  const h = createWorker();
  assert.equal(h.cacheName, 'sugarclash-renacer-v6');
  assert.ok(h.assets.includes('./index.html'));
  for (const asset of ['candies-restoration-v1.svg','renacer-restoration-v3.webp','renacer-meadow-v2.webp','sugar-clash-logo-v2.webp','candies-toon-v2.webp','icon-sugar-v2.svg','icon-sugar-v2-192.png','icon-sugar-v2-512.png','icon-sugar-v2-180.png']) assert.ok(h.assets.includes('./assets/'+asset), asset+' is available offline');
  assert.ok(h.assets.includes('./legacy/index.html'));
  for (const asset of h.assets) {
    assert.ok(asset.startsWith('./'), `${asset} stays on the game origin`);
    const relative = asset === './' ? 'index.html' : asset.slice(2);
    assert.ok(fs.statSync(path.join(project, relative)).isFile(), `${asset} exists`);
  }
});

test('installation reloads all bundled assets and activates the new worker', async () => {
  const h = createWorker();
  await h.lifecycle('install');
  assert.equal(h.calls.length, h.assets.length);
  assert.ok(h.calls.every(({ request }) => request.cache === 'reload'));
  const cache = await h.caches.open(h.cacheName);
  assert.ok(await cache.match('./index.html'));
  assert.ok(await cache.match('./legacy/index.html'));
  assert.equal(h.skipped(), 1);
});

test('activation removes stale Sugar Clash caches and retains unrelated sites', async () => {
  const h = createWorker();
  for (const name of [h.cacheName, 'sugarclash-v18', 'sugarclash-renacer-v0', 'another-game-v2']) await h.caches.open(name);
  await h.lifecycle('activate');
  assert.deepEqual((await h.caches.keys()).sort(), ['another-game-v2', h.cacheName].sort());
  assert.deepEqual(h.deleted.sort(), ['sugarclash-renacer-v0', 'sugarclash-v18'].sort());
  assert.equal(h.claimed(), 1);
});

test('online canonical navigation bypasses HTTP cache and refreshes the shared HTML fallback', async () => {
  const h = createWorker();
  const cache = await h.caches.open(h.cacheName);
  await cache.put('./index.html', new Response('previous Renacer'));
  h.network(async () => new Response('fresh Renacer'));
  const response = await h.fetchEvent(h.request('./?edition=renacer'));
  assert.equal(await response.text(), 'fresh Renacer');
  assert.equal(h.calls[0].options.cache, 'no-store');
  assert.equal(await (await cache.match('./index.html')).text(), 'fresh Renacer');
});

test('offline canonical root falls back to the cached new index', async () => {
  const h = createWorker();
  const cache = await h.caches.open(h.cacheName);
  await cache.put('./index.html', new Response('new Renacer'));
  h.network(async () => { throw new Error('offline'); });
  const response = await h.fetchEvent(h.request('./'));
  assert.equal(await response.text(), 'new Renacer');
});

test('an online index refresh replaces a stale root alias when the next visit is offline', async () => {
  const h = createWorker();
  const cache = await h.caches.open(h.cacheName);
  await cache.put('./', new Response('older root page'));
  await cache.put('./index.html', new Response('older index page'));
  h.network(async () => new Response('latest Renacer'));
  assert.equal(await (await h.fetchEvent(h.request('./index.html'))).text(), 'latest Renacer');
  h.network(async () => { throw new Error('offline'); });
  const response = await h.fetchEvent(h.request('./'));
  assert.equal(await response.text(), 'latest Renacer', 'both canonical aliases use the newest HTML fallback');
});

test('canonical fallback also works when hosted inside a subdirectory', async () => {
  const h = createWorker('https://sugarclash.example/games/sugar/');
  const cache = await h.caches.open(h.cacheName);
  await cache.put('./index.html', new Response('subdirectory Renacer'));
  h.network(async () => { throw new Error('offline'); });
  const response = await h.fetchEvent(h.request('./?installed=1'));
  assert.equal(await response.text(), 'subdirectory Renacer');
});

test('fetching legacy/index.html cannot overwrite the new canonical offline fallback', async () => {
  const h = createWorker();
  const cache = await h.caches.open(h.cacheName);
  await cache.put('./index.html', new Response('new Renacer'));
  h.network(async () => new Response('previous legacy game'));
  assert.equal(await (await h.fetchEvent(h.request('./legacy/index.html'))).text(), 'previous legacy game');
  assert.equal(await (await cache.match('./index.html')).text(), 'new Renacer');
  assert.equal(await (await cache.match('./legacy/index.html')).text(), 'previous legacy game');
  h.network(async () => { throw new Error('offline'); });
  assert.equal(await (await h.fetchEvent(h.request('./?offline=1'))).text(), 'new Renacer');
  assert.equal(await (await h.fetchEvent(h.request('./legacy/index.html'))).text(), 'previous legacy game');
});

test('an old Sugar Clash cache is never consulted for the new canonical fallback', async () => {
  const h = createWorker();
  await (await h.caches.open('sugarclash-v18')).put('./index.html', new Response('old game'));
  await (await h.caches.open(h.cacheName)).put('./index.html', new Response('new Renacer'));
  h.network(async () => { throw new Error('offline'); });
  assert.equal(await (await h.fetchEvent(h.request('./'))).text(), 'new Renacer');
});

test('a 404 navigation uses cached canonical HTML and never poisons it', async () => {
  const h = createWorker();
  const cache = await h.caches.open(h.cacheName);
  await cache.put('./index.html', new Response('working Renacer'));
  h.network(async () => new Response('not found', { status: 404 }));
  const response = await h.fetchEvent(h.request('./index.html?reload=1'));
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'working Renacer');
  assert.equal(await (await cache.match('./index.html')).text(), 'working Renacer');
});

test('external requests and non-GET methods are left to the browser', async () => {
  const h = createWorker();
  assert.equal(await h.fetchEvent(h.request('https://fonts.googleapis.com/css2?family=Karla', 'cors')), undefined);
  assert.equal(await h.fetchEvent(h.request('./save', 'cors', 'POST')), undefined);
  assert.equal(h.calls.length, 0);
});

test('cached art is available immediately while its network update is kept alive', async () => {
  const h = createWorker();
  const cache = await h.caches.open(h.cacheName);
  await cache.put('./arena-war-v18.webp', new Response('cached art'));
  h.network(async () => new Response('updated art'));
  const response = await h.fetchEvent(h.request('./arena-war-v18.webp', 'cors'));
  assert.equal(await response.text(), 'cached art');
  assert.equal(await (await cache.match('./arena-war-v18.webp')).text(), 'updated art');
  assert.equal(h.calls[0].options, undefined, 'only documents bypass the HTTP cache');
});

test('cache write failure never replaces a successful online document response', async () => {
  const h = createWorker();
  const cache = await h.caches.open(h.cacheName);
  cache.put = async () => { throw new Error('storage pressure'); };
  h.network(async () => new Response('fresh playable game'));
  const response = await h.fetchEvent(h.request('./'));
  assert.equal(response.status, 200);
  assert.equal(await response.text(), 'fresh playable game');
});

test('an uncached unavailable document returns an error rather than an unrelated game', async () => {
  const h = createWorker();
  await (await h.caches.open(h.cacheName)).put('./index.html', new Response('new Renacer'));
  h.network(async () => new Response('missing', { status: 404 }));
  const response = await h.fetchEvent(h.request('./unrelated/index.html'));
  assert.equal(response.type, 'error');
});
