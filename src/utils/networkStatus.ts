import type { NetworkStatus } from './types';

export class NetworkStatusManager {
  private static instance: NetworkStatusManager;
  private status: NetworkStatus = {
    isOnline: navigator.onLine,
    pendingOperations: 0
  };
  private listeners: Set<(status: NetworkStatus) => void> = new Set();
  private pendingQueue: Array<() => Promise<void>> = [];

  static getInstance(): NetworkStatusManager {
    if (!NetworkStatusManager.instance) {
      NetworkStatusManager.instance = new NetworkStatusManager();
    }
    return NetworkStatusManager.instance;
  }

  constructor() {
    if (NetworkStatusManager.instance) {
      return NetworkStatusManager.instance;
    }

    this.setupEventListeners();
    NetworkStatusManager.instance = this;
  }

  private setupEventListeners() {
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
  }

  private handleOnline() {
    this.status.isOnline = true;
    this.status.lastOnline = new Date();
    this.notifyListeners();
    this.processPendingQueue();
  }

  private handleOffline() {
    this.status.isOnline = false;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.status }));
  }

  private async processPendingQueue() {
    if (!this.status.isOnline || this.pendingQueue.length === 0) return;

    const operations = [...this.pendingQueue];
    this.pendingQueue = [];
    this.status.pendingOperations = operations.length;
    this.notifyListeners();

    for (const operation of operations) {
      try {
        await operation();
        this.status.pendingOperations--;
        this.notifyListeners();
      } catch (error) {
        console.error('Failed to process pending operation:', error);
        // Re-queue failed operations
        this.pendingQueue.push(operation);
      }
    }

    this.status.pendingOperations = 0;
    this.notifyListeners();
  }

  getStatus(): NetworkStatus {
    return { ...this.status };
  }

  addListener(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  queueOperation(operation: () => Promise<void>) {
    if (this.status.isOnline) {
      operation().catch(error => {
        console.error('Operation failed:', error);
        this.pendingQueue.push(operation);
      });
    } else {
      this.pendingQueue.push(operation);
      this.status.pendingOperations = this.pendingQueue.length;
      this.notifyListeners();
    }
  }

  isOnline(): boolean {
    return this.status.isOnline;
  }
}

export const networkStatus = NetworkStatusManager.getInstance();
