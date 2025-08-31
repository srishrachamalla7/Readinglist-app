import { Bookmark, MoreHorizontal, Clock } from 'lucide-react';
import type { Item, ViewMode } from '../utils/types';
import { getFaviconUrl } from '../utils/urlUtils';

interface ItemCardProps {
  item: Item;
  viewMode?: ViewMode;
  onStatusChange: (id: string, status: Item['status']) => void;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  unread: { 
    label: 'Unread', 
    style: { backgroundColor: '#B0B3B8', color: '#FFFFFF' },
    dotColor: '#B0B3B8'
  },
  reading: { 
    label: 'Reading', 
    style: { backgroundColor: '#F7CE45', color: '#000000' },
    dotColor: '#F7CE45'
  },
  completed: { 
    label: 'Completed', 
    style: { backgroundColor: '#5EDC9A', color: '#000000' },
    dotColor: '#5EDC9A'
  },
  archived: { 
    label: 'Archived', 
    style: { backgroundColor: '#8B5CF6', color: '#FFFFFF' },
    dotColor: '#8B5CF6'
  },
};

const priorityConfig = {
  low: { 
    label: 'Low', 
    dots: [{ active: true, color: '#5EDC9A' }, { active: false, color: 'var(--color-border)' }, { active: false, color: 'var(--color-border)' }]
  },
  medium: { 
    label: 'Medium', 
    dots: [{ active: true, color: '#F7CE45' }, { active: true, color: '#F7CE45' }, { active: false, color: 'var(--color-border)' }]
  },
  high: { 
    label: 'High', 
    dots: [{ active: true, color: '#F97316' }, { active: true, color: '#F97316' }, { active: true, color: '#F97316' }]
  },
  urgent: { 
    label: 'Urgent', 
    dots: [{ active: true, color: '#E6506E' }, { active: true, color: '#E6506E' }, { active: true, color: '#E6506E' }]
  },
};

export function ItemCard({ item, onStatusChange, onEdit }: ItemCardProps) {
  const config = statusConfig[item.status];
  const priorityConf = priorityConfig[item.priority];

  const handleOpenUrl = () => {
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  const handleStatusClick = () => {
    const statuses: Item['status'][] = ['unread', 'reading', 'completed', 'archived'];
    const currentIndex = statuses.indexOf(item.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    onStatusChange(item.id, nextStatus);
  };

  return (
    <div className="rounded-2xl shadow-card border p-5 hover:shadow-card-hover hover:scale-[1.02] transition-all duration-200 group relative overflow-hidden"
         style={{ 
           backgroundColor: 'var(--color-surface)', 
           borderColor: 'var(--color-border)' 
         }}>
      {/* Header with bookmark and menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden border"
               style={{ 
                 backgroundColor: 'var(--color-bg)', 
                 borderColor: 'var(--color-border)' 
               }}>
            <img 
              src={getFaviconUrl(item.domain)} 
              alt={`${item.domain} favicon`}
              className="w-6 h-6"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 line-clamp-2 transition-colors cursor-pointer leading-tight group-hover:opacity-80"
                style={{ color: 'var(--color-text-primary)' }}
                onClick={handleOpenUrl}>
              {item.title}
            </h3>
            <div className="text-sm truncate" style={{ color: 'var(--color-text-secondary)' }}>{item.domain}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded-lg transition-all hover:bg-modern-accent hover:text-black"
            style={{ color: 'var(--color-text-muted)' }}
            title="Bookmark"
          >
            <Bookmark size={16} />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 rounded-lg transition-all hover:bg-modern-accent hover:text-black"
            style={{ color: 'var(--color-text-muted)' }}
            title="More options"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      
      {/* Description */}
      {item.description && (
        <p className="text-sm line-clamp-2 mb-4 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
          {item.description}
        </p>
      )}

      {/* Footer with status, priority, and reading time */}
      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.dotColor }}></div>
          
          {/* Priority dots */}
          <div className="flex items-center gap-1">
            {priorityConf.dots.map((dot, index) => (
              <div 
                key={index}
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: dot.color }}
              />
            ))}
          </div>
          
          {/* Priority label */}
          <span className="text-xs font-medium" style={{ color: 'var(--color-text-muted)' }}>
            {priorityConf.label}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Reading time */}
          {item.estMinutes && (
            <div className="flex items-center gap-1 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <Clock size={12} />
              <span>{item.estMinutes} min read</span>
            </div>
          )}

          {/* Status badge */}
          <button
            onClick={handleStatusClick}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-80"
            style={config.style}
          >
            {config.label}
          </button>
        </div>
      </div>
    </div>
  );
}