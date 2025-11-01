// public/sw-1-1-3.js
// Service Worker Linkidtag (cache-bust fuerte)
const VERSION = 'v1.3.0';
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
  const req = event.request;
  const url = new URL(req.url);
  const sameOrigin = self.location.origin === url.origin;

  // Navegación (HTML): network-first con fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(VERSION);
          const cached = await cache.match(req);
          return cached || cache.match('/offline.html');
        })
    );
    return;
  }

  // Estáticos (css/js/_next)
  if (
    sameOrigin &&
    (url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js') ||
      url.pathname.startsWith('/_next/'))
  ) {
    event.respondWith(fetch(req).catch(() => caches.match(req)));
  }
});
