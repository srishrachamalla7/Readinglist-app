import React from 'react';
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import type { SortOption, SortDirection } from '../utils/types';

interface SortDropdownProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  onSortChange: (sortBy: SortOption, direction: SortDirection) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'dateAdded', label: 'Date Added' },
  { value: 'priority', label: 'Priority' },
  { value: 'readingTime', label: 'Reading Time' },
  { value: 'title', label: 'Title' },
  { value: 'domain', label: 'Domain' }
];

export function SortDropdown({ sortBy, sortDirection, onSortChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const currentSort = sortOptions.find(option => option.value === sortBy);

  const handleSortSelect = (newSortBy: SortOption) => {
    const newDirection = newSortBy === sortBy && sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange(newSortBy, newDirection);
    setIsOpen(false);
  };

  const toggleDirection = () => {
    onSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="relative">
      <div className="flex">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-l-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <ArrowUpDown size={16} />
          <span>{currentSort?.label}</span>
          <ChevronDown size={16} />
        </button>
        
        <button
          onClick={toggleDirection}
          className="px-2 py-2 bg-white border-t border-r border-b border-gray-300 rounded-r-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          title={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
        >
          {sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-full">
          <div className="py-1">
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => handleSortSelect(option.value)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${
                  option.value === sortBy ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
