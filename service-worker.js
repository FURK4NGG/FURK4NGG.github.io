const CACHE_NAME = 'my-site-cache-v11';
const LIBS_CACHE_NAME = 'libs-cache-v1'; // Kütüphaneler için ayrı bir cache

// Bu dizilerde dil kontrolü yapılır
let urlsToCache = [
  '/',
  '/index.html',
  '/not_found_page.html',
  '/service-worker.js',
  '/img/ai.webp',
  '/img/app.webp',
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

// Kütüphaneler için URL'leri ekleyin
const libsToCache = [
  '/gsap.min.js',
  '/ionicons.esm.js',
  '/ionicons.js',
  '/swiper-bundle.min.js',
  '/darkmode-js.min.js'
];

// Service Worker install event
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then(cache => {
        console.log('Opened cache for app');
        return cache.addAll(urlsToCache);
      }),
      caches.open(LIBS_CACHE_NAME).then(cache => {
        console.log('Opened cache for libraries');
        return cache.addAll(libsToCache);
      })
    ])
  );
});

// Service Worker activate event
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME, LIBS_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Service Worker fetch event
self.addEventListener('fetch', event => {
  // Kütüphaneler için cache kontrolü
  if (libsToCache.some(lib => event.request.url.includes(lib))) {
    event.respondWith(
      caches.open(LIBS_CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request);
        });
      })
    );
  } else {
    // Diğer dosyalar için cache kontrolü
    event.respondWith(
      caches.open(CACHE_NAME).then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request);
        });
      })
    );
  }
});
