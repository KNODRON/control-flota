const CACHE_NAME = 'os9-cache-v1';
const ASSETS = [
  '/',                            // Por si usas start_url: "."
  '/index.html',
  '/manifest.json',
  '/logo_os9.png',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Si tu CSS y JS están en archivos locales:
  // '/styles.css',
  // '/app.js'
];

// Al instalar el SW, cacheamos los assets esenciales:
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Al activar, limpiamos caches antiguas:
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Interceptamos peticiones para servir de cache primero:
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Solo caché para peticiones GET de nuestro mismo origen:
  if (event.request.method !== 'GET' || url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // Devolvemos del cache primero
        return cached;
      }
      // Si no está, vamos a red y lo guardamos
      return caches.open(CACHE_NAME).then(cache =>
        fetch(event.request).then(resp => {
          // (Opcional) Solo cachear respuestas válidas
          if (resp.ok) cache.put(event.request, resp.clone());
          return resp;
        })
      );
    })
  );
});
