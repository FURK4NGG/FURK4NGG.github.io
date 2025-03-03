const CURRENT_VERSION = 'v64';  // Versiyon numarasını güncelle
const CACHE_NAME = `cache-${CURRENT_VERSION}`;

const urlsToCache = [
  '/', 
  '/index.html', 
  '/home_en.html', 
  '/home_tr.html',
  '/404.html', 
  '/CSS/unpkg.comswiper@8swiper-bundle.min.css',
  '/FONTS/Inconsolata.woff2', 
  '/FONTS/Jaro.woff2', 
  '/FONTS/Monomakh.woff2',
  '/FONTS/Montserrat.woff2', 
  '/FONTS/TacOne.woff2', 
  '/FONTS/Teko.woff2',
  '/JAVASCRIPT/1.js', 
  '/JAVASCRIPT/tr/1.js',
  '/JAVASCRIPT/darkmode-js.min.js',
  '/JAVASCRIPT/gsap.min.js',
  '/JAVASCRIPT/swiper-bundle.min.js',
  '/service-worker.js',
  '/img/profile_photo1.webp',
  '/img/character1.webp',
  '/img/character2.webp',
  '/img/character3.webp',
  '/img/ai.webp',
  '/img/app.webp',
  '/img/cyber.webp',
  '/img/game.webp',
  '/img/robotic.webp',
  '/img/web.webp',
  '/img/up.webp',
  '/img/icon.ico',
  '/sitemap.xml',
  '/manifest.json',
  '/robots.txt',
  '/.htaccess.txt'
];

// Install event - Cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log(`Caching files for version: ${CURRENT_VERSION}`);
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event - Delete old caches and load new ones
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          console.log(`Deleting cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches deleted');
      return caches.open(CACHE_NAME).then(cache => {
        console.log(`Caching new files for version: ${CURRENT_VERSION}`);
        return cache.addAll(urlsToCache);
      });
    }).then(() => {
      console.log(`Cache updated to version: ${CURRENT_VERSION}`);
      return self.clients.claim();  // New cache activated
    })
  );
});

// Fetch event - Serve from cache if available, else fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
