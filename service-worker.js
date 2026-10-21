const CACHE_NAME = "sugarclash-renacer-v1";
const ASSETS = [
  "./", "./index.html", "./legacy/index.html", "./manifest.json", "./icon.svg", "./icon-192.png", "./icon-512.png", "./icon-ios-180.png",
  "./title-world-v3-hd.jpg", "./icon-crystal-192.png", "./icon-crystal-512.png", "./icon-crystal-ios-180.png",
  "./guardians-cinematic-v1.webp", "./worlds-cinematic-v1.webp",
  "./arena-war-v18.webp", "./arena-royale-v18.webp", "./combatants-v18.webp",
  "./monsters-t1-v18.webp", "./monsters-t2-v18.webp", "./monsters-t3-v18.webp", "./monsters-t4-v18.webp",
  "./monsters-t5-v18.webp", "./monsters-t6-v18.webp", "./monsters-t7-v18.webp", "./monsters-t8-v18.webp",
  "./village-cinematic-v18.webp", "./hex-realm-v18.webp", "./hex-enemies-a-v18.webp", "./hex-enemies-b-v18.webp",
  "./buildings-v18.webp", "./candies-v18.webp"
];

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
  const url=new URL(request.url);
  const canonical=url.pathname===new URL("./",self.location.href).pathname || url.pathname===new URL("./index.html",self.location.href).pathname;
  const document=request.mode==="navigate" || new URL(request.url).pathname.endsWith("/index.html");
  // A network-first document must bypass the browser's separate HTTP cache too.
  const network=fetch(request,document?{cache:"no-store"}:undefined).then(async response=>{
    if(response.ok){
      try{
        const cache=await caches.open(CACHE_NAME);
        await cache.put(request,response.clone());
        if(document && canonical) await cache.put("./index.html",response.clone());
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
    return (document && canonical && await cache.match("./index.html")) || cached || Response.error();
  })());
});
