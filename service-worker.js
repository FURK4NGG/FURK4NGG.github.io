self.addEventListener('install', (event) => {
  event.waitUntil(
    fetch('/version.json')
      .then((response) => response.json())
      .then((versionData) => {
        // Versiyon verisini aldıktan sonra, cache'e ekle
        const urlsToCache = Object.keys(versionData).map((file) => {
          return `${file}?v=${versionData[file]}`;
        });

        return caches.open('v1').then((cache) => {
          return cache.addAll(urlsToCache);
        });
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = ['v1']; // Yeni cache ismi
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
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
          caches.open('v1').then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
      );
    })
  );
});
