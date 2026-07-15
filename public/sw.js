// Kronos Tracker Service Worker - Premium Offline Experience
const CACHE_NAME = 'kronos-tracker-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/favicon.png',
  '/logo.png',
  '/logo-dark.png',
  '/icon.png',
  '/apple-touch-icon.png',
  '/og-image.png',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Offline fallback
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
    })
  );
});

// Background sync for future use
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-kronos-data') {
    // Future: sync with Supabase when online
    console.log('[SW] Syncing Kronos data...');
  }
});