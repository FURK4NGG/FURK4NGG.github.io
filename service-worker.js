const CURRENT_VERSION = 'v50'; // Versiyonu güncelle
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

// Install event - Yeni versiyonu yükle
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log(`Caching files for version: ${CURRENT_VERSION}`);
      await cache.addAll(urlsToCache);
    })()
  );
  self.skipWaiting(); // Yeni versiyonu anında etkinleştir
});

// Fetch event - Cache varsa kullan, yoksa ağdan al
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// Activate event - Eski cache'leri %100 temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      
      // Tüm eski cache'leri temizle, sadece yeni olanı bırak
      await Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('cache-') && cacheName !== CACHE_NAME) {
            console.log(`Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );

      console.log(`Cache updated to version: ${CURRENT_VERSION}`);
      await self.clients.claim();

      // Açık sekmeleri güncelle
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach(client => {
        client.navigate(client.url);
      });
    })()
  );
});
