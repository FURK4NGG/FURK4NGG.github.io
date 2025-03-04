const CACHE_VERSION = 6; // Versiyon numarası
const CACHE_NAME = `my-cache-v${CACHE_VERSION}`; // Cache ismi versiyon numarası ile oluşturuluyor
const URLS_TO_CACHE = [
    // Önbelleğe alınacak URL'ler
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

// Service Worker'ı kur
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(URLS_TO_CACHE);
        })
    );
});

// Service Worker etkinleştirildiğinde
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Eğer cache ismi mevcut cache ismi değilse, sil
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch olayını dinle
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Eğer cache'de varsa, onu döndür
            if (response) {
                return response;
            }

            // Eğer cache'de yoksa ve internete bağlıysak
            return fetch(event.request).then((networkResponse) => {
                // Cache'e kaydet
                return caches.open(CACHE_NAME).then((cache) => {
                    return cache.put(event.request, networkResponse.clone()).then(() => {
                        return networkResponse; // Yanıtı döndür
                    });
                });
            });
        }).catch(() => {
            // Eğer offline isek, eski cache'i kullan
            return caches.match(event.request);
        })
    );
});
