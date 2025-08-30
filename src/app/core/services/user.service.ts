import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { GenericApiService } from './generic-api.service';
import { GenericStateService } from './generic-state.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../../models/user.model';
import { ApiResponse } from '../../models/api-response.model';
import { PaginationParams, PaginatedResponse } from '../../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiService: GenericApiService<User>;
  private stateService: GenericStateService<User>;

  constructor(
    private http: HttpClient
  ) {
    this.apiService = new GenericApiService<User>();
    this.stateService = new GenericStateService<User>();
  }

  // State selectors
  get users$() { return this.stateService.items$; }
  get selectedUser$() { return this.stateService.selectedItem$; }
  get loading$() { return this.stateService.loading$; }
  get error$() { return this.stateService.error$; }
  get pagination$() { return this.stateService.pagination$; }
  get filteredUsers$() { return this.stateService.filteredItems$; }

  // Load all users
  loadUsers(params?: Record<string, any>): Observable<ApiResponse<User[]>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.getAll('users', params).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.setItems(response.data);
        } else {
          this.stateService.setError(response.error || 'Failed to load users');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Load paginated users
  loadPaginatedUsers(paginationParams: PaginationParams): Observable<ApiResponse<PaginatedResponse<User>>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.getPaginated('users', paginationParams).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.setItems(response.data.data);
          this.stateService.setPagination(response.data);
        } else {
          this.stateService.setError(response.error || 'Failed to load users');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Get user by ID
  getUserById(id: string | number): Observable<ApiResponse<User>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.getById('users', id).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.setSelectedItem(response.data);
        } else {
          this.stateService.setError(response.error || 'Failed to load user');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Create new user
  createUser(userData: CreateUserRequest): Observable<ApiResponse<User>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.create('users', userData as any).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.addItem(response.data);
        } else {
          this.stateService.setError(response.error || 'Failed to create user');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Update user
  updateUser(id: string | number, updates: UpdateUserRequest): Observable<ApiResponse<User>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.update('users', id, updates).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.updateItem(response.data);
          this.stateService.setSelectedItem(response.data);
        } else {
          this.stateService.setError(response.error || 'Failed to update user');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Delete user
  deleteUser(id: string | number): Observable<ApiResponse<boolean>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.delete('users', id).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.removeItem(id);
          this.stateService.setSelectedItem(null);
        } else {
          this.stateService.setError(response.error || 'Failed to delete user');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Upload user avatar
  uploadAvatar(userId: string | number, file: File): Observable<ApiResponse<User>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.upload('users', file, { userId }).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.updateItem(response.data);
          this.stateService.setSelectedItem(response.data);
        } else {
          this.stateService.setError(response.error || 'Failed to upload avatar');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // State management methods
  setSelectedUser(user: User | null): void {
    this.stateService.setSelectedItem(user);
  }

  setSearchTerm(searchTerm: string | null): void {
    this.stateService.setSearchTerm(searchTerm);
  }

  setFilters(filters: Record<string, any>): void {
    this.stateService.setFilters(filters);
  }

  addFilter(key: string, value: any): void {
    this.stateService.addFilter(key, value);
  }

  removeFilter(key: string): void {
    this.stateService.removeFilter(key);
  }

  clearFilters(): void {
    this.stateService.clearFilters();
  }

  setSorting(sortBy: string | null, sortOrder: 'asc' | 'desc' | null): void {
    this.stateService.setSorting(sortBy, sortOrder);
  }

  resetState(): void {
    this.stateService.resetState();
  }

  // Custom queries
  getUsersByRole(role: string): Observable<ApiResponse<User[]>> {
    return this.apiService.query('by-role', { role });
  }

  getActiveUsers(): Observable<ApiResponse<User[]>> {
    return this.apiService.query('active');
  }

  // Bulk operations
  bulkUpdateUsers(userIds: (string | number)[], updates: UpdateUserRequest): Observable<ApiResponse<User[]>> {
    return this.apiService.post('bulk-update', { userIds, updates });
  }

  bulkDeleteUsers(userIds: (string | number)[]): Observable<ApiResponse<boolean>> {
    return this.apiService.post('bulk-delete', { userIds });
  }
} 