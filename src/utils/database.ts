import Dexie, { type EntityTable } from 'dexie';
import type { Item, Tag, Collection, Settings } from './types';

export class ReadingListDB extends Dexie {
  items!: EntityTable<Item, 'id'>;
  tags!: EntityTable<Tag, 'id'>;
  collections!: EntityTable<Collection, 'id'>;
  settings!: EntityTable<Settings & { id: string }, 'id'>;

  constructor() {
    super('ReadingListDB');
    
    this.version(1).stores({
      items: '&id, url, title, domain, status, priority, createdAt, updatedAt, lastOpenedAt, *tags',
      tags: '&id, name, createdAt, usageCount',
      collections: '&id, name, createdAt',
      settings: '&id'
    });

    // Add hooks for automatic timestamp updates
    this.items.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.updatedAt = new Date();
    });

    this.items.hook('updating', (modifications, primKey, obj, trans) => {
      modifications.updatedAt = new Date();
    });

    this.tags.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
      obj.usageCount = 0;
    });

    this.collections.hook('creating', (primKey, obj, trans) => {
      obj.createdAt = new Date();
    });
  }
}

export const db = new ReadingListDB();

// Initialize with default settings and sample data
db.on('ready', async () => {
  // Initialize default settings
  const settingsCount = await db.settings.count();
  if (settingsCount === 0) {
    await db.settings.add({
      id: 'default',
      theme: 'system',
      // Back-compat fields are still persisted for imports/legacy
      defaultPriority: 'medium',
      autoFetch: true,
      // Full settings fields will be merged by settingsStore
      viewMode: 'list',
      sortBy: 'dateAdded',
      sortDirection: 'desc',
      sidebarCollapsed: false,
      itemsPerPage: 50,
      showReadingTime: true,
      readingSpeed: 200,
      autoFetchMetadata: true,
      confirmDelete: true,
    });
  }

  // Initialize with sample data if empty
  const itemCount = await db.items.count();
  if (itemCount === 0) {
    const sampleTags: Omit<Tag, 'id' | 'createdAt' | 'usageCount'>[] = [
      { name: 'Technology', color: '#3b82f6' },
      { name: 'Science', color: '#10b981' },
      { name: 'Business', color: '#f59e0b' },
      { name: 'Personal', color: '#8b5cf6' },
    ];

    const createdTags = await Promise.all(
      sampleTags.map(async (tag) => {
        const id = crypto.randomUUID();
        await db.tags.add({ ...tag, id });
        return { ...tag, id };
      })
    );

    const sampleItems: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        url: 'https://example.com/article1',
        title: 'The Future of Web Development',
        description: 'An in-depth look at emerging web technologies and frameworks',
        domain: 'example.com',
        tags: [createdTags[0].id],
        priority: 'high',
        status: 'unread',
        estMinutes: 15,
        metadataFetched: false,
      },
      {
        url: 'https://techblog.com/ai-trends',
        title: 'AI Trends in 2024',
        description: 'Latest developments in artificial intelligence and machine learning',
        domain: 'techblog.com',
        tags: [createdTags[0].id, createdTags[1].id],
        priority: 'medium',
        status: 'reading',
        estMinutes: 20,
        metadataFetched: false,
      },
      {
        url: 'https://business.com/productivity',
        title: 'Productivity Hacks for Remote Work',
        description: 'Tips and strategies for staying productive while working from home',
        domain: 'business.com',
        tags: [createdTags[2].id, createdTags[3].id],
        priority: 'medium',
        status: 'completed',
        estMinutes: 10,
        notes: 'Great tips on time management and workspace setup',
        metadataFetched: false,
      },
    ];

    await Promise.all(
      sampleItems.map(item => 
        db.items.add({
          ...item,
          id: crypto.randomUUID(),
        })
      )
    );

    // Update tag usage counts
    for (const tag of createdTags) {
      const usageCount = sampleItems.filter(item => item.tags.includes(tag.id)).length;
      await db.tags.update(tag.id, { usageCount });
    }
  }
});