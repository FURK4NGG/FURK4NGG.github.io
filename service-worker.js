const CACHE_NAME = 'my-site-cache-v3';  // Versiyon numarası
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

const CURRENT_VERSION = 'v3';  // Yeni versiyon numarası

// Install event: Versiyona bağlı olarak cache oluşturma
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files...');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Cache'den veri sunulur, internetten varsa cache güncellenir
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Activate event: Eski versiyon cache'leri temizlenir ve versiyona göre cache güncellenir
self.addEventListener('activate', event => {
  const storedVersion = localStorage.getItem('cache-version');
  if (storedVersion !== CURRENT_VERSION) {
    console.log(`New version detected: ${CURRENT_VERSION}. Updating cache...`);
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
        localStorage.setItem('cache-version', CURRENT_VERSION);
        console.log(`Cache updated to version: ${CURRENT_VERSION}`);
      })
    );
  } else {
    console.log(`Cache version is up-to-date: ${CURRENT_VERSION}`);
  }
});
