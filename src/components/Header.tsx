import { BookOpen, Plus, Download } from 'lucide-react';
import { pwaManager } from '../utils/pwa';
import { ThemeSwitcherButton } from './ThemeSwitcher';

interface HeaderProps {
  onAddItem: () => void;
  onOpenThemeSwitcher: () => void;
}

export function Header({ onAddItem, onOpenThemeSwitcher }: HeaderProps) {
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
    <header className="shadow-sm border-b" 
            style={{ 
              backgroundColor: 'var(--color-surface)', 
              borderColor: 'var(--color-border)' 
            }}>
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-accent)' }}>
              <BookOpen className="text-black" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>ReadingList</h1>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Your personal reading tracker</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcherButton onClick={onOpenThemeSwitcher} />
            
            {showInstallButton && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium hover:bg-modern-accent hover:text-black"
                style={{ color: 'var(--color-accent)' }}
              >
                <Download size={16} />
                Install App
              </button>
            )}
            
            <button
              onClick={onAddItem}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium hover:opacity-80"
              style={{ backgroundColor: 'var(--color-accent)', color: '#000000' }}
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