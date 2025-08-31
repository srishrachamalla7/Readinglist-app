import { useState, useEffect } from 'react';
import { collectionStore } from '../stores/collectionStore';
import type { Collection } from '../utils/types';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const collectionsData = await collectionStore.getCollections();
      setCollections(collectionsData);
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    const unsubscribe = collectionStore.subscribe(() => {
      refreshData();
    });

    return unsubscribe;
  }, []);

  return {
    collections,
    loading,
    refreshData,
  };
}