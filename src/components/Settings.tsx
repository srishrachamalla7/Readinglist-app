import React, { useState } from 'react';
import { X, Trash2, Download, Upload, Moon, Sun, Monitor, Palette, Database, Shield } from 'lucide-react';
import { Settings as SettingsType, Tag, Collection } from '../utils/types';
import { ExportImportManager } from '../utils/exportImport';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsType;
  onUpdateSettings: (updates: Partial<SettingsType>) => void;
  tags: Tag[];
  collections: Collection[];
  onDeleteTag: (id: string) => void;
  onDeleteCollection: (id: string) => void;
  onClearAllData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  tags,
  collections,
  onDeleteTag,
  onDeleteCollection,
  onClearAllData
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'data' | 'tags' | 'collections'>('general');
  const [storageUsage, setStorageUsage] = useState<{ used: number; quota: number } | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      ExportImportManager.getStorageUsage().then(setStorageUsage);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleExport = async (format: 'json' | 'csv') => {
    try {
      await ExportImportManager.downloadBackup(format);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          await ExportImportManager.importFromJSON(text);
        } catch (error) {
          console.error('Import failed:', error);
        }
      }
    };
    input.click();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 p-4">
            <nav className="space-y-2">
              {[
                { id: 'general', label: 'General', icon: Monitor },
                { id: 'data', label: 'Data Management', icon: Database },
                { id: 'tags', label: 'Tags', icon: Palette },
                { id: 'collections', label: 'Collections', icon: Shield }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Appearance</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <div className="flex gap-2">
                        {[
                          { value: 'light', label: 'Light', icon: Sun },
                          { value: 'dark', label: 'Dark', icon: Moon },
                          { value: 'system', label: 'System', icon: Monitor }
                        ].map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => onUpdateSettings({ theme: value as any })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                              settings.theme === value
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default View Mode
                      </label>
                      <select
                        value={settings.viewMode}
                        onChange={(e) => onUpdateSettings({ viewMode: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="grid">Grid</option>
                        <option value="list">List</option>
                        <option value="compact">Compact</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Items per Page
                      </label>
                      <select
                        value={settings.itemsPerPage}
                        onChange={(e) => onUpdateSettings({ itemsPerPage: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={200}>200</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Behavior</h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.autoFetchMetadata}
                        onChange={(e) => onUpdateSettings({ autoFetchMetadata: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Automatically fetch metadata when adding URLs
                      </span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.confirmDelete}
                        onChange={(e) => onUpdateSettings({ confirmDelete: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Confirm before deleting items
                      </span>
                    </label>

                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={settings.showReadingTime}
                        onChange={(e) => onUpdateSettings({ showReadingTime: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        Show estimated reading time
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Storage</h3>
                  
                  {storageUsage && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Storage Used</span>
                        <span className="text-sm font-medium">
                          {formatBytes(storageUsage.used)} / {formatBytes(storageUsage.quota)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(storageUsage.used / storageUsage.quota) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Backup & Restore</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Export Data
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleExport('json')}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Export JSON
                        </button>
                        <button
                          onClick={() => handleExport('csv')}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Export CSV
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Import Data
                      </label>
                      <button
                        onClick={handleImport}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Import JSON
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
                  
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete all data? This cannot be undone.')) {
                        onClearAllData();
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All Data
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'tags' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Manage Tags</h3>
                  <span className="text-sm text-gray-500">{tags.length} tags</span>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <span className="font-medium">{tag.name}</span>
                      </div>
                      <button
                        onClick={() => onDeleteTag(tag.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'collections' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Manage Collections</h3>
                  <span className="text-sm text-gray-500">{collections.length} collections</span>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {collections.map((collection) => (
                    <div key={collection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{collection.name}</div>
                        {collection.description && (
                          <div className="text-sm text-gray-600">{collection.description}</div>
                        )}
                      </div>
                      <button
                        onClick={() => onDeleteCollection(collection.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
