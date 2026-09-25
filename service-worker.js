const CACHE_NAME = "sugarclash-v8";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png", "./icon-ios-180.png", "./title-world-v3-hd.jpg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
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
  const navigation=request.mode==="navigate";
  const network=fetch(request).then(async response=>{
    if(response.ok){
      const cache=await caches.open(CACHE_NAME);
      await cache.put(request,response.clone());
      if(navigation) await cache.put("./index.html",response.clone());
    }
    return response;
  });
  // Keep writes alive even when a cached image is returned immediately.
  event.waitUntil(network.then(()=>{},()=>{}));
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    const cached=await cache.match(request);
    if(!navigation && cached) return cached;
    try{
      const response=await network;
      if(response.ok || !navigation) return response;
    }catch{}
    return cached || (navigation && await cache.match("./index.html")) || Response.error();
  })());
});
