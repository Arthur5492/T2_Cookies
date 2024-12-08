const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/push.js",
  // icons
];

let num = 3;
let deferredPrompt;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Intercept requisitions
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("push", event => {
  const data = event.data ? event.data.json() : {};
  console.log("Push recieved:", data);

  const options = {
    body: data.body || "You have a notification!",
    // icon: "", // Ícone da notificação
    // badge: "", // Ícone da barra de notificações
  };

  event.waitUntil(self.registration.showNotification(data.title || "Notification", options));
});






