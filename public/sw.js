const CACHE_NAME = 'v1-app-shell';
const APP_SHELL = [
  '/',
  './index.html',
  './offline.html',
  './styles/styles.css',
  './manifest.webmanifest',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      for (const url of APP_SHELL) {
        try {
          await cache.add(url);
        } catch (error) {
          console.error('Gagal cache:', url, error);
        }
      }
    })
  );
  self.skipWaiting();
});



self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) =>
      Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});


self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  
  if ((requestUrl.protocol === 'http:' || requestUrl.protocol === 'https:') && event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

       
        return fetch(event.request).then((networkResponse) => {
          return caches.open('my-cache').then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      }).catch(() => caches.match('/offline.html')) 
    );
  }
});

let lastNotificationKey = '';

self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    let payload = {
      title: 'Story berhasil dibuat',
      options: {
        body: "Anda telah membuat story baru dengan deskripsi: Belajar push notification hari ini.",
        icon: "./icons/icon-192x192.png",
        badge: './icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
          url: '/', 
        }
      }
    };

    if (event.data) {
      try {
        const data = event.data.json();
        payload.title = data.title || payload.title;
        payload.options = {
          ...payload.options,
          ...data.options
        };

        if (!payload.options.icon) {
          payload.options.icon = '/icons/icon-192x192.png';
        }
        if (!payload.options.badge) {
          payload.options.badge = '/icons/icon-72x72.png';
        }

        if (data.url) {
          payload.options.data.url = data.url;
        }
      } catch (e) {
        const text = event.data.text();
        if (text) {
          payload.options.body = text;
        }
      }
    }

    const notificationKey = payload.title + '|' + payload.options.body;
    if (notificationKey === lastNotificationKey) {
      return; 
    }
    lastNotificationKey = notificationKey;

    await self.registration.showNotification(payload.title, payload.options);
  })());
});


self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil((async () => {
    const urlToOpen = event.notification.data?.url || '/';
    const allClients = await clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    const matchingClient = allClients.find(client => client.url === urlToOpen);

    if (matchingClient) {
      matchingClient.focus();
    } else if (clients.openWindow) {
      await clients.openWindow(urlToOpen);
    }
  })());
});
