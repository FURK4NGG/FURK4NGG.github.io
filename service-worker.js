const CACHE_VERSION = 16; // Güncel cache versiyonu
const CACHE_NAME = `my-cache-v${CACHE_VERSION}`; // Önbellek adı
const URLS_TO_CACHE = [
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

// 🚀 **Service Worker yüklenirken yeni cache’i oluştur**
self.addEventListener('install', (event) => {
    console.log(`🔄 Service Worker yükleniyor: v${CACHE_VERSION}`);
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                URLS_TO_CACHE.map(url => 
                    cache.add(url).then(() => console.log(`✅ Cache eklendi: ${url}`))
                    .catch(error => console.error(`❌ Cache eklenemedi: ${url}`, error))
                )
            );
        })
    );
});

// 🗑️ **Eski cache’leri temizle**
self.addEventListener('activate', (event) => {
    console.log(`⚡ Service Worker aktif oldu: v${CACHE_VERSION}`);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache.startsWith("my-cache-v") && cache !== CACHE_NAME) {
                        console.log(`🗑️ Eski cache siliniyor: ${cache}`);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// 🌐 **Önbellekten yükle veya internetten al**
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((networkResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        }).catch(() => caches.match('/404.html'))
    );
});
