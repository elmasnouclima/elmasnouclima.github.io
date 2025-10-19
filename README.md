[sw.js](https://github.com/user-attachments/files/22991892/sw.js)[offline.html](https://github.com/user-attachments/files/22991891/offline.html)# elmasnou.github.io[index.html](https://github.com/user-attachments/files/22991890/index.html)
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#0a5ca8">[Uplo<!doctype html>
<html lang="es">[Uploadin/* Simple cache-first service worker */
const CACHE_NAME = 'estacion-pwa-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/styles.css',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(PRECACHE);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  // Cache-first for same-origin
  if (new URL(request.url).origin === self.location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const fresh = await fetch(request);
        return fresh;
      } catch (e) {
        if (request.mode === 'navigate') {
          const offline = await caches.match(OFFLINE_URL);
          if (offline) return offline;
        }
        throw e;
      }
    })());
  }
});
g sw.js…]()

<head>
  <meta charset="utf-8">[Uploading manifest.we{
  "name": "Mi Estación (Weathercloud)",
  "short_name": "Estación",
  "description": "PWA sencilla para abrir tu panel de Weathercloud y mostrar la pegatina de la estación.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0a5ca8",
  "theme_color": "#0a5ca8",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}bmanifest…]()

  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sin conexión</title>
  <link rel="stylesheet" href="assets/styles.css">
</head>
<body class="offline">
  <main>
    <div class="card">
      <h2>Sin conexión</h2>
      <p>No hay internet ahora mismo. Puedes volver atrás o reintentar más tarde.</p>
    </div>
  </main>
</body>
</html>
ading offline.html…]()

  <link rel="manifest" href="manifest.webmanifest">
  <link rel="apple-touch-icon" href="icons/icon-192.png">
  <link rel="icon" sizes="192x192" href="icons/icon-192.png">
  <title>Mi Estación | Weathercloud</title>
  <link rel="stylesheet" href="assets/styles.css">
  <script>
    // Detect offline/online and toggle class
    function updateOnlineStatus() {
      document.documentElement.classList.toggle('offline', !navigator.onLine);
    }
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    window.addEventListener('load', updateOnlineStatus);
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
      });
    }
  </script>
</head>
<body>
  <header>
    <img class="logo" src="icons/icon-192.png" alt="icono">
    <h1>Mi Estación — Opción 1 (PWA)</h1>
  </header>

  <main>
    <div class="card">
      <img class="sticker" src="https://app.weathercloud.net/device/sticker/4096084067" alt="Weathercloud sticker de mi estación" loading="lazy" />
      <div class="actions">
        <a class="button" href="https://app.weathercloud.net/d4096084067" target="_blank" rel="noopener">Abrir panel completo</a>
        <button class="secondary" onclick="window.location.reload()">Actualizar</button>
      </div>
      <div class="offline-note">Estás sin conexión. Verás esta pegatina en caché. El panel completo requiere conexión.</div>
    </div>
  </main>

  <footer>
    Hecho para mostrar rápidamente tu Weathercloud en el móvil. Instálala desde el menú del navegador.
  </footer>
</body>
</html>
