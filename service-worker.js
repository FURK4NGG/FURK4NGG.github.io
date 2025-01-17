const CACHE_NAME = 'my-site-cache-v3';
const urlsToCache = [
  '/',
  '/index.html',
  '/home_en.html',
  '/home_tr.html',
  '/404.html',
  '/CSS/unpkg.comswiper@8swiper-bundle.min.css',
  '/JAVASCRIPT/1.js',
  '/JAVASCRIPT/tr/1.js',
  '/JAVASCRIPT/darkmode-js.min.js',
  '/JAVASCRIPT/gsap.min.js',
  '/JAVASCRIPT/ionicons.esm.js',
  '/JAVASCRIPT/ionicons.js',
  '/JAVASCRIPT/swiper-bundle.min.js',
  '/JAVASCRIPT/unpkg.comionicons@5.5.2distioniconsionicons.esm.js',
  '/JAVASCRIPT/unpkg.comionicons@5.5.2distioniconsionicons.js',
  '/JAVASCRIPT/unpkg.comswiper@8swiper-bundle.min.js',
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

const CURRENT_VERSION = 'v27';

// Install event - cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve files from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Activate event - update cache if version is different
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log(`Cache updated to version: ${CURRENT_VERSION}`);
      return self.clients.claim();  // Activates the new service worker immediately
    })
  );
});
