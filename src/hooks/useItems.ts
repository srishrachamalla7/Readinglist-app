import { useState, useEffect } from 'react';
import { itemStore } from '../stores/itemStore';
import type { Item, ItemStats } from '../utils/types';

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<ItemStats>({
    total: 0,
    unread: 0,
    reading: 0,
    completed: 0,
    archived: 0,
    byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
    byDomain: {},
  });
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const [itemsData, statsData] = await Promise.all([
        itemStore.getItems(),
        itemStore.getStats(),
      ]);
      setItems(itemsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
    
    const unsubscribe = itemStore.subscribe(() => {
      refreshData();
    });

    return unsubscribe;
  }, []);

  return {
    items,
    stats,
    loading,
    refreshData,
  };
}