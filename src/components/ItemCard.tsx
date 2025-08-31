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
    color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    dotColor: 'bg-gray-400'
  },
  reading: { 
    label: 'Reading', 
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    dotColor: 'bg-blue-500'
  },
  completed: { 
    label: 'Completed', 
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    dotColor: 'bg-green-500'
  },
  archived: { 
    label: 'Archived', 
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    dotColor: 'bg-yellow-500'
  },
};

const priorityConfig = {
  low: { 
    label: 'Low', 
    dots: [{ active: true, color: 'bg-gray-400' }, { active: false, color: 'bg-gray-200 dark:bg-gray-700' }, { active: false, color: 'bg-gray-200 dark:bg-gray-700' }]
  },
  medium: { 
    label: 'Medium', 
    dots: [{ active: true, color: 'bg-blue-500' }, { active: true, color: 'bg-blue-500' }, { active: false, color: 'bg-gray-200 dark:bg-gray-700' }]
  },
  high: { 
    label: 'High', 
    dots: [{ active: true, color: 'bg-orange-500' }, { active: true, color: 'bg-orange-500' }, { active: true, color: 'bg-orange-500' }]
  },
  urgent: { 
    label: 'Urgent', 
    dots: [{ active: true, color: 'bg-red-500' }, { active: true, color: 'bg-red-500' }, { active: true, color: 'bg-red-500' }]
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
    <div className="dynamic-surface rounded-2xl shadow-card dynamic-border border p-5 hover:shadow-card-hover hover:scale-[1.02] transition-all duration-200 group relative overflow-hidden">
      {/* Header with bookmark and menu */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
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
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors cursor-pointer leading-tight"
                onClick={handleOpenUrl}>
              {item.title}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{item.domain}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            title="Bookmark"
          >
            <Bookmark size={16} />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            title="More options"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      
      {/* Description */}
      {item.description && (
        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4 leading-relaxed">
          {item.description}
        </p>
      )}

      {/* Footer with status, priority, and reading time */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          {/* Status indicator */}
          <div className={`w-2 h-2 rounded-full ${config.dotColor}`}></div>
          
          {/* Priority dots */}
          <div className="flex items-center gap-1">
            {priorityConf.dots.map((dot, index) => (
              <div 
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${dot.active ? dot.color : 'bg-gray-200 dark:bg-gray-700'}`}
              />
            ))}
          </div>
          
          {/* Priority label */}
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {priorityConf.label}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Reading time */}
          {item.estMinutes && (
            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Clock size={12} />
              <span>{item.estMinutes} min read</span>
            </div>
          )}

          {/* Status badge */}
          <button
            onClick={handleStatusClick}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${config.color} hover:opacity-80`}
          >
            {config.label}
          </button>
        </div>
      </div>
    </div>
  );
}