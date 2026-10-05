export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA] ServiceWorker registered with scope:', registration.scope);
        })
        .catch((error) => {
          console.warn('[PWA] ServiceWorker registration failed:', error);
        });
    });
  } else if ('serviceWorker' in navigator) {
    // Register in dev mode for local testing if needed
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[PWA Dev] ServiceWorker registered with scope:', registration.scope);
        })
        .catch((err) => {
          console.log('[PWA Dev] ServiceWorker registration skipped:', err);
        });
    });
  }
}
