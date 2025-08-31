import { useState, useRef, useEffect } from 'react';
import { Search, X, Filter, Calendar, Clock, Tag, Globe } from 'lucide-react';
import type { SearchFilters, Tag as TagType } from '../utils/types';

interface AdvancedSearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  tags: TagType[];
  domains: string[];
  placeholder?: string;
}

export function AdvancedSearchBar({
  filters,
  onFiltersChange,
  tags,
  domains,
  placeholder = "Search your reading list..."
}: AdvancedSearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchHistory = useRef<string[]>([]);

  useEffect(() => {
    // Load search history from localStorage
    const saved = localStorage.getItem('readinglist-search-history');
    if (saved) {
      searchHistory.current = JSON.parse(saved);
    }
  }, []);

  useEffect(() => {
    // Generate suggestions based on query
    if (filters.query.length > 0) {
      const querySuggestions = searchHistory.current
        .filter(term => term.toLowerCase().includes(filters.query.toLowerCase()))
        .slice(0, 5);
      
      const tagSuggestions = tags
        .filter(tag => tag.name.toLowerCase().includes(filters.query.toLowerCase()))
        .map(tag => `tag:${tag.name}`)
        .slice(0, 3);
      
      const domainSuggestions = domains
        .filter(domain => domain.toLowerCase().includes(filters.query.toLowerCase()))
        .map(domain => `domain:${domain}`)
        .slice(0, 3);

      setSuggestions([...querySuggestions, ...tagSuggestions, ...domainSuggestions]);
    } else {
      setSuggestions(searchHistory.current.slice(0, 5));
    }
  }, [filters.query, tags, domains]);

  const handleQueryChange = (query: string) => {
    onFiltersChange({ ...filters, query });
  };

  const handleQuerySubmit = () => {
    if (filters.query.trim()) {
      // Add to search history
      const newHistory = [
        filters.query,
        ...searchHistory.current.filter(term => term !== filters.query)
      ].slice(0, 10);
      
      searchHistory.current = newHistory;
      localStorage.setItem('readinglist-search-history', JSON.stringify(newHistory));
    }
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.startsWith('tag:')) {
      const tagName = suggestion.replace('tag:', '');
      const tag = tags.find(t => t.name === tagName);
      if (tag && !filters.tags.includes(tag.id)) {
        onFiltersChange({
          ...filters,
          tags: [...filters.tags, tag.id]
        });
      }
    } else if (suggestion.startsWith('domain:')) {
      const domain = suggestion.replace('domain:', '');
      if (!filters.domains.includes(domain)) {
        onFiltersChange({
          ...filters,
          domains: [...filters.domains, domain]
        });
      }
    } else {
      handleQueryChange(suggestion);
    }
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    onFiltersChange({
      query: '',
      tags: [],
      status: [],
      priority: [],
      domains: [],
      collections: [],
    });
    inputRef.current?.focus();
  };

  const hasActiveFilters = 
    filters.tags.length > 0 ||
    filters.status.length > 0 ||
    filters.priority.length > 0 ||
    filters.domains.length > 0 ||
    filters.collections.length > 0;

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5" style={{ color: 'var(--color-text-muted)' }} />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={filters.query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleQuerySubmit();
            } else if (e.key === 'Escape') {
              clearSearch();
            }
          }}
          className="block w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 text-sm"
          style={{
            backgroundColor: 'var(--color-bg)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
            '--tw-ring-color': 'var(--color-accent)'
          } as React.CSSProperties}
          placeholder={placeholder}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {(filters.query || hasActiveFilters) && (
            <button
              onClick={clearSearch}
              className="p-1 rounded transition-colors hover:bg-modern-accent hover:text-black"
              style={{ color: 'var(--color-text-muted)' }}
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 mr-1 rounded ${
              hasActiveFilters || isExpanded
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title="Advanced filters"
          >
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
              >
                {suggestion.startsWith('tag:') ? (
                  <>
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{suggestion}</span>
                  </>
                ) : suggestion.startsWith('domain:') ? (
                  <>
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{suggestion}</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{suggestion}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Date Range
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.dateRange?.start?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    const start = e.target.value ? new Date(e.target.value) : undefined;
                    onFiltersChange({
                      ...filters,
                      dateRange: start ? { 
                        start, 
                        end: filters.dateRange?.end || new Date() 
                      } : undefined
                    });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <input
                  type="date"
                  value={filters.dateRange?.end?.toISOString().split('T')[0] || ''}
                  onChange={(e) => {
                    const end = e.target.value ? new Date(e.target.value) : undefined;
                    onFiltersChange({
                      ...filters,
                      dateRange: end ? { 
                        start: filters.dateRange?.start || new Date(0), 
                        end 
                      } : undefined
                    });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>

            {/* Reading Time Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Reading Time (minutes)
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.readingTimeRange?.min || ''}
                  onChange={(e) => {
                    const min = e.target.value ? parseInt(e.target.value) : undefined;
                    onFiltersChange({
                      ...filters,
                      readingTimeRange: min !== undefined ? { 
                        min, 
                        max: filters.readingTimeRange?.max || 999 
                      } : undefined
                    });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.readingTimeRange?.max || ''}
                  onChange={(e) => {
                    const max = e.target.value ? parseInt(e.target.value) : undefined;
                    onFiltersChange({
                      ...filters,
                      readingTimeRange: max !== undefined ? { 
                        min: filters.readingTimeRange?.min || 0, 
                        max 
                      } : undefined
                    });
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <button
              onClick={() => {
                onFiltersChange({
                  ...filters,
                  dateRange: undefined,
                  readingTimeRange: undefined
                });
              }}
              className="px-3 py-2 text-sm text-red-600 hover:text-red-800"
            >
              Clear Advanced
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
