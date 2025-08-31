import React from 'react';
import { Grid3X3, List, Rows3 } from 'lucide-react';
import type { ViewMode } from '../utils/types';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const viewModes: { mode: ViewMode; icon: React.ComponentType; label: string }[] = [
  { mode: 'grid', icon: Grid3X3, label: 'Grid' },
  { mode: 'list', icon: List, label: 'List' },
  { mode: 'compact', icon: Rows3, label: 'Compact' }
];

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {viewModes.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => onViewModeChange(mode)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${viewMode === mode
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            }
          `}
          title={label}
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
