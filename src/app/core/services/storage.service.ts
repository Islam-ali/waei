import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type StorageType = 'local' | 'session';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private localStorage: Storage | null = null;
  private sessionStorage: Storage | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.localStorage = window.localStorage;
      this.sessionStorage = window.sessionStorage;
    }
  }

  /**
   * الحصول على storage حسب النوع
   */
  private getStorage(type: StorageType): Storage | null {
    return type === 'local' ? this.localStorage : this.sessionStorage;
  }

  /**
   * حفظ قيمة في storage
   */
  setItem(key: string, value: any, type: StorageType = 'local'): void {
    const storage = this.getStorage(type);
    if (storage) {
      try {
        const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
        storage.setItem(key, serializedValue);
      } catch (error) {
        console.error(`Error saving to ${type}Storage:`, error);
      }
    }
  }

  /**
   * جلب قيمة من storage
   */
  getItem<T = any>(key: string, type: StorageType = 'local', defaultValue?: T): T | null {
    const storage = this.getStorage(type);
    if (storage) {
      try {
        const item = storage.getItem(key);
        if (item === null) {
          return defaultValue || null;
        }

        // محاولة تحليل JSON
        try {
          return JSON.parse(item);
        } catch {
          // إذا فشل التحليل، إرجاع القيمة كما هي
          return item as T;
        }
      } catch (error) {
        console.error(`Error reading from ${type}Storage:`, error);
        return defaultValue || null;
      }
    }
    return defaultValue || null;
  }

  /**
   * حذف عنصر من storage
   */
  removeItem(key: string, type: StorageType = 'local'): void {
    const storage = this.getStorage(type);
    if (storage) {
      try {
        storage.removeItem(key);
      } catch (error) {
        console.error(`Error removing from ${type}Storage:`, error);
      }
    }
  }

  /**
   * مسح جميع البيانات من storage
   */
  clear(type: StorageType = 'local'): void {
    const storage = this.getStorage(type);
    if (storage) {
      try {
        storage.clear();
      } catch (error) {
        console.error(`Error clearing ${type}Storage:`, error);
      }
    }
  }

  /**
   * التحقق من وجود مفتاح في storage
   */
  hasItem(key: string, type: StorageType = 'local'): boolean {
    const storage = this.getStorage(type);
    if (storage) {
      try {
        return storage.getItem(key) !== null;
      } catch (error) {
        console.error(`Error checking ${type}Storage:`, error);
        return false;
      }
    }
    return false;
  }

  /**
   * جلب جميع المفاتيح من storage
   */
  getKeys(type: StorageType = 'local'): string[] {
    const storage = this.getStorage(type);
    if (storage) {
      try {
        return Object.keys(storage);
      } catch (error) {
        console.error(`Error getting ${type}Storage keys:`, error);
        return [];
      }
    }
    return [];
  }

  /**
   * جلب حجم storage المستخدم
   */
  getSize(type: StorageType = 'local'): number {
    const storage = this.getStorage(type);
    if (storage) {
      try {
        let size = 0;
        for (let key in storage) {
          if (storage.hasOwnProperty(key)) {
            size += storage[key].length + key.length;
          }
        }
        return size;
      } catch (error) {
        console.error(`Error calculating ${type}Storage size:`, error);
        return 0;
      }
    }
    return 0;
  }

  /**
   * التحقق من دعم storage
   */
  isSupported(type: StorageType = 'local'): boolean {
    return this.getStorage(type) !== null;
  }

  // Local Storage Methods
  setLocalItem(key: string, value: any): void {
    this.setItem(key, value, 'local');
  }

  getLocalItem<T = any>(key: string, defaultValue?: T): T | null {
    return this.getItem<T>(key, 'local', defaultValue);
  }

  removeLocalItem(key: string): void {
    this.removeItem(key, 'local');
  }

  clearLocal(): void {
    this.clear('local');
  }

  hasLocalItem(key: string): boolean {
    return this.hasItem(key, 'local');
  }

  getLocalKeys(): string[] {
    return this.getKeys('local');
  }

  getLocalSize(): number {
    return this.getSize('local');
  }

  // Session Storage Methods
  setSessionItem(key: string, value: any): void {
    this.setItem(key, value, 'session');
  }

  getSessionItem<T = any>(key: string, defaultValue?: T): T | null {
    return this.getItem<T>(key, 'session', defaultValue);
  }

  removeSessionItem(key: string): void {
    this.removeItem(key, 'session');
  }

  clearSession(): void {
    this.clear('session');
  }

  hasSessionItem(key: string): boolean {
    return this.hasItem(key, 'session');
  }

  getSessionKeys(): string[] {
    return this.getKeys('session');
  }

  getSessionSize(): number {
    return this.getSize('session');
  }

  // Utility Methods
  setObject(key: string, value: object, type: StorageType = 'local'): void {
    this.setItem(key, value, type);
  }

  getObject<T = object>(key: string, type: StorageType = 'local', defaultValue?: T): T | null {
    return this.getItem<T>(key, type, defaultValue);
  }

  setArray<T>(key: string, value: T[], type: StorageType = 'local'): void {
    this.setItem(key, value, type);
  }

  getArray<T>(key: string, type: StorageType = 'local', defaultValue: T[] = []): T[] {
    const value = this.getItem<T[]>(key, type);
    return Array.isArray(value) ? value : defaultValue;
  }

  setString(key: string, value: string, type: StorageType = 'local'): void {
    this.setItem(key, value, type);
  }

  getString(key: string, type: StorageType = 'local', defaultValue: string = ''): string {
    const value = this.getItem<string>(key, type);
    return typeof value === 'string' ? value : defaultValue;
  }

  setNumber(key: string, value: number, type: StorageType = 'local'): void {
    this.setItem(key, value, type);
  }

  getNumber(key: string, type: StorageType = 'local', defaultValue: number = 0): number {
    const value = this.getItem<number>(key, type);
    return typeof value === 'number' ? value : defaultValue;
  }

  setBoolean(key: string, value: boolean, type: StorageType = 'local'): void {
    this.setItem(key, value, type);
  }

  getBoolean(key: string, type: StorageType = 'local', defaultValue: boolean = false): boolean {
    const value = this.getItem<boolean>(key, type);
    return typeof value === 'boolean' ? value : defaultValue;
  }
} 