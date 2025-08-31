import { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { AdvancedSearchBar } from './components/AdvancedSearchBar';
import { Sidebar } from './components/Sidebar';
import { ItemCard } from './components/ItemCard';
import { ItemForm } from './components/ItemForm';
import { EmptyState } from './components/EmptyState';
import { ViewToggle } from './components/ViewToggle';
import { SortDropdown } from './components/SortDropdown';
import { ToastContainer } from './components/Toast';
import { Settings } from './components/Settings';
import { Analytics } from './components/Analytics';
import { ColorPicker } from './components/ColorPicker';
import { useItems } from './hooks/useItems';
import { useCollections } from './hooks/useCollections';
import { useSettings } from './hooks/useSettings';
import { useTags } from './hooks/useTags';
import { itemStore } from './stores/itemStore';
import { collectionStore } from './stores/collectionStore';
import { tagStore } from './stores/tagStore';
import { ExportImportManager } from './utils/exportImport';
import { KeyboardShortcutManager } from './utils/keyboardShortcuts';
import { NetworkStatusManager } from './utils/networkStatus';
import { PWAManager } from './utils/pwa';
import { PlatformManager } from './utils/platform';
import {
  Item,
  ItemStatus,
  ViewMode,
  SortOption,
  SortDirection,
  SearchFilters,
  ToastNotification,
  NetworkStatus
} from './utils/types';

function App() {
  const { items, loading } = useItems();
  const { tags } = useTags();
  const { collections } = useCollections();
  const { settings, updateSettings } = useSettings();
  
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>();
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(settings.sidebarCollapsed);
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);
  const [networkState, setNetworkState] = useState<NetworkStatus>({ isOnline: true, pendingOperations: 0 });
  const [currentView, setCurrentView] = useState<'dashboard' | 'analytics'>('dashboard');
  
  // Advanced search and filtering
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    tags: [],
    status: [],
    priority: [],
    domains: [],
    collections: [],
  });

  useEffect(() => {
    const pwaManager = new PWAManager();
    const keyboardShortcuts = new KeyboardShortcutManager();
    const networkStatus = new NetworkStatusManager();
    const platformManager = PlatformManager.getInstance();
    
    pwaManager.init();
    platformManager.init();
    
    // Setup keyboard shortcuts
    keyboardShortcuts.register({
      key: '/',
      description: 'Focus search',
      action: () => {
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        searchInput?.focus();
      }
    });
    
    keyboardShortcuts.register({
      key: 'n',
      ctrlKey: true,
      description: 'Add new item',
      action: () => setShowForm(true)
    });
    
    keyboardShortcuts.register({
      key: 'Escape',
      description: 'Close modals',
      action: () => {
        setShowForm(false);
        setShowSettings(false);
        setEditingItem(undefined);
      }
    });

    // Network status listener
    const unsubscribeNetwork = networkStatus.addListener(setNetworkState);
    setNetworkState(networkStatus.getStatus());

    return () => {
      // Cleanup will be handled by the managers themselves
      unsubscribeNetwork();
    };
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = items;

    // Apply search query
    if (filters.query.trim()) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.domain.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.notes && item.notes.toLowerCase().includes(query))
      );
    }

    // Apply status filters
    if (filters.status.length > 0) {
      filtered = filtered.filter(item => filters.status.includes(item.status));
    }

    // Apply priority filters
    if (filters.priority.length > 0) {
      filtered = filtered.filter(item => filters.priority.includes(item.priority));
    }

    // Apply tag filters
    if (filters.tags.length > 0) {
      filtered = filtered.filter(item => 
        filters.tags.some(tagId => item.tags.includes(tagId))
      );
    }

    // Apply domain filters
    if (filters.domains.length > 0) {
      filtered = filtered.filter(item => filters.domains.includes(item.domain));
    }

    // Apply date range filter
    if (filters.dateRange) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= filters.dateRange!.start && itemDate <= filters.dateRange!.end;
      });
    }

    // Apply reading time filter
    if (filters.readingTimeRange) {
      filtered = filtered.filter(item => {
        const readingTime = item.estMinutes || 0;
        return readingTime >= filters.readingTimeRange!.min && readingTime <= filters.readingTimeRange!.max;
      });
    }

    // Sort items
    filtered.sort((a, b) => {
      switch (settings.sortBy) {
        case 'title':
          return settings.sortDirection === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return settings.sortDirection === 'asc'
            ? priorityOrder[a.priority] - priorityOrder[b.priority]
            : priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'readingTime':
          return settings.sortDirection === 'asc'
            ? (a.estMinutes || 0) - (b.estMinutes || 0)
            : (b.estMinutes || 0) - (a.estMinutes || 0);
        case 'domain':
          return settings.sortDirection === 'asc'
            ? a.domain.localeCompare(b.domain)
            : b.domain.localeCompare(a.domain);
        case 'dateAdded':
        default:
          return settings.sortDirection === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [items, filters, settings.sortBy, settings.sortDirection]);

  const handleAddItem = () => {
    setEditingItem(undefined);
    setShowForm(true);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSaveItem = async (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingItem) {
        await itemStore.updateItem(editingItem.id, itemData);
      } else {
        await itemStore.addItem(itemData);
      }
      setShowForm(false);
      setEditingItem(undefined);
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleStatusChange = async (id: string, status: ItemStatus) => {
    try {
      await itemStore.updateItem(id, { status });
    } catch (error) {
      console.error('Error updating item status:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await itemStore.deleteItem(id);
        addNotification({
          type: 'success',
          title: 'Item deleted',
          message: 'The item has been removed from your reading list.'
        });
      } catch (error) {
        console.error('Error deleting item:', error);
        addNotification({
          type: 'error',
          title: 'Delete failed',
          message: 'Failed to delete the item. Please try again.'
        });
      }
    }
  };

  const addNotification = (notification: Omit<ToastNotification, 'id'>) => {
    const newNotification: ToastNotification = {
      ...notification,
      id: crypto.randomUUID()
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleExport = async () => {
    try {
      await ExportImportManager.downloadBackup('json');
      addNotification({
        type: 'success',
        title: 'Export successful',
        message: 'Your reading list has been exported to downloads.'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Export failed',
        message: 'Failed to export your reading list.'
      });
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
          const result = await ExportImportManager.importFromJSON(text);
          
          if (result.success) {
            addNotification({
              type: 'success',
              title: 'Import successful',
              message: `Imported ${result.stats?.importedItems || 0} items, ${result.stats?.importedTags || 0} tags.`
            });
          } else {
            addNotification({
              type: 'error',
              title: 'Import failed',
              message: result.message
            });
          }
        } catch (error) {
          addNotification({
            type: 'error',
            title: 'Import failed',
            message: 'Failed to read the backup file.'
          });
        }
      }
    };
    input.click();
  };

  const toggleSidebar = () => {
    const newCollapsed = !sidebarCollapsed;
    setSidebarCollapsed(newCollapsed);
    updateSettings({ sidebarCollapsed: newCollapsed });
  };

  const toggleTheme = () => {
    const newTheme = settings.theme === 'light' ? 'dark' : 'light';
    updateSettings({ theme: newTheme });
  };

  const handleSortChange = (sortBy: SortOption, sortDirection: SortDirection) => {
    updateSettings({ sortBy, sortDirection });
  };

  const handleViewModeChange = (viewMode: ViewMode) => {
    updateSettings({ viewMode });
  };

  const uniqueDomains = Array.from(new Set(items.map(item => item.domain)));
  const isFiltered = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : !!value
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your reading list...</p>
          {networkState.pendingOperations > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {networkState.pendingOperations} operations pending...
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ? 'dark bg-gray-900' 
        : 'bg-gray-50'
    }`}>
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
          filters={filters}
          onFiltersChange={setFilters}
          tags={tags}
          collections={collections}
          onOpenSettings={() => setShowSettings(true)}
          onExport={handleExport}
          onImport={handleImport}
          currentView={currentView}
          onViewChange={setCurrentView}
          theme={settings.theme === 'system' ? 'light' : settings.theme}
          onThemeToggle={toggleTheme}
          isOnline={networkState.isOnline}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden dynamic-bg">
          {/* Header */}
          <Header onAddItem={handleAddItem} />
          
          {/* Conditional Content Based on View */}
          {currentView === 'analytics' ? (
            <Analytics stats={{
              totalItems: items.length,
              unreadItems: items.filter(item => item.status === 'unread').length,
              readingItems: items.filter(item => item.status === 'reading').length,
              completedItems: items.filter(item => item.status === 'completed').length,
              archivedItems: items.filter(item => item.status === 'archived').length,
              totalReadingTime: items.reduce((total, item) => total + (item.estMinutes || 0), 0),
              averageReadingTime: items.length > 0 ? Math.round(items.reduce((total, item) => total + (item.estMinutes || 0), 0) / items.length) : 0
            }} />
          ) : (
            <>
              {/* Search Bar */}
              <div className="px-4 sm:px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <AdvancedSearchBar
                  filters={filters}
                  onFiltersChange={setFilters}
                  tags={tags}
                  domains={uniqueDomains}
                />
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {/* View Controls */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {filters.query ? `Search results for "${filters.query}"` : 'Reading List'}
                    </h1>
                    {!networkState.isOnline && (
                      <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 text-sm">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        Offline Mode
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <ColorPicker
                      onColorChange={(scheme) => {
                        // Apply the color scheme dynamically
                        console.log('Applied color scheme:', scheme.name);
                      }}
                    />
                    <SortDropdown
                      sortBy={settings.sortBy}
                      sortDirection={settings.sortDirection}
                      onSortChange={handleSortChange}
                    />
                    <ViewToggle
                      viewMode={settings.viewMode}
                      onViewModeChange={handleViewModeChange}
                    />
                  </div>
                </div>

                {/* Items Grid/List */}
                {filteredItems.length === 0 ? (
                  <EmptyState onAddItem={handleAddItem} isFiltered={isFiltered} />
                ) : (
                  <div className={`
                    ${settings.viewMode === 'grid' 
                      ? 'grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                      : settings.viewMode === 'list' 
                      ? 'space-y-4' 
                      : 'space-y-3'}
                  `}>
                    {filteredItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        viewMode={settings.viewMode}
                        onStatusChange={handleStatusChange}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showForm && (
        <ItemForm
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={() => {
            setShowForm(false);
            setEditingItem(undefined);
          }}
        />
      )}

      {showSettings && (
        <Settings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onUpdateSettings={updateSettings}
          tags={tags}
          collections={collections}
          onDeleteTag={async (id) => {
            await tagStore.deleteTag(id);
            addNotification({
              type: 'success',
              title: 'Tag deleted',
              message: 'The tag has been removed.'
            });
          }}
          onDeleteCollection={async (id) => {
            await collectionStore.deleteCollection(id);
            addNotification({
              type: 'success',
              title: 'Collection deleted',
              message: 'The collection has been removed.'
            });
          }}
          onClearAllData={async () => {
            try {
              // Clear all items, tags, and collections
              const allItems = await itemStore.getItems();
              const allTags = await tagStore.getTags();
              const allCollections = await collectionStore.getCollections();
              
              await Promise.all([
                ...allItems.map(item => itemStore.deleteItem(item.id)),
                ...allTags.map(tag => tagStore.deleteTag(tag.id)),
                ...allCollections.map(collection => collectionStore.deleteCollection(collection.id))
              ]);
              
              addNotification({
                type: 'success',
                title: 'Data cleared',
                message: 'All data has been removed from your reading list.'
              });
            } catch (error) {
              addNotification({
                type: 'error',
                title: 'Clear failed',
                message: 'Failed to clear all data. Please try again.'
              });
            }
          }}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer
        notifications={notifications}
        onDismiss={removeNotification}
      />
    </div>
  );
}

export default App;