import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { BaseEntity } from '../../models/base-entity.model';
import { PaginatedResponse } from '../../models/pagination.model';

export interface State<T extends BaseEntity> {
  items: T[];
  selectedItem: T | null;
  loading: boolean;
  error: string | null;
  pagination: PaginatedResponse<T> | null;
  filters: Record<string, any>;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc' | null;
  searchTerm: string | null;
}

const initialState: State<any> = {
  items: [],
  selectedItem: null,
  loading: false,
  error: null,
  pagination: null,
  filters: {},
  sortBy: null,
  sortOrder: null,
  searchTerm: null
};

@Injectable({
  providedIn: 'root'
})
export class GenericStateService<T extends BaseEntity> {
  private state = new BehaviorSubject<State<T>>(initialState as State<T>);
  private state$ = this.state.asObservable();

  // Selectors
  readonly items$ = this.state$.pipe(
    map(state => state.items),
    distinctUntilChanged()
  );

  readonly selectedItem$ = this.state$.pipe(
    map(state => state.selectedItem),
    distinctUntilChanged()
  );

  readonly loading$ = this.state$.pipe(
    map(state => state.loading),
    distinctUntilChanged()
  );

  readonly error$ = this.state$.pipe(
    map(state => state.error),
    distinctUntilChanged()
  );

  readonly pagination$ = this.state$.pipe(
    map(state => state.pagination),
    distinctUntilChanged()
  );

  readonly filters$ = this.state$.pipe(
    map(state => state.filters),
    distinctUntilChanged()
  );

  readonly sortBy$ = this.state$.pipe(
    map(state => state.sortBy),
    distinctUntilChanged()
  );

  readonly sortOrder$ = this.state$.pipe(
    map(state => state.sortOrder),
    distinctUntilChanged()
  );

  readonly searchTerm$ = this.state$.pipe(
    map(state => state.searchTerm),
    distinctUntilChanged()
  );

  // Computed selectors
  readonly filteredItems$ = combineLatest([
    this.items$,
    this.filters$,
    this.searchTerm$,
    this.sortBy$,
    this.sortOrder$
  ]).pipe(
    map(([items, filters, searchTerm, sortBy, sortOrder]) => {
      let filteredItems = [...items];

      // Apply search filter
      if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
          Object.values(item).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      // Apply custom filters
      if (filters && Object.keys(filters).length > 0) {
        filteredItems = filteredItems.filter(item => {
          return Object.keys(filters).every(key => {
            const filterValue = filters[key];
            const itemValue = (item as any)[key];
            
            if (filterValue === null || filterValue === undefined) return true;
            if (typeof filterValue === 'string') {
              return itemValue?.toString().toLowerCase().includes(filterValue.toLowerCase());
            }
            return itemValue === filterValue;
          });
        });
      }

      // Apply sorting
      if (sortBy && sortOrder) {
        filteredItems.sort((a, b) => {
          const aValue = (a as any)[sortBy];
          const bValue = (b as any)[sortBy];
          
          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return filteredItems;
    })
  );

  // Actions
  setLoading(loading: boolean): void {
    this.updateState({ loading });
  }

  setError(error: string | null): void {
    this.updateState({ error });
  }

  setItems(items: T[]): void {
    this.updateState({ items });
  }

  addItem(item: T): void {
    const currentItems = this.state.value.items;
    this.updateState({ items: [...currentItems, item] });
  }

  updateItem(updatedItem: T): void {
    const currentItems = this.state.value.items;
    const updatedItems = currentItems.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.updateState({ items: updatedItems });
  }

  removeItem(id: string | number): void {
    const currentItems = this.state.value.items;
    const updatedItems = currentItems.filter(item => item.id !== id);
    this.updateState({ items: updatedItems });
  }

  setSelectedItem(item: T | null): void {
    this.updateState({ selectedItem: item });
  }

  setPagination(pagination: PaginatedResponse<T> | null): void {
    this.updateState({ pagination });
  }

  setFilters(filters: Record<string, any>): void {
    this.updateState({ filters });
  }

  addFilter(key: string, value: any): void {
    const currentFilters = this.state.value.filters;
    this.updateState({ filters: { ...currentFilters, [key]: value } });
  }

  removeFilter(key: string): void {
    const currentFilters = this.state.value.filters;
    const { [key]: removed, ...remainingFilters } = currentFilters;
    this.updateState({ filters: remainingFilters });
  }

  clearFilters(): void {
    this.updateState({ filters: {} });
  }

  setSorting(sortBy: string | null, sortOrder: 'asc' | 'desc' | null): void {
    this.updateState({ sortBy, sortOrder });
  }

  setSearchTerm(searchTerm: string | null): void {
    this.updateState({ searchTerm });
  }

  resetState(): void {
    this.state.next(initialState as State<T>);
  }

  // Helper method to update state
  private updateState(partial: Partial<State<T>>): void {
    this.state.next({ ...this.state.value, ...partial });
  }

  // Get current state snapshot
  getState(): State<T> {
    return this.state.value;
  }
} 