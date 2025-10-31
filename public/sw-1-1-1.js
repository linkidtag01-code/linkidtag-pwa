// Simple service worker for Linkidtag PWA
const VERSION = 'v1.3.3';
const APP_SHELL = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== VERSION ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  const sameOrigin = self.location.origin === url.origin;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((res) => {
        caches.open(VERSION).then((cache) => cache.put(request, res.clone()));
        return res;
      }).catch(async () => {
        const cache = await caches.open(VERSION);
        const cached = await cache.match(request);
        return cached || cache.match('/offline.html');
      })
    );
    return;
  }

  if (sameOrigin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((networkRes) => {
          caches.open(VERSION).then((cache) => cache.put(request, networkRes.clone()));
          return networkRes;
        }).catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});
