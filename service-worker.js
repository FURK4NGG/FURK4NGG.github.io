caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
        caches.open(cacheName).then(async (cache) => {
            const requests = await cache.keys();
            for (let request of requests) {
                if (request.url.startsWith(location.origin)) {
                    const deleted = await cache.delete(request);
                    if (deleted) {
                        console.log(`🗑️ Silindi: ${request.url}`);
                    }
                }
            }
        });
    });
});
