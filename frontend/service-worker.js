const CACHE_NAME = 'pwa-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/js/app.js',
  '/js/login.js',
  '/js/session.js',
  '/styles/main.css',
  '/styles/dashboard.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Instalación
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activación
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => key !== CACHE_NAME ? caches.delete(key) : null)
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    e.respondWith(
      fetch(e.request)
        .then(res => caches.open(CACHE_NAME).then(cache => { cache.put(e.request, res.clone()); return res; }))
        .catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

// ✅ Push notifications compatible con Android
self.addEventListener("push", (event) => {
  console.log("📩 [SW] Push recibido:", event.data?.text());

  const data = event.data?.json() || {};
  const title = data.title || "Nueva alerta";
  const body = data.body || "Tienes una nueva notificación";

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      vibrate: [200, 100, 200],
      actions: [
        { action: "open", title: "Abrir 📲" }
      ],
      data: {
        url: data.url || "/dashboard.html",
        extra: data.data || {}
      }
    })
  );
});

// ✅ Manejo del click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(url) && "focus" in client) {
            client.postMessage({
              tipo: "notificacion",
              data: event.notification.data?.extra
            });
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});
