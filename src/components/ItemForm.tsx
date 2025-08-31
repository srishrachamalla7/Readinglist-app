import { useState, useEffect } from 'react';
import { X, Save, Plus, Globe, Clock, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useTags } from '../hooks/useTags';
import { tagStore } from '../stores/tagStore';
import { normalizeUrl, isValidUrl, extractDomain } from '../utils/urlUtils';
import { MetadataFetcher } from '../utils/metadataFetcher';
import { networkStatus } from '../utils/networkStatus';
import type { Item, MetadataFetchResult } from '../utils/types';

interface ItemFormProps {
  item?: Item;
  onSave: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function ItemForm({ item, onSave, onCancel }: ItemFormProps) {
  const { tags } = useTags();
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    tags: [] as string[],
    priority: 'medium' as Item['priority'],
    status: 'unread' as Item['status'],
    estMinutes: 0,
    notes: '',
  });
  const [newTagName, setNewTagName] = useState('');
  const [metadataState, setMetadataState] = useState<{
    loading: boolean;
    result?: MetadataFetchResult;
    fetched: boolean;
  }>({ loading: false, fetched: false });
  const [isDuplicateUrl, setIsDuplicateUrl] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        url: item.url,
        title: item.title,
        description: item.description || '',
        tags: item.tags,
        priority: item.priority,
        status: item.status,
        estMinutes: item.estMinutes || 0,
        notes: item.notes || '',
      });
    }
  }, [item]);

  // Auto-fetch metadata when URL changes
  useEffect(() => {
    const fetchMetadata = async () => {
      if (!formData.url || !isValidUrl(normalizeUrl(formData.url)) || item) return;
      
      setMetadataState({ loading: true, fetched: false });
      
      try {
        const result = await MetadataFetcher.fetchMetadata(normalizeUrl(formData.url));
        setMetadataState({ loading: false, result, fetched: true });
        
        if (result.success) {
          setFormData(prev => ({
            ...prev,
            title: prev.title || result.title || '',
            description: prev.description || result.description || '',
            estMinutes: prev.estMinutes || result.estMinutes || 0,
          }));
        }
      } catch (error) {
        setMetadataState({ loading: false, fetched: true });
      }
    };

    const timeoutId = setTimeout(fetchMetadata, 1000); // Debounce
    return () => clearTimeout(timeoutId);
  }, [formData.url, item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;
    
    if (!isValidUrl(normalizeUrl(formData.url))) {
      alert('Please enter a valid URL');
      return;
    }

    const normalizedUrl = normalizeUrl(formData.url);
    const domain = extractDomain(normalizedUrl);
    
    onSave({
      ...formData,
      url: normalizedUrl,
      domain,
      favicon: metadataState.result?.favicon,
      wordCount: metadataState.result?.wordCount,
      estMinutes: formData.estMinutes || metadataState.result?.estMinutes || undefined,
      description: formData.description || undefined,
      notes: formData.notes || undefined,
      metadataFetched: metadataState.fetched && !!metadataState.result?.success,
    });
    
    setFormData({
      url: '',
      title: '',
      description: '',
      tags: [],
      priority: 'medium',
      status: 'unread',
      estMinutes: 0,
      notes: '',
    });
  };

  const handleAddNewTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const newTag = await tagStore.addTag({ 
        name: newTagName.trim(),
        color: '#3b82f6' // Default blue color
      });
      setFormData({ ...formData, tags: [...formData.tags, newTag.id] });
      setNewTagName('');
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const handleTagToggle = (tagId: string) => {
    const isSelected = formData.tags.includes(tagId);
    if (isSelected) {
      setFormData({ ...formData, tags: formData.tags.filter(id => id !== tagId) });
    } else {
      setFormData({ ...formData, tags: [...formData.tags, tagId] });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50" 
         style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div className="rounded-2xl shadow-modal w-full max-w-2xl max-h-[90vh] overflow-y-auto"
           style={{ backgroundColor: 'var(--color-modal)' }}>
        <div className="flex items-center justify-between p-6 border-b" 
             style={{ borderColor: 'var(--color-border)' }}>
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {item ? 'Edit Item' : 'Add New Item'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg transition-colors hover:bg-modern-accent hover:text-black"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL *
            </label>
            <div className="relative">
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/article"
                required
              />
              {metadataState.loading && (
                <div className="absolute right-3 top-1/2 transform -y-1/2">
                  <Loader className="h-4 w-4 animate-spin text-blue-500" />
                </div>
              )}
              {metadataState.fetched && metadataState.result && (
                <div className="absolute right-3 top-1/2 transform -y-1/2">
                  {metadataState.result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {metadataState.fetched && metadataState.result && !metadataState.result.success && (
              <p className="text-sm text-red-600 mt-1">
                Failed to fetch metadata: {metadataState.result.error}
              </p>
            )}
            {!networkStatus.isOnline() && (
              <p className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
                <Globe className="h-4 w-4" />
                Offline - metadata will be fetched when connection is restored
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter item title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as Item['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="unread">Unread</option>
                <option value="reading">Reading</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Item['priority'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Estimated Reading Time (minutes)
            </label>
            <input
              type="number"
              value={formData.estMinutes}
              onChange={(e) => setFormData({ ...formData, estMinutes: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={metadataState.result?.estMinutes?.toString() || "0"}
              min="0"
            />
            {metadataState.result?.estMinutes && (
              <p className="text-sm text-gray-500 mt-1">
                Auto-detected: {metadataState.result.estMinutes} minutes
                {metadataState.result.wordCount && ` (${metadataState.result.wordCount} words)`}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      formData.tags.includes(tag.id)
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={{ backgroundColor: formData.tags.includes(tag.id) ? tag.color + '20' : undefined }}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Create new tag"
                  className="flex-1 px-3 py-1 text-sm border rounded-lg focus:ring-2 focus:outline-none"
              style={{
                backgroundColor: 'var(--color-bg)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
                '--tw-ring-color': 'var(--color-accent)'
              } as React.CSSProperties}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNewTag())}
                />
                <button
                  type="button"
                  onClick={handleAddNewTag}
                  className="px-3 py-1 rounded-lg transition-colors text-sm hover:opacity-80"
                  style={{ backgroundColor: 'var(--color-accent)', color: '#000000' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your thoughts and notes (optional)"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border rounded-lg transition-colors hover:bg-modern-accent hover:text-black"
              style={{
                color: 'var(--color-text-primary)',
                borderColor: 'var(--color-border)'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 hover:opacity-80"
              style={{ backgroundColor: 'var(--color-accent)', color: '#000000' }}
            >
              <Save size={16} />
              {item ? 'Update' : 'Add'} Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}