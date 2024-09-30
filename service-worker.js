const CACHE_NAME = 'my-site-cache-v3';  // Versiyon numarası burada
const urlsToCache = [
  '/',
  '/index.html',
  '/home_en.html',
  '/home_tr.html',
  '/not_found_page.html',
  '/CSS/1.css',
  '/CSS/2.css',
  '/CSS/tr/1.css',
  '/CSS/tr/2.css',
  '/JAVASCRIPT/1.js',
  '/JAVASCRIPT/tr/1.js',
  '/JAVASCRIPT/darkmode-js.min.js',
  '/JAVASCRIPT/gsap.min.js',
  '/JAVASCRIPT/ionicons.esm.js',
  '/JAVASCRIPT/ionicons.js',
  '/JAVASCRIPT/swiper-bundle.min.js',
  '/service-worker.js',
  '/img/ai.webp',
  '/img/app.webp',
  '/img/character1.webp',
  '/img/cyber.webp',
  '/img/game.webp',
  '/img/web.webp',
  '/img/profile_photo1.webp',
  '/img/robotic.webp',
  '/img/up.webp',
  '/img/icon.ico',
  '/sitemap.xml',
  '/manifest.json',
  '/robots.txt',
  '/.htaccess.txt'
];

self.addEventListener('install', event => {
  // Cache dosyalarını ekleyelim
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files: ', urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('Cache error during install:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  // Cache'deki dosyayı bul ve dön
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Serving from cache: ', event.request.url);
          return response;  // Cache'den getir
        }
        console.log('Fetching from network: ', event.request.url);
        return fetch(event.request);  // Ağdan al
      })
      .catch(err => {
        console.error('Fetch error:', err);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache: ', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
