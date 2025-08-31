// Platform-specific utilities for Windows and Android
export class PlatformManager {
  private static instance: PlatformManager;

  static getInstance(): PlatformManager {
    if (!PlatformManager.instance) {
      PlatformManager.instance = new PlatformManager();
    }
    return PlatformManager.instance;
  }

  // Detect platform
  getPlatform(): 'windows' | 'android' | 'ios' | 'mac' | 'linux' | 'unknown' {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('android')) return 'android';
    if (userAgent.includes('iphone') || userAgent.includes('ipad')) return 'ios';
    if (userAgent.includes('mac')) return 'mac';
    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('linux')) return 'linux';
    
    return 'unknown';
  }

  // Check if running as PWA
  isPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  // Windows-specific features
  async enableWindowsFeatures(): Promise<void> {
    if (this.getPlatform() !== 'windows') return;

    // Windows 11 title bar customization
    if ('windowControlsOverlay' in navigator) {
      const titleBarArea = (navigator as any).windowControlsOverlay;
      if (titleBarArea?.visible) {
        document.documentElement.style.setProperty(
          '--title-bar-area-x', 
          `${titleBarArea.getTitlebarAreaRect().x}px`
        );
        document.documentElement.style.setProperty(
          '--title-bar-area-width', 
          `${titleBarArea.getTitlebarAreaRect().width}px`
        );
      }
    }

    // Windows jump list support
    if ('setAppBadge' in navigator) {
      // Set app badge for unread items count
      this.updateAppBadge();
    }
  }

  // Android-specific features
  async enableAndroidFeatures(): Promise<void> {
    if (this.getPlatform() !== 'android') return;

    // Android share target
    if ('share' in navigator) {
      this.setupShareTarget();
    }

    // Android shortcuts
    if ('getInstalledRelatedApps' in navigator) {
      this.setupAndroidShortcuts();
    }

    // Android back button handling
    this.setupAndroidBackButton();
  }

  // Update app badge (Windows/Android)
  async updateAppBadge(count?: number): Promise<void> {
    if ('setAppBadge' in navigator) {
      try {
        if (count && count > 0) {
          await (navigator as any).setAppBadge(count);
        } else {
          await (navigator as any).clearAppBadge();
        }
      } catch (error) {
        console.warn('Failed to update app badge:', error);
      }
    }
  }

  // Share functionality
  async shareContent(data: { title: string; text?: string; url?: string }): Promise<boolean> {
    if ('share' in navigator) {
      try {
        await navigator.share(data);
        return true;
      } catch (error) {
        console.warn('Share failed:', error);
        return false;
      }
    }
    
    // Fallback: copy to clipboard
    if ('clipboard' in navigator) {
      try {
        const shareText = `${data.title}\n${data.text || ''}\n${data.url || ''}`.trim();
        await navigator.clipboard.writeText(shareText);
        return true;
      } catch (error) {
        console.warn('Clipboard write failed:', error);
      }
    }
    
    return false;
  }

  // Setup share target (Android)
  private setupShareTarget(): void {
    // Handle incoming shares
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SHARE_TARGET') {
          const { title, text, url } = event.data;
          this.handleIncomingShare({ title, text, url });
        }
      });
    }
  }

  // Handle incoming shared content
  private handleIncomingShare(data: { title?: string; text?: string; url?: string }): void {
    // Dispatch custom event for the app to handle
    const shareEvent = new CustomEvent('incomingShare', { detail: data });
    window.dispatchEvent(shareEvent);
  }

  // Setup Android shortcuts
  private setupAndroidShortcuts(): void {
    // Add dynamic shortcuts for quick actions
    const shortcuts = [
      {
        name: 'Add Article',
        short_name: 'Add',
        description: 'Quickly add a new article',
        url: '/?action=add',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }]
      },
      {
        name: 'Search',
        short_name: 'Search',
        description: 'Search your reading list',
        url: '/?action=search',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }]
      }
    ];

    // Update manifest dynamically if supported
    if ('getManifest' in navigator) {
      // This would require service worker support
      console.log('Dynamic shortcuts configured:', shortcuts);
    }
  }

  // Android back button handling
  private setupAndroidBackButton(): void {
    let backButtonPressed = false;

    const handleBackButton = (event: PopStateEvent) => {
      // Check if we're in a modal or overlay
      const hasModal = document.querySelector('[role="dialog"]') || 
                      document.querySelector('.modal') ||
                      document.querySelector('.overlay');

      if (hasModal) {
        event.preventDefault();
        // Close modal instead of navigating back
        const closeButton = document.querySelector('[aria-label="Close"]') as HTMLElement;
        closeButton?.click();
        return;
      }

      // Double-tap to exit behavior
      if (backButtonPressed) {
        // Let the default back behavior happen (exit app)
        return;
      }

      event.preventDefault();
      backButtonPressed = true;

      // Show toast message
      const toast = document.createElement('div');
      toast.textContent = 'Press back again to exit';
      toast.className = 'fixed bottom-4 left-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg text-center z-50';
      document.body.appendChild(toast);

      setTimeout(() => {
        backButtonPressed = false;
        document.body.removeChild(toast);
      }, 2000);
    };

    window.addEventListener('popstate', handleBackButton);
  }

  // Get platform-specific CSS classes
  getPlatformClasses(): string[] {
    const platform = this.getPlatform();
    const classes = [`platform-${platform}`];
    
    if (this.isPWA()) {
      classes.push('pwa-mode');
    }

    // Add Windows-specific classes
    if (platform === 'windows') {
      classes.push('windows-controls');
      if ('windowControlsOverlay' in navigator) {
        classes.push('windows-overlay');
      }
    }

    // Add Android-specific classes
    if (platform === 'android') {
      classes.push('android-safe-area');
      if (window.screen.orientation) {
        classes.push(`orientation-${window.screen.orientation.type.split('-')[0]}`);
      }
    }

    return classes;
  }

  // Initialize platform features
  async init(): Promise<void> {
    const platform = this.getPlatform();
    
    // Add platform classes to body
    document.body.classList.add(...this.getPlatformClasses());

    // Enable platform-specific features
    if (platform === 'windows') {
      await this.enableWindowsFeatures();
    } else if (platform === 'android') {
      await this.enableAndroidFeatures();
    }

    // Listen for orientation changes (mobile)
    if ('orientation' in window.screen) {
      window.screen.orientation.addEventListener('change', () => {
        // Update orientation classes
        document.body.classList.remove('orientation-portrait', 'orientation-landscape');
        document.body.classList.add(`orientation-${window.screen.orientation.type.split('-')[0]}`);
      });
    }
  }
}
