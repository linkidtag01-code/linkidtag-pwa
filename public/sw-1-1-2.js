// public/sw-1-1-2.js
// Simple service worker for Linkidtag PWA (cache-bust)
const VERSION = 'v1.2.0';
const APP_SHELL = [
  '/',
  '/offline.html',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION).then((cache) => cache.addAll(APP_SHELL))
  );
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
  const request = event.request;
  const url = new URL(request.url);
  const sameOrigin = self.location.origin === url.origin;

  // Navegación (HTML): network first + fallback a caché/offline
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(VERSION);
          const cached = await cache.match(request);
          return cached || cache.match('/offline.html');
        })
    );
    return;
  }

  // Activos estáticos (JS/CSS/_next) → usar red y si falla, caché
  if (
    sameOrigin &&
    (url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js') ||
      url.pathname.startsWith('/_next/'))
  ) {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
  }
});
