const CACHE_NAME = 'sp-cache-v20';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/css/mobile-fix.css',
  '/assets/js/script.min.js',
  '/assets/js/products.min.js',
  '/assets/js/product.min.js',
  '/assets/images/img.logosuperiorplast.jpg',
  '/assets/images/logosuperior02.svg?v=2',
  '/assets/images/Cadeira Bistrô Preta.jpg',
  '/assets/images/Cadeira Bistrô Branca.jpg',
  '/assets/images/Cadeira Poltrona Preta.jpg',
  '/assets/images/Cadeira Poltrona Branca.jpg',
  '/assets/images/Cadeira Robusta XL Preta.jpg',
  '/assets/images/Cadeira Robusta XL Branca.jpg',
  '/assets/images/Mesa Monobloco Preta.jpg',
  '/assets/images/Mesa Monobloco Branca.jpg',
  '/assets/images/Conjunto Cadeira Bistrô Branca.jpg',
  '/assets/images/Conjunto Cadeira Bistrô Preta.jpg',
  '/assets/images/Conjunto Cadeira Poltrona Branca.jpg',
  '/assets/images/Conjunto Cadeira Poltrona Preta.jpg',
  '/assets/images/Conjunto Cadeira Robusta XL Branca.jpg',
  '/assets/images/Conjunto Cadeira Robusta XL Preta.jpg',
  '/offline.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          // Atualiza o cache com novos arquivos
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => caches.match('/offline.html'));
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Imagens: preferir cache para garantir exibição mesmo offline
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            if (!response || response.status !== 200) throw new Error('imagem indisponível');
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            return response;
          })
          .catch(() => caches.match('/assets/images/img.logosuperiorplast.jpg'));
      })
    );
    return;
  }

  // Demais requisições: rede primeiro com fallback para cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
