const CACHE_NAME = 'my-budget-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './vite.svg'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Service Worker: Cache failed', error);
      })
  );
  // Forcer l'activation immédiate
  self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Prendre le contrôle immédiatement
  return self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourner depuis le cache si disponible
      if (response) {
        return response;
      }
      
      // Sinon, aller chercher sur le réseau
      return fetch(event.request).catch(() => {
        // En cas d'erreur réseau, retourner une page hors ligne
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
