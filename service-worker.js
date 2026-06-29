const CACHE_NAME = 'shamli-stone-work-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/gallery.html',
  '/admin.html',
  '/login.html',
  '/style.css',
  '/script.js',
  '/gallery.js',
  '/admin.js',
  '/supabase.js'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch cached files
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Update cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
