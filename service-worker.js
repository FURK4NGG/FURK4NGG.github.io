const CACHE_VERSION = 11; // Versiyon numarası
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

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log(`🔄 Caching files for version: ${CACHE_VERSION}`);

            // Tek tek ekleyerek hataları yakala
            for (let url of URLS_TO_CACHE) {
                try {
                    await cache.add(url);
                    console.log(`✅ Cached: ${url}`);
                } catch (error) {
                    console.error(`❌ Failed to cache: ${url}`, error);
                }
            }
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Eğer cache ismi mevcut cache ismi değilse, sil
                    if (cacheName !== CACHE_NAME) {
                        console.log(`🗑️ Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) return response;
            
            return fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        }).catch(() => caches.match(event.request))
    );
});
