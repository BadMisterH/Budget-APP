const CACHE_NAME = 'my-budget-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/logo.png'
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching Files');
        // Mettre en cache uniquement les fichiers essentiels
        return cache.addAll([
          '/',
          '/manifest.json'
        ]);
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

// Interception des requêtes (plus simple)
self.addEventListener('fetch', (event) => {
  // Ne pas intercepter les requêtes vers Firebase ou autres APIs externes
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('identitytoolkit.googleapis.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      // En cas d'erreur réseau, essayer le cache
      return caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        // Retourner la page principale pour les documents
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      });
    })
  );
});
