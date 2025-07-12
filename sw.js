const CACHE_NAME = 'my-budget-app-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/style.css',
  '/src/Nav.js',
  '/src/form.js',
  '/src/AffichageTransaction.js',
  '/src/CrudFireStore.js',
  '/Dashboard.js',
  '/firebase-config.js',
  '/manifest.json',
  // Ajoutez vos autres ressources ici
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
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  console.log('Service Worker: Fetching');
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Retourner depuis le cache si disponible
      if (response) {
        return response;
      }
      
      // Sinon, aller chercher sur le réseau
      return fetch(event.request).then((response) => {
        // Vérifier si la réponse est valide
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Cloner la réponse pour la mettre en cache
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // En cas d'erreur réseau, retourner une page hors ligne
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Gestion des notifications push (optionnel)
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nouvelle notification',
    icon: '/public/icon-192.png',
    badge: '/public/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Voir l\'app',
        icon: '/public/icon-192.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/public/icon-192.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('My Budget App', options)
  );
});
