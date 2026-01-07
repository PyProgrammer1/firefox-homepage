const CACHE_NAME = "newtab-firefox-v2";

// Detect base path (works for localhost + GitHub Pages)
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, "");

const PRECACHE_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,

  // CSS & JS
  `${BASE_PATH}/css/styles.css`,
  `${BASE_PATH}/js/index.js`,

  // Assets
  `${BASE_PATH}/assets/clock.png`,
  `${BASE_PATH}/assets/favicon.png`,
  `${BASE_PATH}/assets/logo.png`,
  `${BASE_PATH}/assets/windows.png`,
  `${BASE_PATH}/assets/DS-DIGI.TTF`,
  `${BASE_PATH}/assets/segoeui.ttf`
];

// Install
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of PRECACHE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (err) {
          console.error("[SW] Failed to cache:", asset, err);
        }
      }
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch (cache-first)
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, copy);
          });
          return response;
        });
    })
  );
});
