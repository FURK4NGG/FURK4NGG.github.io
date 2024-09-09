const CACHE_NAME = 'my-site-cache-v2';
let urlsToCache = [
  '/',  
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

// Kullanıcının dilini kontrol et
const userLang = navigator.language || navigator.userLanguage;

// Eğer tarayıcı dili Türkçe ise /tr klasöründeki dosyaları ekle
if (userLang.startsWith('tr')) {
  urlsToCache = urlsToCache.concat([
    '/tr/home.html?v=4',
    '/CSS/tr/1.css',
    '/CSS/tr/2.css',
    '/JAVASCRIPT/tr/1.js'
  ]);
} else {
  // İngilizce dosyaları ekle
  urlsToCache = urlsToCache.concat([
    '/home.html?v=2',
    '/CSS/1.css',
    '/CSS/2.css',
    '/JAVASCRIPT/1.js'
  ]);
}

// Service Worker install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Service Worker activate event
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
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
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
