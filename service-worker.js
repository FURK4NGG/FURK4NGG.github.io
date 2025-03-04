const CURRENT_VERSION = 'v77';  // Güncel versiyon numarasını belirleyin
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

// Install event - Cache dosyaları yükle
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(`✅ Caching files for version: ${CURRENT_VERSION}`);
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - Cache'deki dosyaları kullan, yoksa ağdan al
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Activate event - Eski cache'leri sil ve yeni cache'i ekle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          const cacheVersion = parseInt(cacheName.replace('cache-v', ''), 10);
          const incomingVersion = parseInt(CURRENT_VERSION.replace('v', ''), 10);

          // Yeni versiyon daha büyükse eski cache'leri sil ve yeni cache'i ekle
          if (cacheName.startsWith('cache-') && cacheVersion !== incomingVersion) {
            console.log(`🗑️ Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log(`✅ Cache updated to version: ${CURRENT_VERSION}`);
      return self.clients.claim(); // Yeni cache'i aktif et
    })
  );
});
