// Manifest App Service Worker - Offline Support
const CACHE_NAME = 'manifest-app-v1';
const STATIC_CACHE = 'manifest-static-v1';

// Resurser att cacha för offline-användning
const CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/assets/icon.png',
  '/assets/adaptive-icon.png'
];

// Install - cacka kritiska resurser
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Caching app shell');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('✅ Service Worker installed');
        return self.skipWaiting(); // Aktivera direkt
      })
      .catch((error) => {
        console.error('❌ Service Worker install failed:', error);
      })
  );
});

// Activate - rensa gamla cachar
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker activated');
        return self.clients.claim(); // Ta kontroll direkt
      })
  );
});

// Fetch - cache-first strategi för offline support
self.addEventListener('fetch', (event) => {
  // Endast för GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip för cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Om vi har cachad version, returnera den
        if (cachedResponse) {
          console.log('📦 Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Annars försök hämta från nätverket
        return fetch(event.request)
          .then((networkResponse) => {
            // Cache the response för framtida användning
            if (networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.log('🔌 Network failed, serving offline page');
            
            // För navigation requests, returnera en offline sida
            if (event.request.mode === 'navigate') {
              return caches.match('/') || new Response(
                '<!DOCTYPE html><html><head><title>Manifest - Offline</title></head>' +
                '<body><h1>🔌 Offline</h1><p>Appen är offline. Starta servern eller anslut till internet.</p></body></html>',
                { headers: { 'Content-Type': 'text/html' } }
              );
            }
            
            throw error;
          });
      })
  );
});

// Background sync för att spara data när appen kommer online
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    // Här kan vi synka sparad data när appen kommer online
  }
});

console.log('🎯 Manifest App Service Worker loaded');