// Dosyalar için ayrı ayrı versiyon numaraları
const FILE_VERSIONS = {
  '/index.html': '1',
  '/home_en.html': '3',
  '/home_tr.html': '1',
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

// Cache adı
const CACHE_NAME = 'my-site-cache';

// Install eventi - Dosyaları önbelleğe al
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.all(
        Object.keys(FILE_VERSIONS).map(url => {
          return fetch(url).then(response => {
            if (response.ok) {
              return response.text().then(text => {
                const versionedUrl = `${url}?v=${FILE_VERSIONS[url]}`;
                return cache.put(versionedUrl, new Response(text, { headers: response.headers }));
              });
            }
            return Promise.reject('Failed to fetch ' + url);
          });
        })
      );
    })
  );
});

// Fetch eventi - Versiyonları kontrol et
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.pathname in FILE_VERSIONS) {
    const newVersion = FILE_VERSIONS[url.pathname];
    const requestUrlWithVersion = `${url.pathname}?v=${newVersion}`;

    event.respondWith(
      caches.match(requestUrlWithVersion).then(cachedResponse => {
        if (cachedResponse) {
          const cachedVersion = new URL(cachedResponse.url).searchParams.get('v');
          
          if (cachedVersion === newVersion) {
            // Versiyonlar eşitse, önbellekteki dosyayı kullan
            return cachedResponse;
          } else if (parseInt(newVersion, 10) > parseInt(cachedVersion, 10)) {
            // Yeni versiyon mevcut, yeni dosyayı fetch et ve cache'e kaydet
            return fetch(request).then(response => {
              if (response.ok) {
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                  cache.put(requestUrlWithVersion, responseClone);
                });
              }
              return response;
            });
          } else {
            // Yeni versiyon daha eski, yeni versiyonu göster ama cache'e kaydetme
            return fetch(request);
          }
        } else {
          // Önceki versiyon yok, yeni dosyayı fetch et ve cache'e kaydet
          return fetch(request).then(response => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(requestUrlWithVersion, responseClone);
              });
            }
            return response;
          });
        }
      })
    );
  } else {
    // Versiyon kontrolü gerektirmeyen dosyalar
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request);
      })
    );
  }
});
