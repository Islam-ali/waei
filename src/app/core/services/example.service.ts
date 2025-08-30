import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { 
  GenericService, 
  BaseEntity, 
  PaginationParams, 
  PaginatedResponse 
} from './generic.service';
import { 
  GenericApiService, 
  ApiConfig, 
  QueryParams 
} from './generic-api.service';

// Example entity interface
export interface User extends BaseEntity {
  name: string;
  email: string;
  age: number;
  isActive: boolean;
  role: 'admin' | 'user' | 'moderator';
  avatar?: string;
}

// Example API response interface
export interface UserApiResponse {
  success: boolean;
  data: User;
  message?: string;
}

export interface UsersApiResponse {
  success: boolean;
  data: User[];
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService<User> {
  constructor() {
    super();
    
    // Initialize with some sample data
    this.setItems([
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true,
        role: 'admin',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        age: 25,
        isActive: true,
        role: 'user',
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
      }
    ]);
  }

  // Custom methods specific to User entity
  getActiveUsers(): Observable<User[]> {
    return this.filter(user => user.isActive);
  }

  getUsersByRole(role: User['role']): Observable<User[]> {
    return this.filter(user => user.role === role);
  }

  getUsersByAgeRange(minAge: number, maxAge: number): Observable<User[]> {
    return this.filter(user => user.age >= minAge && user.age <= maxAge);
  }

  searchUsersByName(name: string): Observable<User[]> {
    return this.filter(user => 
      user.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  getAdmins(): Observable<User[]> {
    return this.getUsersByRole('admin');
  }

  getRegularUsers(): Observable<User[]> {
    return this.getUsersByRole('user');
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService extends GenericApiService<User> {
  constructor() {
    super();
    
    // Initialize with API configuration
    this.initialize({
      baseUrl: 'https://api.example.com',
      endpoint: 'users',
      timeout: 10000,
      retryCount: 2
    });
  }

  // Custom API methods specific to User entity
  getUsersByRole(role: User['role']): Observable<User[]> {
    return this.filter({ role });
  }

  getActiveUsers(): Observable<User[]> {
    return this.filter({ isActive: true });
  }

  getUserProfile(userId: string): Observable<User> {
    return this.getById(userId, 'profile');
  }

  updateUserProfile(userId: string, profile: Partial<User>): Observable<User> {
    return this.patch(userId, profile, 'profile');
  }

  uploadUserAvatar(userId: string, file: File): Observable<any> {
    return this.upload(file, 'avatar', `${userId}/avatar`);
  }

  getUserPosts(userId: string, pagination: PaginationParams): Observable<PaginatedResponse<any>> {
    return this.getPaginated(pagination, `${userId}/posts`);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.search(query);
  }

  getUsersWithFilters(filters: {
    role?: User['role'];
    isActive?: boolean;
    minAge?: number;
    maxAge?: number;
  }): Observable<User[]> {
    const queryParams: QueryParams = {};
    
    if (filters.role) queryParams['role'] = filters.role;
    if (filters.isActive !== undefined) queryParams['isActive'] = filters.isActive;
    if (filters.minAge) queryParams['minAge'] = filters.minAge;
    if (filters.maxAge) queryParams['maxAge'] = filters.maxAge;
    
    return this.filter(queryParams);
  }

  // Example of custom request with specific headers
  getUsersWithCustomHeaders(): Observable<User[]> {
    return this.getAll(undefined, undefined, {
      headers: new Headers({
        'X-Custom-Header': 'custom-value',
        'Accept-Language': 'en-US'
      }) as any
    });
  }

  // Example of bulk operations
  createMultipleUsers(users: Omit<User, 'id' | 'createdAt' | 'updatedAt'>[]): Observable<User[]> {
    return this.post(users, 'bulk');
  }

  deleteMultipleUsers(userIds: string[]): Observable<any> {
    return this.post({ userIds }, 'bulk-delete');
  }

  // Example of file download
  exportUsers(format: 'csv' | 'excel' = 'csv'): Observable<Blob> {
    return this.download('export', { format });
  }
}

// Example of how to use both services together
@Injectable({
  providedIn: 'root'
})
export class UserManagerService {
  constructor(
    private userService: UserService,
    private userApiService: UserApiService
  ) {}

  // Sync local data with API
  syncUsers(): Observable<User[]> {
    return new Observable(observer => {
      this.userApiService.getAll().subscribe({
        next: (users) => {
          this.userService.setItems(users);
          observer.next(users);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // Create user both locally and on API
  createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    return new Observable(observer => {
      this.userApiService.post(userData).subscribe({
        next: (user) => {
          this.userService.addItems([user]);
          observer.next(user);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // Update user both locally and on API
  updateUser(userId: string, updates: Partial<User>): Observable<User | null> {
    return new Observable(observer => {
      this.userApiService.put(userId, updates).subscribe({
        next: (user) => {
          this.userService.update(userId, user);
          observer.next(user);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }

  // Delete user both locally and on API
  deleteUser(userId: string): Observable<boolean> {
    return new Observable(observer => {
      this.userApiService.delete(userId).subscribe({
        next: () => {
          this.userService.delete(userId);
          observer.next(true);
          observer.complete();
        },
        error: (error) => {
          observer.error(error);
        }
      });
    });
  }
} 