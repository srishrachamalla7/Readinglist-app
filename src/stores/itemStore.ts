import { db } from '../utils/database';
import type { Item, ItemStatus, Priority, ItemStats } from '../utils/types';

class ItemStore {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // CRUD Operations for Items
  async addItem(item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) {
    const newItem: Item = {
      ...item,
      metadataFetched: item.metadataFetched ?? false,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    await db.items.add(newItem);
    
    // Update tag usage counts
    await this.updateTagUsageCounts(item.tags);
    
    this.notify();
    return newItem;
  }

  async updateItem(id: string, updates: Partial<Item>) {
    const currentItem = await db.items.get(id);
    if (!currentItem) throw new Error('Item not found');

    const oldTags = currentItem.tags;
    const newTags = updates.tags || oldTags;

    await db.items.update(id, {
      ...updates,
      updatedAt: new Date(),
    });

    // Update tag usage counts if tags changed
    if (JSON.stringify(oldTags.sort()) !== JSON.stringify(newTags.sort())) {
      await this.updateTagUsageCounts([...oldTags, ...newTags]);
    }

    this.notify();
  }

  async deleteItem(id: string) {
    const item = await db.items.get(id);
    if (item) {
      await db.items.delete(id);
      await this.updateTagUsageCounts(item.tags);
      this.notify();
    }
  }

  async getItems(): Promise<Item[]> {
    return await db.items.orderBy('updatedAt').reverse().toArray();
  }

  async getItemsByStatus(status: ItemStatus): Promise<Item[]> {
    return await db.items.where('status').equals(status).toArray();
  }

  async getItemsByPriority(priority: Priority): Promise<Item[]> {
    return await db.items.where('priority').equals(priority).toArray();
  }

  async getItemsByDomain(domain: string): Promise<Item[]> {
    return await db.items.where('domain').equals(domain).toArray();
  }

  async getItemsByTag(tagId: string): Promise<Item[]> {
    return await db.items.where('tags').anyOf([tagId]).toArray();
  }

  async markAsOpened(id: string) {
    await db.items.update(id, {
      lastOpenedAt: new Date(),
      updatedAt: new Date(),
    });
    this.notify();
  }

  // Search Functions
  async searchItems(query: string): Promise<Item[]> {
    const lowercaseQuery = query.toLowerCase();
    return await db.items
      .filter(item => 
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.description?.toLowerCase().includes(lowercaseQuery) ||
        item.domain.toLowerCase().includes(lowercaseQuery) ||
        item.notes?.toLowerCase().includes(lowercaseQuery)
      )
      .toArray();
  }

  async getItemsWithFilters(filters: {
    status?: ItemStatus;
    priority?: Priority;
    domain?: string;
    tags?: string[];
    query?: string;
  }): Promise<Item[]> {
    let collection = db.items.toCollection();

    if (filters.status) {
      collection = db.items.where('status').equals(filters.status);
    }

    if (filters.priority) {
      collection = collection.and(item => item.priority === filters.priority);
    }

    if (filters.domain) {
      collection = collection.and(item => item.domain === filters.domain);
    }

    if (filters.tags && filters.tags.length > 0) {
      collection = collection.and(item => 
        filters.tags!.some(tagId => item.tags.includes(tagId))
      );
    }

    if (filters.query) {
      const query = filters.query.toLowerCase();
      collection = collection.and(item =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.domain.toLowerCase().includes(query) ||
        item.notes?.toLowerCase().includes(query)
      );
    }

    return await collection.toArray();
  }

  async getStats(): Promise<ItemStats> {
    const items = await this.getItems();
    
    const byPriority = items.reduce((acc, item) => {
      acc[item.priority] = (acc[item.priority] || 0) + 1;
      return acc;
    }, {} as Record<Priority, number>);

    const byDomain = items.reduce((acc, item) => {
      acc[item.domain] = (acc[item.domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: items.length,
      unread: items.filter(item => item.status === 'unread').length,
      reading: items.filter(item => item.status === 'reading').length,
      completed: items.filter(item => item.status === 'completed').length,
      archived: items.filter(item => item.status === 'archived').length,
      byPriority: {
        low: byPriority.low || 0,
        medium: byPriority.medium || 0,
        high: byPriority.high || 0,
        urgent: byPriority.urgent || 0,
      },
      byDomain,
    };
  }

  private async updateTagUsageCounts(tagIds: string[]) {
    const uniqueTagIds = [...new Set(tagIds)];
    
    for (const tagId of uniqueTagIds) {
      const usageCount = await db.items.where('tags').anyOf([tagId]).count();
      await db.tags.update(tagId, { usageCount });
    }
  }
}

export const itemStore = new ItemStore();