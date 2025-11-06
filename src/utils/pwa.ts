// Service Worker Registration and PWA Utilities

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | undefined> {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });

      console.log('✅ Service Worker registered successfully:', registration.scope);

      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60000); // Check every minute

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available
              console.log('🔄 New version available! Please refresh.');
              
              // Notify user about update
              if (window.confirm('A new version of ROOTSnROUTES is available! Reload to update?')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      });

      // Handle controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Service Worker controller changed');
        window.location.reload();
      });

      return registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  } else {
    console.warn('⚠️ Service Worker not supported in this browser');
  }
}

/**
 * Unregister service worker (for development/testing)
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const success = await registration.unregister();
      console.log('Service Worker unregistered:', success);
      return success;
    }
  }
  return false;
}

/**
 * Check if app is installed as PWA
 */
export function isPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true ||
         document.referrer.includes('android-app://');
}

/**
 * Setup install prompt
 */
export function setupInstallPrompt(callback?: (canInstall: boolean) => void): void {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    
    console.log('💾 PWA install prompt available');
    
    if (callback) {
      callback(true);
    }
  });

  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installed successfully');
    deferredPrompt = null;
    
    // Track installation
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'pwa_install', {
        event_category: 'engagement',
        event_label: 'PWA Installed'
      });
    }
  });
}

/**
 * Show install prompt
 */
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn('⚠️ Install prompt not available');
    return false;
  }

  try {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);
    
    deferredPrompt = null;
    return outcome === 'accepted';
  } catch (error) {
    console.error('❌ Error showing install prompt:', error);
    return false;
  }
}

/**
 * Check if install prompt is available
 */
export function canInstall(): boolean {
  return deferredPrompt !== null;
}

/**
 * Check online/offline status
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Setup online/offline listeners
 */
export function setupNetworkListeners(
  onOnline?: () => void,
  onOffline?: () => void
): () => void {
  const handleOnline = () => {
    console.log('🌐 Back online');
    if (onOnline) onOnline();
  };

  const handleOffline = () => {
    console.log('📴 Gone offline');
    if (onOffline) onOffline();
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.warn('⚠️ Notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    console.log('🔔 Notification permission:', permission);
    return permission;
  }

  return Notification.permission;
}

/**
 * Show local notification
 */
export async function showNotification(
  title: string,
  options?: NotificationOptions
): Promise<void> {
  const permission = await requestNotificationPermission();

  if (permission === 'granted') {
    const registration = await navigator.serviceWorker.getRegistration();
    
    if (registration) {
      await registration.showNotification(title, {
        icon: '/icon-192x192.png',
        badge: '/favicon-32x32.png',
        vibrate: [100, 50, 100],
        ...options
      });
    }
  }
}

/**
 * Cache specific URLs
 */
export async function cacheUrls(urls: string[]): Promise<void> {
  const registration = await navigator.serviceWorker.getRegistration();
  
  if (registration && registration.active) {
    registration.active.postMessage({
      type: 'CACHE_URLS',
      urls
    });
  }
}

/**
 * Clear all caches
 */
export async function clearAllCaches(): Promise<void> {
  const registration = await navigator.serviceWorker.getRegistration();
  
  if (registration && registration.active) {
    registration.active.postMessage({
      type: 'CLEAR_CACHE'
    });
  }
  
  // Also clear caches directly
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('🗑️ All caches cleared');
  }
}

/**
 * Get cache size
 */
export async function getCacheSize(): Promise<number> {
  if ('caches' in window && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return estimate.usage || 0;
  }
  return 0;
}

/**
 * Check if app can be installed
 */
export function checkInstallability(): {
  canInstall: boolean;
  isInstalled: boolean;
  isSupported: boolean;
} {
  return {
    canInstall: canInstall(),
    isInstalled: isPWA(),
    isSupported: 'serviceWorker' in navigator && 'PushManager' in window
  };
}

/**
 * Get PWA display mode
 */
export function getDisplayMode(): 'browser' | 'standalone' | 'minimal-ui' | 'fullscreen' {
  const displayMode = ['fullscreen', 'standalone', 'minimal-ui', 'browser'] as const;
  
  for (const mode of displayMode) {
    if (window.matchMedia(`(display-mode: ${mode})`).matches) {
      return mode;
    }
  }
  
  return 'browser';
}

/**
 * Share content using Web Share API
 */
export async function shareContent(data: ShareData): Promise<boolean> {
  if (!navigator.share) {
    console.warn('⚠️ Web Share API not supported');
    return false;
  }

  try {
    await navigator.share(data);
    console.log('✅ Content shared successfully');
    return true;
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error('❌ Error sharing:', error);
    }
    return false;
  }
}

/**
 * Initialize PWA
 */
export async function initializePWA(options?: {
  onInstallable?: (canInstall: boolean) => void;
  onOnline?: () => void;
  onOffline?: () => void;
}): Promise<void> {
  console.log('🚀 Initializing PWA...');

  // Register service worker
  await registerServiceWorker();

  // Setup install prompt
  setupInstallPrompt(options?.onInstallable);

  // Setup network listeners
  setupNetworkListeners(options?.onOnline, options?.onOffline);

  // Log PWA status
  console.log('📱 PWA Status:', {
    isInstalled: isPWA(),
    canInstall: canInstall(),
    isOnline: isOnline(),
    displayMode: getDisplayMode()
  });

  console.log('✅ PWA initialized successfully');
}

export default {
  registerServiceWorker,
  unregisterServiceWorker,
  isPWA,
  setupInstallPrompt,
  showInstallPrompt,
  canInstall,
  isOnline,
  setupNetworkListeners,
  requestNotificationPermission,
  showNotification,
  cacheUrls,
  clearAllCaches,
  getCacheSize,
  checkInstallability,
  getDisplayMode,
  shareContent,
  initializePWA
};
