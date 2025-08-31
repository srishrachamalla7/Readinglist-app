import { useState, useEffect } from 'react';
import { Palette, Check, Sun, Moon } from 'lucide-react';

interface Theme {
  id: string;
  name: string;
  description: string;
  isDark: boolean;
  preview: {
    bg: string;
    surface: string;
    accent: string;
    text: string;
  };
}

const themes: Theme[] = [
  {
    id: 'modern',
    name: 'Modern Dashboard',
    description: 'Sleek & professional dark theme',
    isDark: true,
    preview: {
      bg: '#16171B',
      surface: '#282C2F',
      accent: '#F7CE45',
      text: '#FFFFFF'
    }
  },
  {
    id: 'notion',
    name: 'Notion Style',
    description: 'Minimal & neutral light theme',
    isDark: false,
    preview: {
      bg: '#FFFFFF',
      surface: '#F7F6F3',
      accent: '#2383E2',
      text: '#2F3437'
    }
  },
  {
    id: 'notion-dark',
    name: 'Notion Dark',
    description: 'Minimal & neutral dark theme',
    isDark: true,
    preview: {
      bg: '#191919',
      surface: '#2F3437',
      accent: '#5B9BD5',
      text: '#FFFFFF'
    }
  },
  {
    id: 'pocket',
    name: 'Pocket Style',
    description: 'Warm & reading-focused light theme',
    isDark: false,
    preview: {
      bg: '#FEFEFE',
      surface: '#F8F8F8',
      accent: '#EF4056',
      text: '#333333'
    }
  },
  {
    id: 'pocket-dark',
    name: 'Pocket Dark',
    description: 'Warm & reading-focused dark theme',
    isDark: true,
    preview: {
      bg: '#1A1A1A',
      surface: '#2D2D2D',
      accent: '#FF5A6E',
      text: '#FFFFFF'
    }
  },
  {
    id: 'goodreads',
    name: 'Goodreads Style',
    description: 'Book-centric & rustic light theme',
    isDark: false,
    preview: {
      bg: '#F4F1EA',
      surface: '#FFFFFF',
      accent: '#00635D',
      text: '#382110'
    }
  },
  {
    id: 'goodreads-dark',
    name: 'Goodreads Dark',
    description: 'Book-centric & rustic dark theme',
    isDark: true,
    preview: {
      bg: '#1C1611',
      surface: '#2A2318',
      accent: '#4A9B8E',
      text: '#F4F1EA'
    }
  },
  {
    id: 'startup',
    name: 'Playful Startup',
    description: 'Bright & energetic light theme',
    isDark: false,
    preview: {
      bg: '#FAFBFF',
      surface: '#FFFFFF',
      accent: '#667EEA',
      text: '#1A1D29'
    }
  },
  {
    id: 'startup-dark',
    name: 'Startup Dark',
    description: 'Bright & energetic dark theme',
    isDark: true,
    preview: {
      bg: '#0D1117',
      surface: '#161B22',
      accent: '#58A6FF',
      text: '#F0F6FC'
    }
  }
];

