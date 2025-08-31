import { useState, useEffect } from 'react';
import { settingsStore } from '../stores/settingsStore';
import type { Settings } from '../utils/types';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    // Keep in sync with SettingsStore.DEFAULT_SETTINGS
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
    // Back-compat
    defaultPriority: 'medium',
    autoFetch: true,
  });
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const settingsData = await settingsStore.getSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    settingsStore.init();
    
    const unsubscribe = settingsStore.subscribe(() => {
      refreshData();
    });

    return unsubscribe;
  }, []);

  const updateSettings = async (updates: Partial<Settings>) => {
    await settingsStore.updateSettings(updates);
  };

  return {
    settings,
    loading,
    updateSettings,
    refreshData,
  };
}