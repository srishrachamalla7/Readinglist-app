import { useState } from 'react';
import { Palette, Check } from 'lucide-react';

interface ColorScheme {
  name: string;
  primary: string;
  sidebar: string;
  background: string;
  surface: string;
  border: string;
  accent: string;
}

const colorSchemes: ColorScheme[] = [
  {
    name: 'Blue Gray (Reference)',
    primary: '#64748b',
    sidebar: '#64748b',
    background: '#f1f5f9',
    surface: '#ffffff',
    border: '#e2e8f0',
    accent: '#f97316'
  },
  {
    name: 'Ocean Blue',
    primary: '#0ea5e9',
    sidebar: '#0284c7',
    background: '#f0f9ff',
    surface: '#ffffff',
    border: '#bae6fd',
    accent: '#f59e0b'
  },
  {
    name: 'Forest Green',
    primary: '#059669',
    sidebar: '#047857',
    background: '#f0fdf4',
    surface: '#ffffff',
    border: '#bbf7d0',
    accent: '#dc2626'
  },
  {
    name: 'Purple Haze',
    primary: '#7c3aed',
    sidebar: '#6d28d9',
    background: '#faf5ff',
    surface: '#ffffff',
    border: '#ddd6fe',
    accent: '#f59e0b'
  },
  {
    name: 'Warm Orange',
    primary: '#ea580c',
    sidebar: '#c2410c',
    background: '#fff7ed',
    surface: '#ffffff',
    border: '#fed7aa',
    accent: '#059669'
  },
  {
    name: 'Rose Pink',
    primary: '#e11d48',
    sidebar: '#be123c',
    background: '#fff1f2',
    surface: '#ffffff',
    border: '#fecdd3',
    accent: '#059669'
  },
  {
    name: 'Space Cadet',
    primary: '#16274B',
    sidebar: '#305459',
    background: '#F2E1B8',
    surface: '#ffffff',
    border: '#643743',
    accent: '#EB7200'
  },
  {
    name: 'Onyx',
    primary: '#32373B',     // Onyx - dark sidebar / main text
    sidebar: '#32373B',     // Keep sidebar dark gray (like dashboard)
    background: '#FFFFFF',  // Clean white background for main area
    surface: '#F4D6CC',     // Pale Dogwood - subtle card background
    border: '#E0E0E0',      // Neutral light gray borders
    accent: '#F4B860'       // Hunyadi Yellow - highlight color
  },
  {
    name: 'Black & Yellow',
    primary: '#2D2A32',     // Raisin Black - dark sidebar & text
    sidebar: '#2D2A32',     // Sidebar stays deep black
    background: '#FAFDF6',  // Baby Powder - clean near-white background
    surface: '#EEefa8',     // Vanilla - soft yellow cards/surfaces
    border: '#EAE151',      // Maize - brighter yellow for borders/dividers
    accent: '#DDD92A'       // Citrine - bold highlight/accent
  },
  {
    name: 'Black & Yellow - Clean',
    primary: '#2D2A32',     // Raisin Black - dark sidebar/text
    sidebar: '#2D2A32',     // Sidebar stays dark
    background: '#FAFDF6',  // Baby Powder - clean near-white
    surface: '#FFFFFF',     // White cards/panels
    border: '#EAE151',      // Maize - yellowish border
    accent: '#DDD92A'       // Citrine - bold highlight
  },
  {
    name: 'Black & Yellow - Warm',
    primary: '#2D2A32',
    sidebar: '#2D2A32',
    background: '#EEefa8',  // Vanilla - soft yellow base
    surface: '#FAFDF6',     // Baby Powder - cards slightly lighter
    border: '#DDD92A',      // Citrine - borders
    accent: '#EAE151'       // Maize - highlight
  },
  {
    name: 'Black & Yellow - Bold',
    primary: '#2D2A32',
    sidebar: '#2D2A32',
    background: '#FAFDF6',  // Baby Powder - neutral background
    surface: '#DDD92A',     // Citrine - yellow panels/cards
    border: '#2D2A32',      // Dark borders for balance
    accent: '#EAE151'       // Maize - softer accent
  },
  { name: 'Clean Contrast', primary: '#2D2A32', sidebar: '#2D2A32', background: '#FFFFFF', surface: '#FAFDF6', border: '#EAE151', accent: '#DDD92A' },
  { name: 'Midnight Sun', primary: '#2D2A32', sidebar: '#2D2A32', background: '#FFFFFF', surface: '#FFFFFF', border: '#DDD92A', accent: '#EAE151' },
  { name: 'Graphite Highlight', primary: '#2D2A32', sidebar: '#2D2A32', background: '#F4F4F4', surface: '#FAFDF6', border: '#DDD92A', accent: '#EAE151' },
  { name: 'Soft & Sleek', primary: '#2D2A32', sidebar: '#2D2A32', background: '#EEEEEE', surface: '#FAFDF6', border: '#EAE151', accent: '#DDD92A' },
  { name: 'Pure & Punchy', primary: '#2D2A32', sidebar: '#2D2A32', background: '#FFFFFF', surface: '#FFFFFF', border: '#EAE151', accent: '#DDD92A' },
  { name: 'Vanilla Warm', primary: '#2D2A32', sidebar: '#2D2A32', background: '#EEefa8', surface: '#FAFDF6', border: '#DDD92A', accent: '#EAE151' },
  { name: 'Golden Glow', primary: '#2D2A32', sidebar: '#2D2A32', background: '#EEefa8', surface: '#EEefa8', border: '#EAE151', accent: '#DDD92A' },
  { name: 'Soft Sunrise', primary: '#2D2A32', sidebar: '#2D2A32', background: '#F4DFA0', surface: '#FAFDF6', border: '#EAE151', accent: '#DDD92A' },
  { name: 'Cream & Brass', primary: '#2D2A32', sidebar: '#2D2A32', background: '#FCFBEA', surface: '#EEefa8', border: '#DDD92A', accent: '#EAE151' },
  { name: 'Warm Accent', primary: '#2D2A32', sidebar: '#2D2A32', background: '#FAFDF6', surface: '#EEefa8', border: '#DDD92A', accent: '#EAE151' },
  { name: 'Citrine Bold', primary: '#2D2A32', sidebar: '#2D2A32', background: '#FAFDF6', surface: '#DDD92A', border: '#2D2A32', accent: '#EAE151' },
  { name: 'Strong Yellow', primary: '#2D2A32', sidebar: '#2D2A32', background: '#FFFFFF', surface: '#DDD92A', border: '#2D2A32', accent: '#EAE151' },
  { name: 'Inverted Accent', primary: '#EAE151', sidebar: '#2D2A32', background: '#FFFFFF', surface: '#FAFDF6', border: '#2D2A32', accent: '#DDD92A' },
  { name: 'Bright Cards', primary: '#FAFDF6', sidebar: '#2D2A32', background: '#2D2A32', surface: '#DDD92A', border: '#EAE151', accent: '#FFFFFF' },
  { name: 'Yellow Blocks', primary: '#2D2A32', sidebar: '#F4F4F4', background: '#FAFDF6', surface: '#DDD92A', border: '#2D2A32', accent: '#EAE151' },
  { name: 'Muted Yellow', primary: '#2D2A32', sidebar: '#2D2A32', background: '#FFFFFF', surface: '#DDD92A', border: '#EAE151', accent: '#EAE151' },
  { name: 'Minimal Yellow', primary: '#2D2A32', sidebar: '#2D2A32', background: '#F4F4F4', surface: '#FFFFFF', border: '#DDD92A', accent: '#EAE151' },
  { name: 'Gray Base', primary: '#2D2A32', sidebar: '#2D2A32', background: '#EEEEEE', surface: '#FFFFFF', border: '#EAE151', accent: '#DDD92A' },
  { name: 'Pale Fill', primary: '#2D2A32', sidebar: '#2D2A32', background: '#FAFDF6', surface: '#EEefa8', border: '#FAFDF6', accent: '#EAE151' },
  { name: 'Off-White Warm', primary: '#2D2A32', sidebar: '#2D2A32', background: '#FCFBEA', surface: '#FFFFFF', border: '#EEE8C5', accent: '#EAE151' },
  { name: 'Gentle Highlight', primary: '#2D2A32', sidebar: '#2D2A32', background: '#FAFDF6', surface: '#FFFFFF', border: '#F4F0C2', accent: '#DDD92A' },
  { name: 'Soft Cream', primary: '#2D2A32', sidebar: '#2D2A32', background: '#F4F4F4', surface: '#FFFFFF', border: '#EAE151', accent: '#EAE151' },
  {
    name: 'Dark Yellow Dashboard',
    primary: '#16171B',    // background
    sidebar: '#282C2F',    // sidebar & cards
    background: '#16171B', // main app background
    surface: '#282C2F',    // panels, secondary areas
    border: '#33363A',     // subtle dividers
    accent: '#F7CE45'      // highlight, hover, CTAs
  }
  

];

