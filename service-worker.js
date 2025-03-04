const CACHE_VERSION = 7; // Güncel cache versiyonu
const CACHE_NAME = `my-cache-v${CACHE_VERSION}`; // Önbellek adı
const URLS_TO_CACHE = [
    '/', '/index.html', '/home_en.html', '/home_tr.html', '/404.html',
    '/FONTS/Inconsolata.woff2', '/FONTS/Jaro.woff2', '/FONTS/Monomakh.woff2',
    '/FONTS/Montserrat.woff2', '/FONTS/TacOne.woff2', '/FONTS/Teko.woff2',
    '/JAVASCRIPT/1.js', '/JAVASCRIPT/tr/1.js', '/JAVASCRIPT/darkmode-js.min.js',
    '/JAVASCRIPT/gsap.min.js', '/JAVASCRIPT/swiper-bundle.min.js',
    '/service-worker.js', '/img/profile_photo1.webp', '/img/character1.webp',
    '/img/character2.webp', '/img/character3.webp', '/img/ai.webp',
    '/img/app.webp', '/img/cyber.webp', '/img/game.webp', '/img/robotic.webp',
    '/img/web.webp', '/img/up.webp', '/img/icon.ico', '/sitemap.xml',
    '/manifest.json', '/robots.txt', '/.htaccess.txt'
];

// 📌 **localStorage'dan eski versiyonu al**
const oldCacheVersion = localStorage.getItem('cache_version') || 0;

// 🔄 **Service Worker yüklenirken internetten yeni cache’i al**
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(async (cache) => {
            console.log(`🔄 Yeni cache yükleniyor: v${CACHE_VERSION}`);

            for (let url of URLS_TO_CACHE) {
                try {
                    await cache.add(url);
                    console.log(`✅ Cache eklendi: ${url}`);
                } catch (error) {
                    console.error(`❌ Cache eklenemedi: ${url}`, error);
                }
            }
        })
    );
});

// 🚀 **Aktif olunca eski cache'leri temizle ve yeni versiyonu kaydet**
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName.startsWith("my-cache-v") && cacheName !== CACHE_NAME) {
                        console.log(`🗑️ Eski cache siliniyor: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log(`💾 Yeni versiyon kaydedildi: v${CACHE_VERSION}`);
            localStorage.setItem('cache_version', CACHE_VERSION);
        })
    );
});

// 🔍 **Cache'i kontrol et, yoksa internetten al ve kaydet**
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
