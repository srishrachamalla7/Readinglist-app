# ReadingList - Comprehensive Personal Reading Manager

A fully-featured Progressive Web App (PWA) for managing your personal reading list with advanced search, tagging, offline support, and platform-specific enhancements.

## ✨ Features

### Core Functionality
- **📚 Item Management**: Add, edit, delete reading items with rich metadata
- **🏷️ Advanced Tagging**: Color-coded tags with comprehensive management
- **📁 Smart Collections**: Organize items with rule-based collections
- **🔍 Powerful Search**: Real-time search with advanced filters
- **📊 Statistics Dashboard**: Track reading progress and habits

### Metadata & Reading Experience
- **🌐 Automatic Metadata Fetching**: Extracts title, description, favicon from URLs
- **⏱️ Reading Time Estimation**: Word count and estimated reading time
- **📱 Multiple View Modes**: Grid, list, and compact layouts
- **🎨 Theme Support**: Light, dark, and system themes

### Data Management
- **💾 Import/Export**: JSON and CSV backup/restore functionality
- **🔄 Offline Support**: Full offline functionality with sync
- **📱 PWA Features**: Install as native app, background sync
- **🌐 Network Status**: Visual indicators and queue management

### Performance & UX
- **⚡ Virtual Scrolling**: Optimized for large lists
- **🎯 Error Boundaries**: Comprehensive error handling
- **⌨️ Keyboard Shortcuts**: Power user features
- **📱 Platform-Specific**: Windows and Android optimizations

### Settings & Customization
- **⚙️ Comprehensive Settings**: Theme, view preferences, behavior
- **🎨 Tag Management**: Create, edit, delete tags with colors
- **📊 Storage Management**: Monitor and manage data usage
- **🗑️ Data Cleanup**: Clear all data functionality

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd ReadingList

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Dexie.js (IndexedDB wrapper)
- **PWA**: Workbox for service worker management
- **Icons**: Lucide React
- **Performance**: React Window for virtualization

### Project Structure
```
src/
├── components/          # React components
│   ├── AdvancedSearchBar.tsx
│   ├── EmptyState.tsx
│   ├── ErrorBoundary.tsx
│   ├── Header.tsx
│   ├── ItemCard.tsx
│   ├── ItemForm.tsx
│   ├── Settings.tsx
│   ├── Sidebar.tsx
│   ├── StatsCards.tsx
│   ├── TagManager.tsx
│   ├── Toast.tsx
│   ├── ViewToggle.tsx
│   ├── SortDropdown.tsx
│   └── VirtualizedItemList.tsx
├── hooks/               # Custom React hooks
│   ├── useCollections.ts
│   ├── useItems.ts
│   ├── useSettings.ts
│   └── useTags.ts
├── stores/              # Dexie database stores
│   ├── collectionStore.ts
│   ├── itemStore.ts
│   ├── settingsStore.ts
│   └── tagStore.ts
├── utils/               # Utility modules
│   ├── database.ts
│   ├── exportImport.ts
│   ├── keyboardShortcuts.ts
│   ├── metadataFetcher.ts
│   ├── networkStatus.ts
│   ├── platform.ts
│   ├── pwa.ts
│   └── types.ts
└── App.tsx             # Main application component
```

## 📱 PWA Features

### Installation
- Install as native app on Windows, Android, iOS
- Offline functionality with background sync
- App shortcuts and jump lists (Windows)
- Share target support (Android)

### Service Worker
- Caches app shell and assets
- Background metadata fetching
- Offline fallback pages
- Update notifications

## ⌨️ Keyboard Shortcuts

- **`/`** - Focus search
- **`Ctrl+N`** - Add new item
- **`Escape`** - Close modals/dialogs

## 🎨 Theming

Supports three theme modes:
- **Light**: Clean, bright interface
- **Dark**: Easy on the eyes for night reading
- **System**: Follows OS preference

## 📊 Data Management

### Storage
- Uses IndexedDB for local storage
- Automatic backup suggestions
- Storage usage monitoring
- Data export in multiple formats

### Import/Export
- **JSON**: Full backup with all data
- **CSV**: Spreadsheet-compatible format
- **Duplicate handling**: Smart merge on import

## 🔧 Platform Features

### Windows
- Title bar customization (Windows 11)
- App badge for unread count
- Jump list integration
- Native-like experience

### Android
- Share target support
- Dynamic shortcuts
- Back button handling
- Orientation support

## 🛠️ Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables
No environment variables required for basic functionality.

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For issues and feature requests, please use the GitHub issue tracker.

---

Built with ❤️ using React, TypeScript, and modern web technologies.
