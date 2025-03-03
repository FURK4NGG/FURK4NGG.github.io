self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Tüm cache'leri siliyoruz
          console.log(`Deleting cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      console.log('All caches deleted');
      // Yeni cache eklemek istersen, burada bunu yapabilirsin
      return self.clients.claim();
    })
  );
});
