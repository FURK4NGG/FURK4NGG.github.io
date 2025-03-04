self.addEventListener('install', (event) => {
  self.skipWaiting(); // Eski service worker'ı beklemeden yeni worker'ı yükle

  event.waitUntil(
    fetch('/version.json')
      .then((response) => response.json())
      .then((versionData) => {
        // Versiyon verisini aldıktan sonra, cache'e ekle
        const urlsToCache = Object.keys(versionData).map((file) => {
          return `${file}?v=${versionData[file]}`; // Versiyon bilgisi ekleniyor
        });

        return caches.open('v2').then((cache) => {
          return cache.addAll(urlsToCache); // 'v2' ismi ile cache oluşturuluyor
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['v2']; // Yeni cache ismi (örneğin v2)
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);  // Eski cache'leri sil
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((response) => {
          const clonedResponse = response.clone();
          caches.open('v2').then((cache) => {
            cache.put(event.request, clonedResponse);  // cache'e ekle
          });
          return response;
        })
      );
    })
  );
});
