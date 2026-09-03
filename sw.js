const CACHE='carrot-tour-20260903-v19aaa';
const CORE=[
  './',
  './index.html',
  './style.css?v=20260903-v19aa',
  './app.js?v=20260903-v19aa',
  './horses.js?v=20260903-v19aa',
  './video-evaluation.js?v=20260903-v19aa',
  './family-data.js?v=20260903-v19aa',
  './surgery-data.js?v=20260903-v19aa',
  './tour-extra-data.js?v=20260903-v19aa',
  './reference-data.js?v=20260903-v19aa',
  './manifest.webmanifest?v=20260903-v19aa',
  './icon-180.png',
  './icon-512.png',
  './map-shiraoi.jpg',
  './map-y56.jpg',
  './map-k2.jpg',
  './map-y910.jpg',
  './map-y1112.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});

async function networkFirst(request) {
  try {
    const fresh = await fetch(request, {cache:'no-store'});
    const cache = await caches.open(CACHE);
    cache.put(request, fresh.clone());
    return fresh;
  } catch (e) {
    return (await caches.match(request)) || (await caches.match('./index.html'));
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const fresh = await fetch(request);
  const cache = await caches.open(CACHE);
  cache.put(request, fresh.clone());
  return fresh;
}

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.mode === 'navigate' || /\.(?:js|css|webmanifest)$/.test(url.pathname)) {
    event.respondWith(networkFirst(req));
    return;
  }

  if (/\.(?:jpg|png)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  event.respondWith(networkFirst(req));
});
