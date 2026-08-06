const CACHE="yoriwang-v3.6-firebase-20260731";
const ASSETS=[
  "./",
  "./index.html",
  "./style.css?v=3.6-firebase",
  "./app.js?v=3.6-firebase",
  "./manifest.json?v=3.6-firebase",
  "./home-banner.png",
  "./kkokkoma-icon-192-v34.png",
  "./kkokkoma-icon-512-v34.png",
  "./favicon-v34.png"
];

self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  if(event.request.mode==="navigate"){
    event.respondWith(fetch(event.request).catch(()=>caches.match("./index.html")));
    return;
  }
  event.respondWith(
    fetch(event.request)
      .then(response=>{
        if(response&&response.status===200){
          const copy=response.clone();
          caches.open(CACHE).then(cache=>cache.put(event.request,copy));
        }
        return response;
      })
      .catch(()=>caches.match(event.request))
  );
});
