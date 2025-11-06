// ROOTSnROUTES Service Worker - Advanced PWA Implementation
const CACHE_VERSION = 'v3.0.0';
const STATIC_CACHE = `rootsnroutes-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `rootsnroutes-dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `rootsnroutes-images-${CACHE_VERSION}`;
const API_CACHE = `rootsnroutes-api-${CACHE_VERSION}`;

// Static assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/favicon.svg',
  '/apple-touch-icon.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/offline.html'
];

// API endpoints to cache (Supabase, Groq, Weather)
const API_ENDPOINTS = [
  'supabase.co',
  'api.groq.com',
  'openweathermap.org'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('📦 Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {cache: 'reload'})));
      })
      .then(() => {
        console.log('✅ Service Worker: Installation complete');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('❌ Service Worker: Installation failed', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE &&
                cacheName !== API_CACHE) {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('✅ Service Worker: Activation complete');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (request.method === 'GET') {
    // Images - Cache First strategy
    if (request.destination === 'image') {
      event.respondWith(handleImageRequest(request));
    }
    // API requests - Network First strategy
    else if (isApiRequest(url)) {
      event.respondWith(handleApiRequest(request));
    }
    // Static assets - Cache First strategy
    else if (isStaticAsset(url)) {
      event.respondWith(handleStaticRequest(request));
    }
    // Dynamic content - Network First with cache fallback
    else {
      event.respondWith(handleDynamicRequest(request));
    }
  }
});

// Cache First strategy for images
async function handleImageRequest(request) {
  try {
    const cache = await caches.open(IMAGE_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    
    // Cache successful responses
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Image fetch failed:', error);
    // Return placeholder image if available
    return new Response('', { status: 404, statusText: 'Not Found' });
  }
}

// Network First strategy for API requests
async function handleApiRequest(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful API responses
    if (response && response.status === 200) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.warn('API fetch failed, checking cache:', error);
    
    // Fallback to cache
    const cache = await caches.open(API_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // Return error response
    return new Response(
      JSON.stringify({ error: 'Offline - Unable to fetch data' }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache First strategy for static assets
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.error('Static asset fetch failed:', error);
    
    // For HTML requests, return offline page
    if (request.destination === 'document') {
      const cache = await caches.open(STATIC_CACHE);
      const offlinePage = await cache.match('/offline.html');
      return offlinePage || new Response('Offline', { status: 503 });
    }
    
    return new Response('', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Network First strategy for dynamic content
async function handleDynamicRequest(request) {
  try {
    const response = await fetch(request);
    
    // Cache successful responses
    if (response && response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.warn('Dynamic content fetch failed, checking cache:', error);
    
    // Fallback to cache
    const cache = await caches.open(DYNAMIC_CACHE);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    // For HTML requests, return offline page
    if (request.destination === 'document') {
      const staticCache = await caches.open(STATIC_CACHE);
      const offlinePage = await staticCache.match('/offline.html');
      return offlinePage || new Response('Offline', { status: 503 });
    }
    
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Helper: Check if request is to API endpoint
function isApiRequest(url) {
  return API_ENDPOINTS.some(endpoint => url.hostname.includes(endpoint)) ||
         url.pathname.startsWith('/api/');
}

// Helper: Check if request is for static asset
function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.woff', '.woff2', '.ttf', '.eot', '.svg'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
         url.pathname.includes('/assets/');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'sync-bookings') {
    event.waitUntil(syncBookings());
  } else if (event.tag === 'sync-itineraries') {
    event.waitUntil(syncItineraries());
  }
});

// Sync offline bookings
async function syncBookings() {
  try {
    // Get offline bookings from IndexedDB (if implemented)
    console.log('📤 Syncing offline bookings...');
    // Implementation would sync with Supabase
  } catch (error) {
    console.error('❌ Booking sync failed:', error);
  }
}

// Sync offline itineraries
async function syncItineraries() {
  try {
    console.log('📤 Syncing offline itineraries...');
    // Implementation would sync with localStorage/Supabase
  } catch (error) {
    console.error('❌ Itinerary sync failed:', error);
  }
}

// Push notification handler
self.addEventListener('push', (event) => {
  console.log('🔔 Service Worker: Push notification received');
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'ROOTSnROUTES';
  const options = {
    body: data.body || 'New update available!',
    icon: '/icon-192x192.png',
    badge: '/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: data.url || '/'
    },
    actions: [
      {
        action: 'explore',
        title: 'View',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/favicon-32x32.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('👆 Service Worker: Notification clicked', event.action);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    const urlToOpen = event.notification.data.url || '/';
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  }
});

// Message handler for communication with main app
self.addEventListener('message', (event) => {
  console.log('💬 Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.urls || [];
    event.waitUntil(
      caches.open(DYNAMIC_CACHE)
        .then(cache => cache.addAll(urlsToCache))
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('🎉 Service Worker: Loaded successfully');
