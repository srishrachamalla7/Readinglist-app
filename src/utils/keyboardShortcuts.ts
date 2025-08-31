import type { KeyboardShortcut } from './types';

export class KeyboardShortcutManager {
  private static instance: KeyboardShortcutManager;
  private shortcuts: Map<string, KeyboardShortcut> = new Map();
  private enabled = true;

  static getInstance(): KeyboardShortcutManager {
    if (!KeyboardShortcutManager.instance) {
      KeyboardShortcutManager.instance = new KeyboardShortcutManager();
    }
    return KeyboardShortcutManager.instance;
  }

  constructor() {
    if (KeyboardShortcutManager.instance) {
      return KeyboardShortcutManager.instance;
    }

    this.setupEventListeners();
    KeyboardShortcutManager.instance = this;
  }

  private setupEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (!this.enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      // Exception for Escape key
      if (event.key !== 'Escape') return;
    }

    const shortcutKey = this.getShortcutKey(event);
    const shortcut = this.shortcuts.get(shortcutKey);

    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }

  private getShortcutKey(event: KeyboardEvent): string {
    const parts = [];
    if (event.ctrlKey) parts.push('ctrl');
    if (event.shiftKey) parts.push('shift');
    if (event.altKey) parts.push('alt');
    parts.push(event.key.toLowerCase());
    return parts.join('+');
  }

  register(shortcut: KeyboardShortcut) {
    const key = this.getShortcutKeyFromShortcut(shortcut);
    this.shortcuts.set(key, shortcut);
  }

  unregister(shortcut: KeyboardShortcut) {
    const key = this.getShortcutKeyFromShortcut(shortcut);
    this.shortcuts.delete(key);
  }

  private getShortcutKeyFromShortcut(shortcut: KeyboardShortcut): string {
    const parts = [];
    if (shortcut.ctrlKey) parts.push('ctrl');
    if (shortcut.shiftKey) parts.push('shift');
    if (shortcut.altKey) parts.push('alt');
    parts.push(shortcut.key.toLowerCase());
    return parts.join('+');
  }

  getShortcuts(): KeyboardShortcut[] {
    return Array.from(this.shortcuts.values());
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const keyboardShortcuts = KeyboardShortcutManager.getInstance();
