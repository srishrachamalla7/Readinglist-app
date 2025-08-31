import { db } from '../utils/database';
import type { Tag } from '../utils/types';

class TagStore {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // CRUD Operations for Tags
  async addTag(tag: Omit<Tag, 'id' | 'createdAt' | 'usageCount'>) {
    const newTag: Tag = {
      ...tag,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      usageCount: 0,
    };
    
    await db.tags.add(newTag);
    this.notify();
    return newTag;
  }

  async updateTag(id: string, updates: Partial<Omit<Tag, 'id' | 'createdAt'>>) {
    await db.tags.update(id, updates);
    this.notify();
  }

  async deleteTag(id: string) {
    // Remove tag from all items first
    const itemsWithTag = await db.items.where('tags').anyOf([id]).toArray();
    
    for (const item of itemsWithTag) {
      const updatedTags = item.tags.filter(tagId => tagId !== id);
      await db.items.update(item.id, { tags: updatedTags });
    }

    await db.tags.delete(id);
    this.notify();
  }

  async getTags(): Promise<Tag[]> {
    return await db.tags.orderBy('name').toArray();
  }

  async getTagById(id: string): Promise<Tag | undefined> {
    return await db.tags.get(id);
  }

  async getTagsByUsage(): Promise<Tag[]> {
    return await db.tags.orderBy('usageCount').reverse().toArray();
  }

  async searchTags(query: string): Promise<Tag[]> {
    const lowercaseQuery = query.toLowerCase();
    return await db.tags
      .filter(tag => tag.name.toLowerCase().includes(lowercaseQuery))
      .toArray();
  }

  async getOrCreateTag(name: string, color?: string): Promise<Tag> {
    const existingTag = await db.tags.where('name').equalsIgnoreCase(name).first();
    
    if (existingTag) {
      return existingTag;
    }

    return await this.addTag({
      name,
      color: color || this.generateRandomColor(),
    });
  }

  private generateRandomColor(): string {
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
      '#ef4444', '#06b6d4', '#84cc16', '#f97316',
      '#ec4899', '#6366f1', '#14b8a6', '#eab308'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

export const tagStore = new TagStore();