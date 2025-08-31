import { useState, useEffect } from 'react';
import { tagStore } from '../stores/tagStore';
import type { Tag } from '../utils/types';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const tagsData = await tagStore.getTags();
      setTags(tagsData);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    const unsubscribe = tagStore.subscribe(() => {
      refreshData();
    });

    return unsubscribe;
  }, []);

  return {
    tags,
    loading,
    refreshData,
  };
}