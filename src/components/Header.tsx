import React from 'react';
import { BookOpen, Plus, Download } from 'lucide-react';
import { pwaManager } from '../utils/pwa';

interface HeaderProps {
  onAddItem: () => void;
}

export function Header({ onAddItem }: HeaderProps) {
  const handleInstall = async () => {
    try {
      const installed = await pwaManager.promptInstall();
      if (installed) {
        console.log('App installed successfully');
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
  };

  const showInstallButton = pwaManager.isInstallable() && (window as any).deferredPrompt;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BookOpen className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ReadingList</h1>
              <p className="text-sm text-gray-500">Your personal reading tracker</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {showInstallButton && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
              >
                <Download size={16} />
                Install App
              </button>
            )}
            
            <button
              onClick={onAddItem}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus size={16} />
              Add Item
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}