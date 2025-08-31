import { db } from '../utils/database';
import { itemStore } from './itemStore';
import type { Collection, CollectionRule, Item } from '../utils/types';

class CollectionStore {
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  // CRUD Operations for Collections
  async addCollection(collection: Omit<Collection, 'id' | 'createdAt'>) {
    const newCollection: Collection = {
      ...collection,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    await db.collections.add(newCollection);
    this.notify();
    return newCollection;
  }

  async updateCollection(id: string, updates: Partial<Omit<Collection, 'id' | 'createdAt'>>) {
    await db.collections.update(id, updates);
    this.notify();
  }

  async deleteCollection(id: string) {
    await db.collections.delete(id);
    this.notify();
  }

  async getCollections(): Promise<Collection[]> {
    return await db.collections.orderBy('createdAt').reverse().toArray();
  }

  async getCollectionById(id: string): Promise<Collection | undefined> {
    return await db.collections.get(id);
  }

  // Collection Rule Evaluation
  async getItemsInCollection(collectionId: string): Promise<Item[]> {
    const collection = await this.getCollectionById(collectionId);
    if (!collection) return [];

    const allItems = await itemStore.getItems();
    
    return allItems.filter(item => this.evaluateRules(item, collection.rules));
  }

  private evaluateRules(item: Item, rules: CollectionRule[]): boolean {
    if (rules.length === 0) return true;

    return rules.every(rule => this.evaluateRule(item, rule));
  }

  private evaluateRule(item: Item, rule: CollectionRule): boolean {
    const fieldValue = item[rule.field];
    const ruleValue = rule.value;

    switch (rule.operator) {
      case 'equals':
        return fieldValue === ruleValue;
      
      case 'contains':
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(ruleValue);
        }
        return String(fieldValue).toLowerCase().includes(String(ruleValue).toLowerCase());
      
      case 'startsWith':
        return String(fieldValue).toLowerCase().startsWith(String(ruleValue).toLowerCase());
      
      case 'endsWith':
        return String(fieldValue).toLowerCase().endsWith(String(ruleValue).toLowerCase());
      
      case 'greaterThan':
        if (fieldValue instanceof Date && ruleValue instanceof Date) {
          return fieldValue > ruleValue;
        }
        return Number(fieldValue) > Number(ruleValue);
      
      case 'lessThan':
        if (fieldValue instanceof Date && ruleValue instanceof Date) {
          return fieldValue < ruleValue;
        }
        return Number(fieldValue) < Number(ruleValue);
      
      default:
        return false;
    }
  }

  async searchCollections(query: string): Promise<Collection[]> {
    const lowercaseQuery = query.toLowerCase();
    return await db.collections
      .filter(collection => collection.name.toLowerCase().includes(lowercaseQuery))
      .toArray();
  }
}

export const collectionStore = new CollectionStore();