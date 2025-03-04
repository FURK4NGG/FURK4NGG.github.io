caches.keys().then((cacheNames) => {
    cacheNames.forEach((cacheName) => {
        caches.open(cacheName).then((cache) => {
            cache.keys().then((requests) => {
                requests.forEach((request) => {
                    if (request.url.startsWith(location.origin)) {
                        cache.delete(request).then((deleted) => {
                            if (deleted) {
                                console.log(`🗑️ Silindi: ${request.url}`);
                            }
                        });
                    }
                });
            });
        });
    });
});
