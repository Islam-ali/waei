import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export interface BaseEntity {
  id?: string | number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GenericService<T extends BaseEntity> {
  protected items = new BehaviorSubject<T[]>([]);
  protected loading = new BehaviorSubject<boolean>(false);
  protected error = new BehaviorSubject<string | null>(null);

  // Observable getters
  public items$ = this.items.asObservable();
  public loading$ = this.loading.asObservable();
  public error$ = this.error.asObservable();

  /**
   * Get all items
   */
  getAll(): Observable<T[]> {
    this.setLoading(true);
    this.clearError();
    
    return this.items$.pipe(
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get item by ID
   */
  getById(id: string | number): Observable<T | null> {
    this.setLoading(true);
    this.clearError();

    return this.items$.pipe(
      map(items => items.find(item => item.id === id) || null),
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Create new item
   */
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Observable<T> {
    this.setLoading(true);
    this.clearError();

    const newItem: T = {
      ...item,
      id: this.generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as T;

    const currentItems = this.items.value;
    this.items.next([...currentItems, newItem]);
    this.setLoading(false);

    return of(newItem);
  }

  /**
   * Update existing item
   */
  update(id: string | number, updates: Partial<T>): Observable<T | null> {
    this.setLoading(true);
    this.clearError();

    const currentItems = this.items.value;
    const index = currentItems.findIndex(item => item.id === id);
    
    if (index === -1) {
      this.setError('Item not found');
      this.setLoading(false);
      return throwError(() => new Error('Item not found'));
    }

    const updatedItem: T = {
      ...currentItems[index],
      ...updates,
      updatedAt: new Date()
    };

    currentItems[index] = updatedItem;
    this.items.next([...currentItems]);
    this.setLoading(false);

    return of(updatedItem);
  }

  /**
   * Delete item by ID
   */
  delete(id: string | number): Observable<boolean> {
    this.setLoading(true);
    this.clearError();

    const currentItems = this.items.value;
    const filteredItems = currentItems.filter(item => item.id !== id);
    
    if (filteredItems.length === currentItems.length) {
      this.setError('Item not found');
      this.setLoading(false);
      return throwError(() => new Error('Item not found'));
    }

    this.items.next(filteredItems);
    this.setLoading(false);

    return of(true);
  }

  /**
   * Search items by criteria
   */
  search(criteria: Partial<T>): Observable<T[]> {
    this.setLoading(true);
    this.clearError();

    return this.items$.pipe(
      map(items => items.filter(item => 
        Object.keys(criteria).every(key => 
          item[key as keyof T] === criteria[key as keyof T]
        )
      )),
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Filter items by predicate function
   */
  filter(predicate: (item: T) => boolean): Observable<T[]> {
    this.setLoading(true);
    this.clearError();

    return this.items$.pipe(
      map(items => items.filter(predicate)),
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Sort items by property
   */
  sort(property: keyof T, order: 'asc' | 'desc' = 'asc'): Observable<T[]> {
    this.setLoading(true);
    this.clearError();

    return this.items$.pipe(
      map(items => [...items].sort((a, b) => {
        const aVal = a[property];
        const bVal = b[property];
        
        if (aVal < bVal) return order === 'asc' ? -1 : 1;
        if (aVal > bVal) return order === 'asc' ? 1 : -1;
        return 0;
      })),
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Get paginated items
   */
  getPaginated(params: PaginationParams): Observable<PaginatedResponse<T>> {
    this.setLoading(true);
    this.clearError();

    return this.items$.pipe(
      map(items => {
        let filteredItems = [...items];

        // Apply search if provided
        if (params.search) {
          filteredItems = filteredItems.filter(item =>
            Object.values(item).some(value =>
              String(value).toLowerCase().includes(params.search!.toLowerCase())
            )
          );
        }

        // Apply sorting if provided
        if (params.sortBy) {
          filteredItems.sort((a, b) => {
            const aVal = a[params.sortBy as keyof T];
            const bVal = b[params.sortBy as keyof T];
            
            if (aVal < bVal) return params.sortOrder === 'desc' ? 1 : -1;
            if (aVal > bVal) return params.sortOrder === 'desc' ? -1 : 1;
            return 0;
          });
        }

        const total = filteredItems.length;
        const totalPages = Math.ceil(total / params.limit);
        const startIndex = (params.page - 1) * params.limit;
        const endIndex = startIndex + params.limit;
        const data = filteredItems.slice(startIndex, endIndex);

        return {
          data,
          total,
          page: params.page,
          limit: params.limit,
          totalPages
        };
      }),
      tap(() => this.setLoading(false)),
      catchError(this.handleError.bind(this))
    );
  }

  /**
   * Set items (useful for initializing with data)
   */
  setItems(items: T[]): void {
    this.items.next(items);
  }

  /**
   * Add multiple items
   */
  addItems(items: T[]): void {
    const currentItems = this.items.value;
    this.items.next([...currentItems, ...items]);
  }

  /**
   * Clear all items
   */
  clearItems(): void {
    this.items.next([]);
  }

  /**
   * Get current items value
   */
  getCurrentItems(): T[] {
    return this.items.value;
  }

  /**
   * Check if item exists
   */
  exists(id: string | number): boolean {
    return this.items.value.some(item => item.id === id);
  }

  /**
   * Get count of items
   */
  getCount(): number {
    return this.items.value.length;
  }

  /**
   * Get first item
   */
  getFirst(): T | null {
    const items = this.items.value;
    return items.length > 0 ? items[0] : null;
  }

  /**
   * Get last item
   */
  getLast(): T | null {
    const items = this.items.value;
    return items.length > 0 ? items[items.length - 1] : null;
  }

  /**
   * Find item by predicate
   */
  find(predicate: (item: T) => boolean): T | null {
    return this.items.value.find(predicate) || null;
  }

  /**
   * Find index of item
   */
  findIndex(predicate: (item: T) => boolean): number {
    return this.items.value.findIndex(predicate);
  }

  /**
   * Check if any item matches predicate
   */
  some(predicate: (item: T) => boolean): boolean {
    return this.items.value.some(predicate);
  }

  /**
   * Check if all items match predicate
   */
  every(predicate: (item: T) => boolean): boolean {
    return this.items.value.every(predicate);
  }

  /**
   * Map items using transform function
   */
  map<R>(transform: (item: T) => R): R[] {
    return this.items.value.map(transform);
  }

  /**
   * Reduce items using reducer function
   */
  reduce<R>(reducer: (acc: R, item: T) => R, initialValue: R): R {
    return this.items.value.reduce(reducer, initialValue);
  }

  // Protected methods for internal use
  protected setLoading(loading: boolean): void {
    this.loading.next(loading);
  }

  protected setError(error: string): void {
    this.error.next(error);
  }

  protected clearError(): void {
    this.error.next(null);
  }

  protected handleError(error: any): Observable<never> {
    this.setError(error.message || 'An error occurred');
    this.setLoading(false);
    return throwError(() => error);
  }

  protected generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Utility methods
  public reset(): void {
    this.clearItems();
    this.clearError();
    this.setLoading(false);
  }

  public getState() {
    return {
      items: this.items.value,
      loading: this.loading.value,
      error: this.error.value,
      count: this.getCount()
    };
  }
} 