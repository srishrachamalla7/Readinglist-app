import React, { useState } from 'react';
import { 
  Filter, 
  Tag, 
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
      <div className="w-16 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col items-center py-6 space-y-4">
        <button
          onClick={onToggleCollapse}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Expand sidebar"
        >
          <Filter size={20} />
        </button>
        <div className="w-8 h-px bg-gray-200 dark:bg-gray-700" />
        <button
          onClick={() => onViewChange?.('dashboard')}
          className={`p-2 rounded-lg transition-colors ${
            currentView === 'dashboard'
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Dashboard"
        >
          <Home size={20} />
        </button>
        <button
          onClick={() => onViewChange?.('analytics')}
          className={`p-2 rounded-lg transition-colors ${
            currentView === 'analytics'
              ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title="Analytics"
        >
          <BarChart3 size={20} />
        </button>
        <div className="flex-1" />
        <button
          onClick={onThemeToggle}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        <button
          onClick={onOpenSettings}
          className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className={`w-80 dynamic-sidebar border-r dynamic-border flex flex-col h-full transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <BookOpen size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">ReadingList</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Organize & track</p>
            </div>
          </div>
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
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
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Home size={18} />
            Reading List
          </button>
          <button
            onClick={() => onViewChange?.('analytics')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              currentView === 'analytics'
                ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <BarChart3 size={18} />
            Analytics
          </button>
        </div>
        
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 mt-4 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
            <span className="text-sm font-medium text-gray-900 dark:text-white">Tags</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{tags.length}</span>
              {expandedSections.tags ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
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
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-800"
                    />
                  </div>
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tag.color || '#6b7280' }}
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300 flex-1 truncate">{tag.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">{tag.usageCount || 0}</span>
                </label>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic py-2">No tags yet</p>
              )}
            </div>
          )}
        </div>
        
        {/* Status Filter */}
        <div className="py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => toggleSection('status')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-white">Status</span>
            {expandedSections.status ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
          </button>
          
          {expandedSections.status && (
            <div className="space-y-2">
              {statusOptions.map(({ value, label }) => {
                const isSelected = filters.status.includes(value);
                const statusColors = {
                  unread: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                  reading: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                  completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
                  archived: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
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
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-800"
                    />
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${statusColors[value]} flex-1`}>
                      {label}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Priority Filter */}
        <div className="py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => toggleSection('priority')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-white">Priority</span>
            {expandedSections.priority ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
          </button>
          
          {expandedSections.priority && (
            <div className="space-y-2">
              {priorityOptions.map(({ value, label }) => {
                const isSelected = filters.priority.includes(value);
                const priorityColors = {
                  low: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                  medium: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
                  high: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
                  urgent: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
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
                      className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-800"
                    />
                    <div className={`px-2 py-1 rounded-md text-xs font-medium ${priorityColors[value]} flex-1`}>
                      {label}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Collections Filter */}
        <div className="py-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => toggleSection('collections')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <span className="text-sm font-medium text-gray-900 dark:text-white">Collections</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{collections.length}</span>
              {expandedSections.collections ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
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
                    className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500 dark:bg-gray-800"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    {collection.icon && <span className="text-sm">{collection.icon}</span>}
                    <span className="text-sm text-gray-700 dark:text-gray-300 truncate">{collection.name}</span>
                    {collection.isSystem && (
                      <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded">Auto</span>
                    )}
                  </div>
                </label>
              ))}
              {collections.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic py-2">No collections yet</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Actions</span>
          <button
            onClick={onThemeToggle}
            className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>
        </div>
        <button
          onClick={onExport}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Download size={16} />
          Export Data
        </button>
        <button
          onClick={onImport}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Upload size={16} />
          Import Data
        </button>
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Settings size={16} />
          Settings
        </button>
      </div>
    </div>
  );
}
