const CURRENT_VERSION = 'v80';
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

// 1️⃣ Service Worker yüklenirken en son cache versiyonunu al
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log(`✅ ${CURRENT_VERSION} için dosyalar cache'e ekleniyor...`);
      return cache.addAll(urlsToCache);
    })
  );
});

// 2️⃣ Fetch event - İlk olarak internetten dene, sonra cache'e bak
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Eğer online isek ve güncel veriye ulaştıysak, cache'i güncelle
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Offline ise cache'den çek
        return caches.match(event.request);
      })
  );
});

// 3️⃣ Aktivasyon (Eski cache'leri temizleme)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Eski versiyonları temizle
          if (cacheName.startsWith('cache-v') && cacheName !== CACHE_NAME) {
            console.log(`🗑️ Eski cache siliniyor: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log(`🚀 Yeni cache aktif: ${CURRENT_VERSION}`);
      return self.clients.claim();
    })
  );
});
