import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Clean up old caches
cleanupOutdatedCaches();

// Precache all static assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache-first strategy for app shell (HTML, CSS, JS, icons)
registerRoute(
  ({ request }) => 
    request.destination === 'document' ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'manifest',
  new CacheFirst({
    cacheName: 'app-shell-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache-first for icons and images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Stale-while-revalidate for metadata and favicons
registerRoute(
  ({ url }) => 
    url.pathname.includes('favicon') ||
    url.pathname.includes('manifest') ||
    url.pathname.includes('metadata'),
  new StaleWhileRevalidate({
    cacheName: 'metadata-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);

// Runtime caching for external resources (fonts, CDNs)
registerRoute(
  ({ url }) => 
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com' ||
    url.origin === 'https://cdn.jsdelivr.net' ||
    url.origin === 'https://unpkg.com',
  new StaleWhileRevalidate({
    cacheName: 'external-resources-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
      }),
    ],
  })
);

// Network-first for API calls with fallback to cache
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache-v1',
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Offline fallback page for navigation requests
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: 'pages-v1',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  }),
  {
    allowlist: [/^\/$/], // Only apply to root and main routes
  }
);

registerRoute(navigationRoute);

// Cache versioning and cleanup on activate
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating - cleaning up old caches');
  
  event.waitUntil(
    (async () => {
      // Clean up old cache versions
      const cacheNames = await caches.keys();
      const oldCaches = cacheNames.filter(name => 
        !name.includes('-v1') && (
          name.includes('app-shell') ||
          name.includes('images') ||
          name.includes('metadata') ||
          name.includes('external-resources') ||
          name.includes('api-cache') ||
          name.includes('pages')
        )
      );
      
      await Promise.all(
        oldCaches.map(cacheName => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
      
      // Take control of all clients
      await self.clients.claim();
    })()
  );
});

// Install event - skip waiting for immediate activation
self.addEventListener('install', (event) => {
  console.log('Service Worker installing');
  self.skipWaiting();
});

// Handle offline fallback for navigation requests
self.addEventListener('fetch', (event) => {
  // Only handle navigation requests that aren't already handled by routes
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // Return cached main page as fallback
        return caches.match('/') || new Response(
          `<!DOCTYPE html>
          <html>
          <head>
            <title>ReadingList - Offline</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { 
                font-family: system-ui, sans-serif; 
                text-align: center; 
                padding: 2rem; 
                background: #f8fafc;
                color: #334155;
              }
              .offline-container {
                max-width: 400px;
                margin: 0 auto;
                padding: 2rem;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              }
              .icon { font-size: 3rem; margin-bottom: 1rem; }
              h1 { color: #1e293b; margin-bottom: 0.5rem; }
              p { color: #64748b; margin-bottom: 1.5rem; }
              button {
                background: #3b82f6;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
              }
              button:hover { background: #2563eb; }
            </style>
          </head>
          <body>
            <div class="offline-container">
              <div class="icon">📚</div>
              <h1>You're Offline</h1>
              <p>Your reading list is still available! Check your cached books or try reconnecting.</p>
              <button onclick="window.location.reload()">Try Again</button>
            </div>
          </body>
          </html>`,
          { headers: { 'Content-Type': 'text/html' } }
        );
      })
    );
  }
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Here you could sync any pending data changes
  }
});

// Handle push notifications (for future features)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});