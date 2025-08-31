export type ItemStatus = 'unread' | 'reading' | 'completed' | 'archived';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Theme = 'light' | 'dark' | 'system';
export type ViewMode = 'grid' | 'list' | 'compact';
export type SortOption = 'dateAdded' | 'priority' | 'readingTime' | 'title' | 'domain';
export type SortDirection = 'asc' | 'desc';

export interface Item {
  id: string;
  url: string;
  title: string;
  description?: string;
  domain: string;
  favicon?: string;
  tags: string[];
  priority: Priority;
  status: ItemStatus;
  estMinutes?: number;
  wordCount?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  lastOpenedAt?: Date;
  metadataFetched: boolean;
  isOfflineQueued?: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt: Date;
  usageCount: number;
  parent?: string; // For tag hierarchy
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  rules: CollectionRule[];
  createdAt: Date;
  isSystem: boolean; // For built-in collections like "Today", "This Week"
  icon?: string;
}

export interface CollectionRule {
  field: keyof Item | 'createdAt' | 'updatedAt';
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'in' | 'between';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface Settings {
  // Appearance
  theme: Theme;

  // List/view options
  viewMode: ViewMode;
  sortBy: SortOption;
  sortDirection: SortDirection;
  sidebarCollapsed: boolean;
  itemsPerPage: number;

  // Reading features
  showReadingTime: boolean;
  readingSpeed: number; // words per minute

  // UX preferences
  autoFetchMetadata: boolean; // primary flag used in app
  confirmDelete: boolean;

  // Back-compat/interop (optional; used by import code and legacy areas)
  defaultPriority?: Priority;
  autoFetch?: boolean;
  lastBackupDate?: Date;
}

export interface ItemStats {
  total: number;
  unread: number;
  reading: number;
  completed: number;
  archived: number;
  byPriority: Record<Priority, number>;
  byDomain: Record<string, number>;
  totalReadingTime: number;
  averageReadingTime: number;
  completedThisWeek: number;
  completedThisMonth: number;
}

export interface SearchFilters {
  query: string;
  tags: string[];
  status: ItemStatus[];
  priority: Priority[];
  domains: string[];
  collections: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  readingTimeRange?: {
    min: number;
    max: number;
  };
}

export interface NetworkStatus {
  isOnline: boolean;
  lastOnline?: Date;
  pendingOperations: number;
}

export interface BackupData {
  version: string;
  exportDate: Date;
  items: Item[];
  tags: Tag[];
  collections: Collection[];
  settings: Settings;
}

export interface MetadataFetchResult {
  title?: string;
  description?: string;
  favicon?: string;
  wordCount?: number;
  estMinutes?: number;
  success: boolean;
  error?: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  description: string;
  action: () => void;
}