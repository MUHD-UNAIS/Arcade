const CACHE_NAME = 'myth-vs-fact-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/logo.svg',
    '/manifest.json',
    '/stickman_assets/clock_stickman.svg',
    '/stickman_assets/empty_stickman.svg',
    '/stickman_assets/girl_distressed.svg',
    '/stickman_assets/guy_distressed.svg',
    '/stickman_assets/happy_stickman.svg',
    '/stickman_assets/pointing_stickman.svg',
    '/stickman_assets/sad_stickman.svg',
    '/stickman_assets/thinking_stickman.svg',
    '/ThemeAudio/bc.mp3',
    '/ThemeAudio/campus.mp3',
    '/ThemeAudio/owl.mp3',
    '/ThemeAudio/park.mp3',
    '/ThemeAudio/rain.mp3',
    '/ThemeAudio/victory.mp3'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (!event.request.url.startsWith('http')) return;
    
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) return response;
                return fetch(event.request).then(networkResponse => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    return networkResponse;
                }).catch(() => null);
            })
    );
});
