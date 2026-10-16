const CACHE_NAME = "sugarclash-v12";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png", "./icon-ios-180.png", "./title-world-v3-hd.jpg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(
      ASSETS.map((asset) => new Request(new URL(asset, self.location.href), {cache:"reload"}))
    )).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k.startsWith("sugarclash-") && k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request=event.request;
  if(request.method!=="GET" || new URL(request.url).origin!==self.location.origin) return;
  const document=request.mode==="navigate" || new URL(request.url).pathname.endsWith("/index.html");
  // A network-first document must bypass the browser's separate HTTP cache too.
  const network=fetch(request,document?{cache:"no-store"}:undefined).then(async response=>{
    if(response.ok){
      try{
        const cache=await caches.open(CACHE_NAME);
        await cache.put(request,response.clone());
        if(document) await cache.put("./index.html",response.clone());
      }catch{} // Storage pressure must not replace a successful online response.
    }
    return response;
  });
  // Keep writes alive even when a cached image is returned immediately.
  event.waitUntil(network.then(()=>{},()=>{}));
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    const cached=await cache.match(request);
    if(!document && cached) return cached;
    try{
      const response=await network;
      if(response.ok || !document) return response;
    }catch{}
    return cached || (document && await cache.match("./index.html")) || Response.error();
  })());
});
