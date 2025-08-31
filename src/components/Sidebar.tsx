import { useState } from 'react';
import { 
  Filter, 
  ChevronDown,
  ChevronRight,
  X,
  Settings,
  Download,
  Upload,
  BarChart3,
  Home,
  Moon,
  Sun,
  BookOpen
} from 'lucide-react';
import type { SearchFilters, Tag as TagType, Collection, Priority, ItemStatus } from '../utils/types';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  tags: TagType[];
  collections: Collection[];
  onOpenSettings: () => void;
  onExport: () => void;
  onImport: () => void;
  currentView?: 'dashboard' | 'analytics';
  onViewChange?: (view: 'dashboard' | 'analytics') => void;
  theme?: 'light' | 'dark';
  onThemeToggle?: () => void;
  isOnline?: boolean;
}

export function Sidebar({
  isCollapsed,
  onToggleCollapse,
  filters,
  onFiltersChange,
  tags,
  collections,
  onOpenSettings,
  onExport,
  onImport,
  currentView = 'dashboard',
  onViewChange,
  theme = 'light',
  onThemeToggle,
  isOnline = true
}: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    tags: true,
    status: true,
    priority: true,
    collections: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const clearAllFilters = () => {
    onFiltersChange({
      query: '',
      tags: [],
      status: [],
      priority: [],
      domains: [],
      collections: [],
    });
  };

  const hasActiveFilters = 
    filters.query ||
    filters.tags.length > 0 ||
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.domains.length > 0 ||
    filters.collections.length > 0;

  const statusOptions: { value: ItemStatus; label: string }[] = [
    { value: 'unread', label: 'Unread' },
    { value: 'reading', label: 'Reading' },
    { value: 'completed', label: 'Completed' },
    { value: 'archived', label: 'Archived' }
  ];

  const priorityOptions: { value: Priority; label: string }[] = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  if (isCollapsed) {
    return (
      <div className="w-16 flex flex-col items-center py-6 space-y-4 border-r shadow-sidebar"
           style={{ 
             backgroundColor: 'var(--color-surface)', 
             borderColor: 'var(--color-border)' 
           }}>
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg transition-colors hover:bg-modern-accent hover:text-black"
          style={{ color: 'var(--color-text-secondary)' }}
          title="Expand sidebar"
        >
          <Filter size={20} />
        </button>
        <div className="w-8 h-px" style={{ backgroundColor: 'var(--color-border)' }} />
        <button
          onClick={() => onViewChange?.('dashboard')}
          className={`p-2 rounded-lg transition-colors ${
            currentView === 'dashboard'
              ? 'bg-modern-accent text-black'
              : 'hover:bg-modern-accent hover:text-black'
          }`}
          style={{ color: currentView === 'dashboard' ? '#000' : 'var(--color-text-secondary)' }}
          title="Dashboard"
        >
          <Home size={20} />
        </button>
        <button
          onClick={() => onViewChange?.('analytics')}
          className={`p-2 rounded-lg transition-colors ${
            currentView === 'analytics'
              ? 'bg-modern-accent text-black'
              : 'hover:bg-modern-accent hover:text-black'
          }`}
          style={{ color: currentView === 'analytics' ? '#000' : 'var(--color-text-secondary)' }}
          title="Analytics"
        >
          <BarChart3 size={20} />
        </button>
        <div className="flex-1" />
        <button
          onClick={onThemeToggle}
          className="p-2 rounded-lg transition-colors hover:bg-modern-accent hover:text-black"
          style={{ color: 'var(--color-text-secondary)' }}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg transition-colors hover:bg-modern-accent hover:text-black"
          style={{ color: 'var(--color-text-secondary)' }}
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className={`w-80 border-r flex flex-col h-full transition-all duration-300 shadow-sidebar ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}
         style={{ 
           backgroundColor: 'var(--color-surface)', 
           borderColor: 'var(--color-border)' 
         }}>
      <div className="p-6 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" 
                 style={{ backgroundColor: 'var(--color-accent)' }}>
              <BookOpen size={16} className="text-black" />
            </div>
            <div>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>ReadingList</h1>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Organize & track</p>
            </div>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg transition-colors hover:bg-modern-accent hover:text-black"
            style={{ color: 'var(--color-text-secondary)' }}
            title="Collapse sidebar"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        {/* Navigation */}
        <div className="space-y-1">
          <button
            onClick={() => onViewChange?.('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'dashboard'
                ? 'bg-modern-accent text-black'
                : 'hover:bg-modern-accent hover:text-black'
            }`}
            style={{ color: currentView === 'dashboard' ? '#000' : 'var(--color-text-primary)' }}
          >
            <Home size={18} />
            Reading List
          </button>
          <button
            onClick={() => onViewChange?.('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'analytics'
                ? 'bg-modern-accent text-black'
                : 'hover:bg-modern-accent hover:text-black'
            }`}
            style={{ color: currentView === 'analytics' ? '#000' : 'var(--color-text-primary)' }}
          >
            <BarChart3 size={18} />
            Analytics
          </button>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-sm mt-4 px-3 py-2 rounded-lg transition-colors hover:bg-modern-chart-negative hover:text-white"
            style={{ color: 'var(--color-chart-negative)' }}
          >
            <X size={14} />
            Clear all filters
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex-1 overflow-y-auto px-4">
        {/* Tags Filter */}
        <div className="py-4">
          <button
            onClick={() => toggleSection('tags')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Tags</span>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{tags.length}</span>
              {expandedSections.tags ? <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />}
            </div>
          </button>
          
          {expandedSections.tags && (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {tags.slice(0, 5).map(tag => (
                <label key={tag.id} className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.tags.includes(tag.id)}
                      onChange={(e) => {
                        const newTags = e.target.checked
                          ? [...filters.tags, tag.id]
                          : filters.tags.filter(t => t !== tag.id);
                        onFiltersChange({ ...filters, tags: newTags });
                      }}
                      className="w-4 h-4 rounded focus:ring-2"
                      style={{ 
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        accentColor: 'var(--color-accent)'
                      }}
                    />
                  </div>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color || '#6b7280' }}
                  />
                  <span className="text-sm flex-1 truncate" style={{ color: 'var(--color-text-primary)' }}>{tag.name}</span>
                  <span className="text-xs px-1.5 py-0.5 rounded" 
                        style={{ 
                          color: 'var(--color-text-muted)', 
                          backgroundColor: 'var(--color-bg)' 
                        }}>{tag.usageCount || 0}</span>
                </label>
              ))}
              {tags.length === 0 && (
                <p className="text-sm italic py-2" style={{ color: 'var(--color-text-muted)' }}>No tags yet</p>
              )}
            </div>
          )}
        </div>
        
        {/* Status Filter */}
        <div className="py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => toggleSection('status')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Status</span>
            {expandedSections.status ? <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />}
          </button>
          
          {expandedSections.status && (
            <div className="space-y-2">
              {statusOptions.map(({ value, label }) => {
                const isSelected = filters.status.includes(value);
                const statusColors = {
                  unread: { backgroundColor: '#B0B3B8', color: '#FFFFFF' },
                  reading: { backgroundColor: '#F7CE45', color: '#000000' },
                  completed: { backgroundColor: '#5EDC9A', color: '#000000' },
                  archived: { backgroundColor: '#8B5CF6', color: '#FFFFFF' }
                };
                
                return (
                  <label key={value} className="flex items-center gap-3 cursor-pointer group py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const newStatus = e.target.checked
                          ? [...filters.status, value]
                          : filters.status.filter(s => s !== value);
                        onFiltersChange({ ...filters, status: newStatus });
                      }}
                      className="w-4 h-4 rounded focus:ring-2"
                      style={{ 
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        accentColor: 'var(--color-accent)'
                      }}
                    />
                    <div className="px-2 py-1 rounded-md text-xs font-medium flex-1"
                         style={statusColors[value]}>
                      {label}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Priority Filter */}
        <div className="py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => toggleSection('priority')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Priority</span>
            {expandedSections.priority ? <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />}
          </button>
          
          {expandedSections.priority && (
            <div className="space-y-2">
              {priorityOptions.map(({ value, label }) => {
                const isSelected = filters.priority.includes(value);
                const priorityColors = {
                  low: { backgroundColor: '#5EDC9A', color: '#000000' },
                  medium: { backgroundColor: '#F7CE45', color: '#000000' },
                  high: { backgroundColor: '#F97316', color: '#FFFFFF' },
                  urgent: { backgroundColor: '#E6506E', color: '#FFFFFF' }
                };
                
                return (
                  <label key={value} className="flex items-center gap-3 cursor-pointer group py-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const newPriority = e.target.checked
                          ? [...filters.priority, value]
                          : filters.priority.filter(p => p !== value);
                        onFiltersChange({ ...filters, priority: newPriority });
                      }}
                      className="w-4 h-4 rounded focus:ring-2"
                      style={{ 
                        borderColor: 'var(--color-border)',
                        backgroundColor: 'var(--color-surface)',
                        accentColor: 'var(--color-accent)'
                      }}
                    />
                    <div className="px-2 py-1 rounded-md text-xs font-medium flex-1"
                         style={priorityColors[value]}>
                      {label}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Collections Filter */}
        <div className="py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => toggleSection('collections')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Collections</span>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{collections.length}</span>
              {expandedSections.collections ? <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} /> : <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />}
            </div>
          </button>
          
          {expandedSections.collections && (
            <div className="space-y-2">
              {collections.map(collection => (
                <label key={collection.id} className="flex items-center gap-3 cursor-pointer group py-1">
                  <input
                    type="checkbox"
                    checked={filters.collections.includes(collection.id)}
                    onChange={(e) => {
                      const newCollections = e.target.checked
                        ? [...filters.collections, collection.id]
                        : filters.collections.filter(c => c !== collection.id);
                      onFiltersChange({ ...filters, collections: newCollections });
                    }}
                    className="w-4 h-4 rounded focus:ring-2"
                    style={{ 
                      borderColor: 'var(--color-border)',
                      backgroundColor: 'var(--color-surface)',
                      accentColor: 'var(--color-accent)'
                    }}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    {collection.icon && <span className="text-sm">{collection.icon}</span>}
                    <span className="text-sm truncate" style={{ color: 'var(--color-text-primary)' }}>{collection.name}</span>
                    {collection.isSystem && (
                      <span className="text-xs px-1.5 py-0.5 rounded" 
                            style={{ 
                              backgroundColor: 'var(--color-accent)', 
                              color: '#000000' 
                            }}>Auto</span>
                    )}
                  </div>
                </label>
              ))}
              {collections.length === 0 && (
                <p className="text-sm italic py-2" style={{ color: 'var(--color-text-muted)' }}>No collections yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t space-y-1" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--color-text-muted)' }}>Actions</span>
          <button
            onClick={onThemeToggle}
            className="p-1.5 rounded-lg transition-colors hover:bg-modern-accent hover:text-black"
            style={{ color: 'var(--color-text-secondary)' }}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
        <button
          onClick={onExport}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors hover:bg-modern-accent hover:text-black"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <Download size={16} />
          Export Data
        </button>
        <button
          onClick={onImport}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors hover:bg-modern-accent hover:text-black"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <Upload size={16} />
          Import Data
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors hover:bg-modern-accent hover:text-black"
          style={{ color: 'var(--color-text-primary)' }}
        >
          <Settings size={16} />
          Settings
        </button>
      </div>
    </div>
  );
}
