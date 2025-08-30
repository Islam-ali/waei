import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { User, CreateUserRequest, UpdateUserRequest } from '../../../core/models/user.model';
import { PaginationParams } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
        <p class="text-gray-600 mt-2">إدارة جميع المستخدمين في النظام</p>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">البحث</label>
            <input
              type="text"
              [formControl]="searchControl"
              placeholder="البحث في المستخدمين..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Role Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الدور</label>
            <select
              [formControl]="roleFilterControl"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الأدوار</option>
              <option value="admin">مدير</option>
              <option value="user">مستخدم</option>
              <option value="moderator">مشرف</option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">الحالة</label>
            <select
              [formControl]="statusFilterControl"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الحالات</option>
              <option value="true">نشط</option>
              <option value="false">غير نشط</option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-between items-center mt-4">
          <div class="flex gap-2">
            <button
              (click)="clearFilters()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              مسح الفلاتر
            </button>
            <button
              (click)="loadUsers()"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              تحديث
            </button>
          </div>
          <button
            (click)="openCreateModal()"
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            إضافة مستخدم جديد
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading$ | async" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span class="ml-2 text-gray-600">جاري التحميل...</span>
      </div>

      <!-- Error State -->
      <div *ngIf="error$ | async as error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">خطأ</h3>
            <div class="mt-2 text-sm text-red-700">{{ error }}</div>
          </div>
        </div>
      </div>

      <!-- Users Table -->
      <div *ngIf="!(loading$ | async)" class="bg-white rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                المستخدم
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                البريد الإلكتروني
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الدور
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاريخ الإنشاء
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let user of filteredUsers$ | async" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <img
                      *ngIf="user.avatar"
                      [src]="user.avatar"
                      [alt]="user.firstName"
                      class="h-10 w-10 rounded-full"
                    />
                    <div
                      *ngIf="!user.avatar"
                      class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
                    >
                      <span class="text-sm font-medium text-gray-700">
                        {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                      </span>
                    </div>
                  </div>
                  <div class="mr-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ user.firstName }} {{ user.lastName }}
                    </div>
                    <div class="text-sm text-gray-500" *ngIf="user.phone">
                      {{ user.phone }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ user.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  [class]="getRoleBadgeClass(user.role)"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ getRoleLabel(user.role) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  [class]="user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                >
                  {{ user.isActive ? 'نشط' : 'غير نشط' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ user.createdAt | date:'short' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  (click)="editUser(user)"
                  class="text-blue-600 hover:text-blue-900 ml-4"
                >
                  تعديل
                </button>
                <button
                  (click)="deleteUser(user.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  حذف
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div *ngIf="(filteredUsers$ | async)?.length === 0" class="text-center py-12">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">لا توجد مستخدمين</h3>
          <p class="mt-1 text-sm text-gray-500">ابدأ بإضافة مستخدم جديد.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div *ngIf="pagination$ | async as pagination" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            (click)="previousPage()"
            [disabled]="pagination.page <= 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            السابق
          </button>
          <button
            (click)="nextPage()"
            [disabled]="pagination.page >= pagination.totalPages"
            class="mr-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            التالي
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              عرض
              <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
              إلى
              <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
              من
              <span class="font-medium">{{ pagination.total }}</span>
              نتائج
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                (click)="previousPage()"
                [disabled]="pagination.page <= 1"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              <button
                (click)="nextPage()"
                [disabled]="pagination.page >= pagination.totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  `
  styles: []
})
export class UserManagementComponent implements OnInit, OnDestroy {
  // Observables
  users$ = this.userService.users$;
  selectedUser$ = this.userService.selectedUser$;
  loading$ = this.userService.loading$;
  error$ = this.userService.error$;
  pagination$ = this.userService.pagination$;
  filteredUsers$ = this.userService.filteredUsers$;

  // Form controls
  searchControl = this.fb.control('');
  roleFilterControl = this.fb.control('');
  statusFilterControl = this.fb.control('');

  // Pagination
  currentPage = 1;
  pageSize = 10;

  // Utility
  Math = Math;

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setupSearch();
    this.setupFilters();
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.userService.setSearchTerm(searchTerm);
      });
  }

  private setupFilters(): void {
    // Role filter
    this.roleFilterControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(role => {
        if (role) {
          this.userService.addFilter('role', role);
        } else {
          this.userService.removeFilter('role');
        }
      });

    // Status filter
    this.statusFilterControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        if (status !== '') {
          this.userService.addFilter('isActive', status === 'true');
        } else {
          this.userService.removeFilter('isActive');
        }
      });
  }

  loadUsers(): void {
    const paginationParams: PaginationParams = {
      page: this.currentPage,
      limit: this.pageSize
    };
    this.userService.loadPaginatedUsers(paginationParams);
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.roleFilterControl.setValue('');
    this.statusFilterControl.setValue('');
    this.userService.clearFilters();
  }

  openCreateModal(): void {
    // Implementation for opening create modal
    console.log('Open create modal');
  }

  editUser(user: User): void {
    this.userService.setSelectedUser(user);
    // Implementation for opening edit modal
    console.log('Edit user:', user);
  }

  deleteUser(userId: string | number): void {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      this.userService.deleteUser(userId).subscribe();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.loadUsers();
  }

  getRoleLabel(role: string): string {
    const roleLabels: Record<string, string> = {
      admin: 'مدير',
      user: 'مستخدم',
      moderator: 'مشرف'
    };
    return roleLabels[role] || role;
  }

  getRoleBadgeClass(role: string): string {
    const roleClasses: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      user: 'bg-blue-100 text-blue-800',
      moderator: 'bg-yellow-100 text-yellow-800'
    };
    return roleClasses[role] || 'bg-gray-100 text-gray-800';
  }
} 