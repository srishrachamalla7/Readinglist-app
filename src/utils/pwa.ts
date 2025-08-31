export class PWAManager {
  private registration: ServiceWorkerRegistration | null = null;

  async init() {
    if ('serviceWorker' in navigator) {
      // Check if we're in StackBlitz environment
      if (window.location.hostname.includes('stackblitz')) {
        console.log('PWA features disabled in StackBlitz environment');
        return;
      }

      try {
        // Use classic SW in development to avoid ESM import issues
        this.registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered successfully');
        
        // Listen for updates
        this.registration.addEventListener('updatefound', () => {
          const newWorker = this.registration!.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateAvailable();
              }
            });
          }
        });
      } catch (error) {
        // Silently handle service worker registration failures in unsupported environments
        if (error instanceof Error && error.message.includes('Service Workers are not yet supported')) {
          console.log('Service Worker not supported in this environment - PWA features will be limited');
        } else {
          const msg = (error as any)?.message ?? String(error);
          console.log('Service Worker registration failed:', msg);
          // Don't throw error to prevent app from breaking
        }
      }
    }
  }

  private showUpdateAvailable() {
    if (confirm('A new version of the app is available. Update now?')) {
      window.location.reload();
    }
  }

  async checkForUpdates() {
    if (this.registration) {
      await this.registration.update();
    }
  }

  isInstallable(): boolean {
    return 'beforeinstallprompt' in window;
  }

  async promptInstall() {
    const event = (window as any).deferredPrompt;
    if (event) {
      event.prompt();
      const result = await event.userChoice;
      return result.outcome === 'accepted';
    }
    return false;
  }
}

export const pwaManager = new PWAManager();

// Listen for install prompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  (window as any).deferredPrompt = e;
});