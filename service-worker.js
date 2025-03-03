self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName.startsWith('cache-')) {
            const cacheVersion = parseInt(cacheName.replace('cache-v', ''), 10);
            if (cacheVersion < 50) {  // v50 öncesini sil
              console.log(`Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          }
        })
      );
    })
  );
});
