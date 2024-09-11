const FILE_VERSIONS = {
  '/index.html': '13',
  '/home_en.html': '15',
  '/home_tr.html': '14',
  '/not_found_page.html': '1',
  '/CSS/1.css': '1',
  '/CSS/2.css': '1',
  '/CSS/tr/1.css': '1',
  '/CSS/tr/2.css': '1',
  '/JAVASCRIPT/1.js': '1',
  '/JAVASCRIPT/tr/1.js': '1',
  '/service-worker.js': '1',
  '/img/ai.webp': '1',
  '/img/app.webp': '1',
  '/img/cyber.webp': '1',
  '/img/game.webp': '1',
  '/img/web.webp': '1',
  '/img/profile_photo1.webp': '1',
  '/img/robotic.webp': '1',
  '/img/up.webp': '1',
  '/img/icon.ico': '1',
  '/sitemap.xml': '1',
  '/manifest.json': '1',
  '/robots.txt': '1',
  '/.htaccess.txt': '1'
};

const CACHE_NAME = 'my-site-cache-v1';

// Dosyaları önbelleğe al
const cacheFiles = async () => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(Object.keys(FILE_VERSIONS));
};

// Versiyon kontrolü ile fetch
const cacheFirst = async (request) => {
  const url = new URL(request.url);
  const newVersion = FILE_VERSIONS[url.pathname] || '0';

  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await caches.match(request);

  if (cachedResponse) {
    const cachedVersion = new URL(cachedResponse.url).searchParams.get('v') || '0';
    if (newVersion === cachedVersion) {
      return cachedResponse;
    } else if (parseInt(newVersion, 10) > parseInt(cachedVersion, 10)) {
      return fetch(request).then(response => {
        if (response.ok) {
          const responseClone = response.clone();
          cache.put(request, responseClone);
        }
        return response;
      });
    } else {
      return fetch(request);
    }
  } else {
    try {
      const response = await fetch(request);
      if (response.ok) {
        const responseClone = response.clone();
        cache.put(request, responseClone);
      }
      return response;
    } catch (error) {
      // İstemci tarafında yanıt alınamadığında hata yanıtı döndür
      return new Response('Network error happened', {
        status: 408,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
  }
};

// Service Worker olayları
self.addEventListener('install', (event) => {
  event.waitUntil(
    cacheFiles()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    cacheFirst(event.request)
  );
});
