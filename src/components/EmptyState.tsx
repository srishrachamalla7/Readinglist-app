import React from 'react';
import { BookOpen, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddItem: () => void;
  isFiltered?: boolean;
}

export function EmptyState({ onAddItem, isFiltered = false }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="p-4 bg-gray-100 rounded-full mb-4">
        <BookOpen size={32} className="text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isFiltered ? 'No items found' : 'Your reading list is empty'}
      </h3>
      
      <p className="text-gray-500 text-center mb-6 max-w-sm">
        {isFiltered 
          ? 'Try adjusting your search or filter criteria to find more items.'
          : 'Start building your personal reading list by adding your first item to track your reading journey.'
        }
      </p>

      {!isFiltered && (
        <button
          onClick={onAddItem}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus size={18} />
          Add Your First Item
        </button>
      )}
    </div>
  );
}