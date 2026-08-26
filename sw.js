const CACHE='carrot-tour-2026-final-v2';
const ASSETS=["./", "./index.html", "./style.css", "./app.js", "./horses.js", "./video-evaluation.js", "./manifest.webmanifest", "./icon-180.png", "./icon-512.png", "./map-shiraoi.jpg", "./map-y56.jpg", "./map-k2.jpg", "./map-y910.jpg", "./map-y1112.jpg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const cp=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));return resp;}).catch(()=>caches.match('./index.html'))));});
