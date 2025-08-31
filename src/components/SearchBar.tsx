import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { ItemStatus } from '../utils/types';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ItemStatus | 'all';
  onStatusFilterChange: (status: ItemStatus | 'all') => void;
}

export function SearchBar({ 
  searchQuery, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange 
}: SearchBarProps) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items by title, domain, or description..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as ItemStatus | 'all')}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Items</option>
            <option value="unread">Unread</option>
            <option value="reading">Currently Reading</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
    </div>
  );
}