interface ColorPickerProps {
  onColorChange: (scheme: ColorScheme) => void;
  currentScheme?: string;
}

export function ColorPicker({ onColorChange, currentScheme = 'Blue Gray (Reference)' }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(currentScheme);

  const handleSchemeSelect = (scheme: ColorScheme) => {
    setSelectedScheme(scheme.name);
    onColorChange(scheme);
    
    // Apply CSS custom properties for immediate visual feedback
    const root = document.documentElement;
    root.style.setProperty('--color-primary', scheme.primary);
    root.style.setProperty('--color-sidebar', scheme.sidebar);
    root.style.setProperty('--color-background', scheme.background);
    root.style.setProperty('--color-surface', scheme.surface);
    root.style.setProperty('--color-border', scheme.border);
    root.style.setProperty('--color-accent', scheme.accent);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <Palette size={16} />
        <span className="text-sm font-medium">Color Theme</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">Choose Color Theme</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Select a color scheme to customize your reading list
            </p>
          </div>
          
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {colorSchemes.map((scheme) => (
              <button
                key={scheme.name}
                onClick={() => handleSchemeSelect(scheme)}
                className={`w-full p-3 rounded-lg border-2 transition-all hover:scale-[1.02] ${
                  selectedScheme === scheme.name
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    {scheme.name}
                  </span>
                  {selectedScheme === scheme.name && (
                    <Check size={16} className="text-blue-500" />
                  )}
                </div>
                
                <div className="flex gap-2 mb-2">
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: scheme.primary }}
                    title="Primary"
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: scheme.sidebar }}
                    title="Sidebar"
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: scheme.background }}
                    title="Background"
                  />
                  <div 
                    className="w-6 h-6 rounded-full border border-gray-200"
                    style={{ backgroundColor: scheme.accent }}
                    title="Accent"
                  />
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400 text-left">
                  Primary: {scheme.primary} • Accent: {scheme.accent}
                </div>
              </button>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
