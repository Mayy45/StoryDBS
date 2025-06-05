const CACHE_NAME = 'v1-app-shell';
const APP_SHELL = [
  '/',
  './index.html',
  './offline.html',
  './styles/styles.css',
  './manifest.webmanifest',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/icon-72x72.png'
];

// Install event: Cache app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(
        APP_SHELL.map(async url => {
          try {
            await cache.add(url);
          } catch (error) {
            console.error('❌ Gagal cache:', url, error);
          }
        })
      )
    )
  );
  self.skipWaiting();
});


self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});


self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method === 'GET' && /^https?:/.test(request.url)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;

        return fetch(request)
          .then(response => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(request, response.clone());
              return response;
            });
          })
          .catch(() => caches.match('/offline.html'));
      })
    );
  }
});


let lastNotificationKey = '';

self.addEventListener('push', event => {
  event.waitUntil((async () => {
    let payload = {
      title: 'Story berhasil dibuat',
      options: {
        body: 'Anda telah membuat story baru.',
        icon: './icons/icon-192x192.png',
        badge: './icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: { url: '/' }
      }
    };

    try {
      if (event.data) {
        const data = event.data.json();

        payload.title = data.title || payload.title;
        payload.options = {
          ...payload.options,
          ...data.options,
          data: { ...payload.options.data, ...data.options?.data }
        };
      }
    } catch (e) {
      const text = event.data?.text();
      if (text) payload.options.body = text;
    }

    const key = `${payload.title}|${payload.options.body}`;
    if (key === lastNotificationKey) return;
    lastNotificationKey = key;

    await self.registration.showNotification(payload.title, payload.options);
  })());
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil((async () => {
    const targetUrl = event.notification.data?.url || '/';
    const clientsList = await clients.matchAll({ type: 'window', includeUncontrolled: true });

    const matchingClient = clientsList.find(client => client.url === targetUrl);

    if (matchingClient) {
      matchingClient.focus();
    } else if (clients.openWindow) {
      await clients.openWindow(targetUrl);
    }
  })());
});
