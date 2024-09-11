// Determine the cache version dynamically
const CURRENT_VERSION = 13;  // Current cache version number
const CACHE_NAME = `my-site-cache-v${CURRENT_VERSION}`;  // Dynamically named cache

const urlsToCache = [
  '/',
  `/index.html?v=${CURRENT_VERSION}`,
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

// Check the user's language
const userLang = navigator.language || navigator.userLanguage;
const additionalUrlsToCache = userLang.startsWith('tr') ? [
  `/home.html?v=${CURRENT_VERSION}`,  // Same file name with versioning
  '/CSS/tr/1.css?v=${CURRENT_VERSION}',
  '/CSS/tr/2.css?v=${CURRENT_VERSION}',
  '/JAVASCRIPT/tr/1.js?v=${CURRENT_VERSION}'
] : [
  `/home.html?v=${CURRENT_VERSION}`,  // Same file name with versioning
  '/CSS/1.css?v=${CURRENT_VERSION}',
  '/CSS/2.css?v=${CURRENT_VERSION}',
  '/JAVASCRIPT/1.js?v=${CURRENT_VERSION}'
];

// Install event - Add files to the cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache: ' + CACHE_NAME);
      return cache.addAll([...urlsToCache, ...additionalUrlsToCache]);
    })
  );
});

// Activate event - Clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // If there's a cache with an older version, delete it
          const currentCacheNumber = parseInt(CACHE_NAME.match(/\d+/)[0], 10);
          const cacheVersionNumber = parseInt(cacheName.match(/\d+/)[0], 10);
          if (cacheVersionNumber < currentCacheNumber) {
            console.log('Deleting outdated cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - Serve cached content or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }

      return fetch(event.request).then(response => {
        if (event.request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
