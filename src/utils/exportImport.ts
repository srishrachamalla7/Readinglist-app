import type { BackupData } from './types';
import { itemStore } from '../stores/itemStore';
import { tagStore } from '../stores/tagStore';
import { collectionStore } from '../stores/collectionStore';
import { settingsStore } from '../stores/settingsStore';

export class ExportImportManager {
  static async exportToJSON(): Promise<string> {
    const [items, tags, collections, settings] = await Promise.all([
      itemStore.getItems(),
      tagStore.getTags(),
      collectionStore.getCollections(),
      settingsStore.getSettings()
    ]);

    const backupData: BackupData = {
      version: '1.0.0',
      exportDate: new Date(),
      items,
      tags,
      collections: collections.filter((c: any) => !c.isSystem), // Don't export system collections
      settings
    };

    return JSON.stringify(backupData, null, 2);
  }

  static async exportToCSV(): Promise<string> {
    const items = await itemStore.getItems();
    const tags = await tagStore.getTags();
    const tagMap = new Map(tags.map((tag: any) => [tag.id, tag.name]));

    const headers = [
      'Title',
      'URL',
      'Description',
      'Domain',
      'Status',
      'Priority',
      'Tags',
      'Reading Time (min)',
      'Notes',
      'Created At',
      'Updated At',
      'Last Opened At'
    ];

    const rows = items.map(item => [
      item.title,
      item.url,
      item.description || '',
      item.domain,
      item.status,
      item.priority,
      item.tags.map(tagId => tagMap.get(tagId) || tagId).join('; '),
      item.estMinutes?.toString() || '',
      item.notes || '',
      item.createdAt.toISOString(),
      item.updatedAt.toISOString(),
      item.lastOpenedAt?.toISOString() || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }

  static async downloadBackup(format: 'json' | 'csv' = 'json') {
    try {
      const data = format === 'json' 
        ? await this.exportToJSON()
        : await this.exportToCSV();

      const blob = new Blob([data], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `readinglist-backup-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update last backup date
      await settingsStore.updateSettings({ lastBackupDate: new Date() });
      
      return true;
    } catch (error) {
      console.error('Backup failed:', error);
      return false;
    }
  }

  static async importFromJSON(jsonData: string): Promise<{ success: boolean; message: string; stats?: any }> {
    try {
      const backupData: BackupData = JSON.parse(jsonData);
      
      if (!this.validateBackupData(backupData)) {
        return { success: false, message: 'Invalid backup file format' };
      }

      let importedItems = 0;
      let importedTags = 0;
      let importedCollections = 0;
      let skippedItems = 0;

      // Import tags first
      for (const tag of backupData.tags) {
        try {
          const existing = await tagStore.getTagByName(tag.name);
          if (!existing) {
            await tagStore.addTag({
              name: tag.name,
              color: tag.color
            });
            importedTags++;
          }
        } catch (error) {
          console.warn('Failed to import tag:', tag.name, error);
        }
      }

      // Import collections
      for (const collection of backupData.collections) {
        try {
          const existing = await collectionStore.getCollectionByName(collection.name);
          if (!existing) {
            await collectionStore.addCollection({
              name: collection.name,
              description: collection.description,
              rules: collection.rules,
              isSystem: false,
              icon: collection.icon
            });
            importedCollections++;
          }
        } catch (error) {
          console.warn('Failed to import collection:', collection.name, error);
        }
      }

      // Import items
      for (const item of backupData.items) {
        try {
          const existing = await itemStore.getItemByUrl(item.url);
          if (!existing) {
            await itemStore.addItem({
              url: item.url,
              title: item.title,
              description: item.description,
              domain: item.domain,
              favicon: item.favicon,
              tags: item.tags,
              priority: item.priority,
              status: item.status,
              estMinutes: item.estMinutes,
              wordCount: item.wordCount,
              notes: item.notes,
              metadataFetched: item.metadataFetched || false
            });
            importedItems++;
          } else {
            skippedItems++;
          }
        } catch (error) {
          console.warn('Failed to import item:', item.title, error);
          skippedItems++;
        }
      }

      // Merge settings (don't overwrite completely)
      if (backupData.settings) {
        const currentSettings = await settingsStore.getSettings();
        await settingsStore.updateSettings({
          ...currentSettings,
          defaultPriority: backupData.settings.defaultPriority,
          autoFetch: backupData.settings.autoFetch,
          readingSpeed: backupData.settings.readingSpeed || currentSettings.readingSpeed,
          showReadingTime: backupData.settings.showReadingTime ?? currentSettings.showReadingTime
        });
      }

      return {
        success: true,
        message: `Import completed successfully`,
        stats: {
          importedItems,
          importedTags,
          importedCollections,
          skippedItems
        }
      };
    } catch (error) {
      console.error('Import failed:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Import failed' 
      };
    }
  }

  private static validateBackupData(data: any): data is BackupData {
    return (
      data &&
      typeof data === 'object' &&
      data.version &&
      data.exportDate &&
      Array.isArray(data.items) &&
      Array.isArray(data.tags) &&
      Array.isArray(data.collections) &&
      data.settings
    );
  }

  static async getStorageUsage(): Promise<{ used: number; quota: number; percentage: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage || 0;
        const quota = estimate.quota || 0;
        const percentage = quota > 0 ? (used / quota) * 100 : 0;
        
        return { used, quota, percentage };
      } catch (error) {
        console.warn('Failed to get storage estimate:', error);
      }
    }
    
    return { used: 0, quota: 0, percentage: 0 };
  }
}