interface ThemeSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ThemeSwitcher({ isOpen, onClose }: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState('modern');

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('readinglist-theme') || 'modern';
    setCurrentTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (themeId: string) => {
    const body = document.body;
    
    // Remove all existing theme attributes
    themes.forEach(theme => {
      body.removeAttribute(`data-theme`);
    });

    // Apply new theme
    if (themeId !== 'modern') {
      body.setAttribute('data-theme', themeId);
    }

    // Save to localStorage
    localStorage.setItem('readinglist-theme', themeId);
    setCurrentTheme(themeId);
  };

  const handleThemeChange = (themeId: string) => {
    applyTheme(themeId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" 
         style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
         onClick={onClose}>
      <div className="rounded-2xl shadow-modal w-full max-w-4xl max-h-[90vh] overflow-y-auto"
           style={{ backgroundColor: 'var(--color-modal)' }}
           onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" 
             style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'var(--color-accent)' }}>
              <Palette size={20} className="text-black" />
            </div>
            <div>
              <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                Choose Your Theme
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                Select a visual style that matches your preference
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: 'var(--color-surface)', 
              color: 'var(--color-text-muted)' 
            }}
          >
            ✕
          </button>
        </div>

        {/* Theme Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((themeOption) => (
              <button
                key={themeOption.id}
                onClick={() => handleThemeChange(themeOption.id)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                  currentTheme === themeOption.id 
                    ? 'ring-2 ring-offset-2' 
                    : 'hover:shadow-lg'
                }`}
                style={{
                  backgroundColor: themeOption.preview.surface,
                  borderColor: currentTheme === themeOption.id ? themeOption.preview.accent : 'var(--color-border)',
                  '--tw-ring-color': themeOption.preview.accent,
                  '--tw-ring-offset-color': themeOption.preview.bg
                } as React.CSSProperties}
              >
                {/* Theme Preview */}
                <div className="mb-3">
                  <div 
                    className="w-full h-16 rounded-lg mb-2 relative overflow-hidden"
                    style={{ backgroundColor: themeOption.preview.bg }}
                  >
                    {/* Mini sidebar */}
                    <div 
                      className="absolute left-0 top-0 w-4 h-full"
                      style={{ backgroundColor: themeOption.preview.surface }}
                    />
                    {/* Mini cards */}
                    <div className="absolute right-2 top-2 space-y-1">
                      <div 
                        className="w-8 h-2 rounded"
                        style={{ backgroundColor: themeOption.preview.surface }}
                      />
                      <div 
                        className="w-6 h-2 rounded"
                        style={{ backgroundColor: themeOption.preview.surface }}
                      />
                    </div>
                    {/* Accent dot */}
                    <div 
                      className="absolute bottom-2 right-2 w-2 h-2 rounded-full"
                      style={{ backgroundColor: themeOption.preview.accent }}
                    />
                  </div>
                </div>

                {/* Theme Info */}
                <div className="text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-sm" style={{ color: themeOption.preview.text }}>
                      {themeOption.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {themeOption.isDark ? (
                        <Moon size={12} style={{ color: themeOption.preview.text }} />
                      ) : (
                        <Sun size={12} style={{ color: themeOption.preview.text }} />
                      )}
                      {currentTheme === themeOption.id && (
                        <Check size={12} style={{ color: themeOption.preview.accent }} />
                      )}
                    </div>
                  </div>
                  <p className="text-xs opacity-75" style={{ color: themeOption.preview.text }}>
                    {themeOption.description}
                  </p>
                </div>

                {/* Color Palette Preview */}
                <div className="flex gap-1 mt-3">
                  <div 
                    className="w-3 h-3 rounded-full border"
                    style={{ 
                      backgroundColor: themeOption.preview.bg,
                      borderColor: themeOption.preview.text + '20'
                    }}
                    title="Background"
                  />
                  <div 
                    className="w-3 h-3 rounded-full border"
                    style={{ 
                      backgroundColor: themeOption.preview.surface,
                      borderColor: themeOption.preview.text + '20'
                    }}
                    title="Surface"
                  />
                  <div 
                    className="w-3 h-3 rounded-full border"
                    style={{ 
                      backgroundColor: themeOption.preview.accent,
                      borderColor: themeOption.preview.text + '20'
                    }}
                    title="Accent"
                  />
                  <div 
                    className="w-3 h-3 rounded-full border"
                    style={{ 
                      backgroundColor: themeOption.preview.text,
                      borderColor: themeOption.preview.text + '20'
                    }}
                    title="Text"
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t text-center" 
               style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Your theme preference will be saved automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Theme Switcher Button Component
interface ThemeSwitcherButtonProps {
  onClick: () => void;
}

export function ThemeSwitcherButton({ onClick }: ThemeSwitcherButtonProps) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg transition-colors hover:opacity-80"
      style={{ 
        backgroundColor: 'var(--color-surface)', 
        color: 'var(--color-text-secondary)' 
      }}
      title="Change Theme"
    >
      <Palette size={16} />
    </button>
  );
}
