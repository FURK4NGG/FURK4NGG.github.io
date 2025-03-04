const CURRENT_VERSION = 'v75';  // Güncel versiyon
const CACHE_NAME = cache-v${CURRENT_VERSION};  // Cache ismi 'cache-vX' formatında

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

// Install event - Cache dosyalarını ekle
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log(✅ Caching files for version: ${CURRENT_VERSION});
        return cache.addAll(urlsToCache);  // Tüm dosyaları cache'e ekle
      })
  );
});

// Fetch event - İnternetten dosya al, yoksa cache'den al
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Eğer internetten başarılı bir şekilde dosya alındıysa
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;  // Geçerli değilse, direkt döndür
        }

        // Cache'e yeni dosyayı ekleyelim
        caches.open(CACHE_NAME).then(cache => {
          cache.match(event.request).then(cachedResponse => {
            // Yeni versiyon, eski versiyondan büyükse eski cache'i silip yeni cache'i ekle
            if (parseInt(CURRENT_VERSION.replace('v', ''), 10) > parseInt(CACHE_NAME.replace('cache-v', ''), 10)) {
              console.log(🚨 New version found. Updating cache...);
              caches.keys().then(cacheNames => {
                return Promise.all(
                  cacheNames.map(cacheName => {
                    if (cacheName.startsWith('cache-v') && cacheName !== CACHE_NAME) {
                      console.log(🗑 Deleting old cache: ${cacheName});
                      return caches.delete(cacheName);  // Eski cache'i sil
                    }
                  })
                );
              }).then(() => {
                // Yeni versiyon cache'i ekle
                cache.put(event.request, response.clone());
              });
            }
          });
        });

        // Yeni versiyonlu cache'i döndür
        return response;
      })
      .catch(() => {
        // Eğer offline durumdaysak, cache'den döndür
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            console.log('🗂 Offline - Serving from cache');
            return cachedResponse;  // Cache'den döndür
          }

          // Cache'de de yoksa, 404 sayfasını döndür
          return caches.match('/404.html');
        });
      })
  );
});

// Activate event - Eski cache'leri sil ve yeni cache'i aktif et
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('cache-v') && cacheName !== CACHE_NAME) {
            console.log(🗑 Deleting old cache: ${cacheName});
            return caches.delete(cacheName);  // Eski cache'i sil
          }
        })
      );
    }).then(() => {
      console.log(✅ Cache updated to version: ${CURRENT_VERSION});
      return self.clients.claim();  // Yeni cache versiyonunu hemen aktif et
    })
  );
});
