import { db } from '../utils/database';
import type { Settings, Theme, Priority } from '../utils/types';

class SettingsStore {
  private listeners: Set<() => void> = new Set();
  private cachedSettings: Settings | null = null;

  private readonly DEFAULT_SETTINGS: Settings = {
    theme: 'system',
    viewMode: 'list',
    sortBy: 'dateAdded',
    sortDirection: 'desc',
    sidebarCollapsed: false,
    itemsPerPage: 50,
    showReadingTime: true,
    readingSpeed: 200,
    autoFetchMetadata: true,
    confirmDelete: true,
    // Back-compat flags used by older code/imports
    defaultPriority: 'medium',
    autoFetch: true,
  };

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  async getSettings(): Promise<Settings> {
    if (this.cachedSettings) {
      return this.cachedSettings;
    }

    const settings = await db.settings.get('default');
    if (!settings) {
      // Create default settings if they don't exist
      const defaults = this.DEFAULT_SETTINGS;
      await db.settings.add({ ...defaults, id: 'default' });
      this.cachedSettings = defaults;
      return defaults;
    }

    const { id, ...settingsData } = settings as Settings & { id: string };

    // Merge with defaults to ensure all fields are present
    const merged: Settings = {
      ...this.DEFAULT_SETTINGS,
      ...settingsData,
      // Map legacy flag if primary is missing
      autoFetchMetadata:
        settingsData.autoFetchMetadata ?? (settingsData as any).autoFetch ?? this.DEFAULT_SETTINGS.autoFetchMetadata,
    };

    this.cachedSettings = merged;
    return merged;
  }

  async updateSettings(updates: Partial<Settings>) {
    // Merge updates with current
    const current = await this.getSettings();
    const next: Settings = { ...current, ...updates } as Settings;
    await db.settings.update('default', next as any);

    this.cachedSettings = next;
    this.notify();
  }

  async updateTheme(theme: Theme) {
    await this.updateSettings({ theme });
  }

  async updateDefaultPriority(priority: Priority) {
    await this.updateSettings({ defaultPriority: priority });
  }

  async updateAutoFetch(autoFetch: boolean) {
    await this.updateSettings({ autoFetch, autoFetchMetadata: autoFetch });
  }

  // Theme management
  async applyTheme() {
    const settings = await this.getSettings();
    const root = document.documentElement;

    if (settings.theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    } else {
      root.classList.toggle('dark', settings.theme === 'dark');
    }
  }

  // Initialize theme listener
  init() {
    this.applyTheme();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      this.applyTheme();
    });
  }
}

export const settingsStore = new SettingsStore();