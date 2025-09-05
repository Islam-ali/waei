# Angular Generic Architecture

هذا الملف يوثق البنية العامة (Generic Architecture) المبنية باستخدام Angular و TypeScript.

## 📁 هيكل المشروع

```
src/app/core/
├── models/
│   ├── base-entity.model.ts
│   ├── pagination.model.ts
│   ├── api-response.model.ts
│   ├── user.model.ts
│   └── index.ts
├── services/
│   ├── generic-api.service.ts
│   ├── generic-state.service.ts
│   ├── user.service.ts
│   └── index.ts
├── interceptors/
│   ├── loading.interceptor.ts
│   ├── auth.interceptor.ts
│   ├── error.interceptor.ts
│   └── index.ts
├── config/
│   └── app.config.ts
└── README.md
```

## 🏗️ المكونات الأساسية

### 1. Generic Models

#### BaseEntity
```typescript
export interface BaseEntity {
  id: string | number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### PaginationParams & PaginatedResponse
```typescript
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

#### ApiResponse
```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  statusCode?: number;
}
```

### 2. GenericApiService

خدمة عامة للتعامل مع API تدعم:
- ✅ GET, POST, PUT, PATCH, DELETE
- ✅ Upload & Download
- ✅ Pagination
- ✅ Query Parameters
- ✅ Timeout & Retry
- ✅ Error Handling

```typescript
@Injectable()
export class GenericApiService<T extends BaseEntity> {
  // Methods:
  getById(id: string | number): Observable<ApiResponse<T>>
  getAll(params?: Record<string, any>): Observable<ApiResponse<T[]>>
  getPaginated(paginationParams: PaginationParams): Observable<ApiResponse<PaginatedResponse<T>>>
  create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<T>>
  update(id: string | number, item: Partial<T>): Observable<ApiResponse<T>>
  patch(id: string | number, updates: Partial<T>): Observable<ApiResponse<T>>
  delete(id: string | number): Observable<ApiResponse<boolean>>
  upload(file: File, additionalData?: Record<string, any>): Observable<ApiResponse<T>>
  download(id: string | number, filename?: string): Observable<Blob>
  query(endpoint: string, params?: Record<string, any>): Observable<ApiResponse<any>>
  post(endpoint: string, data: any): Observable<ApiResponse<any>>
}
```

### 3. GenericStateService

خدمة إدارة الحالة المحلية تدعم:
- ✅ CRUD Operations
- ✅ Search & Filter
- ✅ Sort & Pagination
- ✅ Loading & Error States
- ✅ Reactive State Management

```typescript
@Injectable()
export class GenericStateService<T extends BaseEntity> {
  // Selectors:
  readonly items$: Observable<T[]>
  readonly selectedItem$: Observable<T | null>
  readonly loading$: Observable<boolean>
  readonly error$: Observable<string | null>
  readonly pagination$: Observable<PaginatedResponse<T> | null>
  readonly filteredItems$: Observable<T[]>

  // Actions:
  setLoading(loading: boolean): void
  setError(error: string | null): void
  setItems(items: T[]): void
  addItem(item: T): void
  updateItem(updatedItem: T): void
  removeItem(id: string | number): void
  setSelectedItem(item: T | null): void
  setPagination(pagination: PaginatedResponse<T> | null): void
  setFilters(filters: Record<string, any>): void
  setSorting(sortBy: string | null, sortOrder: 'asc' | 'desc' | null): void
  setSearchTerm(searchTerm: string | null): void
  resetState(): void
}
```

### 4. Interceptors

#### LoadingInterceptor
- يدير حالة التحميل العامة
- عداد للطلبات المتزامنة
- يمكن تحديد URLs للتحميل أو تجاهلها

#### AuthInterceptor
- يضيف token تلقائياً للطلبات
- يدعم localStorage و sessionStorage
- يمكن تحديد URLs لتجاهل المصادقة

#### ErrorInterceptor
- يدير الأخطاء العامة
- رسائل خطأ مخصصة حسب نوع الخطأ
- معالجة خاصة للأخطاء 401, 403, 500

## 🚀 كيفية الاستخدام

### 1. إنشاء Model جديد

```typescript
// product.model.ts
import { BaseEntity } from './base-entity.model';

export interface Product extends BaseEntity {
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  isActive: boolean;
}
```

### 2. إنشاء Service جديد

```typescript
// product.service.ts
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { GenericApiService } from './generic-api.service';
import { GenericStateService } from './generic-state.service';
import { Product } from '../models/product.model';
import { ApiResponse } from '../models/api-response.model';
import { PaginationParams, PaginatedResponse } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiService: GenericApiService<Product>;
  private stateService: GenericStateService<Product>;

  constructor(
    private http: HttpClient,
    @Inject('API_BASE_URL') private baseUrl: string
  ) {
    this.apiService = new GenericApiService<Product>(http, `${baseUrl}/products`);
    this.stateService = new GenericStateService<Product>();
  }

  // State selectors
  get products$() { return this.stateService.items$; }
  get selectedProduct$() { return this.stateService.selectedItem$; }
  get loading$() { return this.stateService.loading$; }
  get error$() { return this.stateService.error$; }
  get filteredProducts$() { return this.stateService.filteredItems$; }

  // Load products
  loadProducts(params?: Record<string, any>): Observable<ApiResponse<Product[]>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.getAll(params).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.setItems(response.data);
        } else {
          this.stateService.setError(response.error || 'Failed to load products');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Create product
  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Product>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.create(productData).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.addItem(response.data);
        } else {
          this.stateService.setError(response.error || 'Failed to create product');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Update product
  updateProduct(id: string | number, updates: Partial<Product>): Observable<ApiResponse<Product>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.update(id, updates).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.updateItem(response.data);
        } else {
          this.stateService.setError(response.error || 'Failed to update product');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Delete product
  deleteProduct(id: string | number): Observable<ApiResponse<boolean>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.delete(id).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.removeItem(id);
        } else {
          this.stateService.setError(response.error || 'Failed to delete product');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // State management
  setSelectedProduct(product: Product | null): void {
    this.stateService.setSelectedItem(product);
  }

  setSearchTerm(searchTerm: string | null): void {
    this.stateService.setSearchTerm(searchTerm);
  }

  setFilters(filters: Record<string, any>): void {
    this.stateService.setFilters(filters);
  }

  clearFilters(): void {
    this.stateService.clearFilters();
  }
}
```

### 3. استخدام Service في Component

```typescript
// product-list.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-6">
      <!-- Search -->
      <div class="mb-6">
        <input
          type="text"
          [formControl]="searchControl"
          placeholder="البحث في المنتجات..."
          class="w-full px-3 py-2 border border-gray-200 rounded-md"
        />
      </div>

      <!-- Loading -->
      <div *ngIf="loading$ | async" class="text-center py-8">
        جاري التحميل...
      </div>

      <!-- Error -->
      <div *ngIf="error$ | async as error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {{ error }}
      </div>

      <!-- Products List -->
      <div *ngIf="!(loading$ | async)" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let product of filteredProducts$ | async" class="bg-white rounded-lg shadow p-6">
          <h3 class="text-lg font-semibold">{{ product.name }}</h3>
          <p class="text-gray-600">{{ product.description }}</p>
          <p class="text-lg font-bold text-green-600">{{ product.price | currency }}</p>
          <div class="mt-4 flex gap-2">
            <button (click)="editProduct(product)" class="bg-blue-500 text-white px-4 py-2 rounded">
              تعديل
            </button>
            <button (click)="deleteProduct(product.id)" class="bg-red-500 text-white px-4 py-2 rounded">
              حذف
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit, OnDestroy {
  // Observables
  products$ = this.productService.products$;
  selectedProduct$ = this.productService.selectedProduct$;
  loading$ = this.productService.loading$;
  error$ = this.productService.error$;
  filteredProducts$ = this.productService.filteredProducts$;

  // Form controls
  searchControl = this.fb.control('');

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setupSearch();
    this.loadProducts();
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
        this.productService.setSearchTerm(searchTerm);
      });
  }

  loadProducts(): void {
    this.productService.loadProducts();
  }

  editProduct(product: Product): void {
    this.productService.setSelectedProduct(product);
    // Open edit modal or navigate to edit page
  }

  deleteProduct(productId: string | number): void {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      this.productService.deleteProduct(productId).subscribe();
    }
  }
}
```

## ⚙️ الإعداد

### 1. تحديث app.config.ts

```typescript
import { ApplicationConfig, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { LoadingInterceptor } from './core/interceptors/loading.interceptor';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        LoadingInterceptor,
        AuthInterceptor,
        ErrorInterceptor
      ])
    ),
    {
      provide: 'API_BASE_URL',
      useValue: 'https://your-api-url.com'
    },
    {
      provide: 'BASE_URL',
      useValue: 'https://your-api-url.com'
    }
  ]
};
```

### 2. تحديث main.ts

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/core/config/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));
```

## 🔧 الميزات المتقدمة

### 1. Bulk Operations
```typescript
// في Service
bulkUpdateProducts(productIds: (string | number)[], updates: Partial<Product>): Observable<ApiResponse<Product[]>> {
  return this.apiService.post('bulk-update', { productIds, updates });
}

bulkDeleteProducts(productIds: (string | number)[]): Observable<ApiResponse<boolean>> {
  return this.apiService.post('bulk-delete', { productIds });
}
```

### 2. Custom Queries
```typescript
// في Service
getProductsByCategory(category: string): Observable<ApiResponse<Product[]>> {
  return this.apiService.query('by-category', { category });
}

getActiveProducts(): Observable<ApiResponse<Product[]>> {
  return this.apiService.query('active');
}
```

### 3. File Upload/Download
```typescript
// Upload
uploadProductImage(productId: string | number, file: File): Observable<ApiResponse<Product>> {
  return this.apiService.upload(file, { productId });
}

// Download
downloadProductReport(productId: string | number): Observable<Blob> {
  return this.apiService.download(productId, 'product-report.pdf');
}
```

## 📝 ملاحظات مهمة

1. **Type Safety**: جميع الخدمات تستخدم TypeScript generics لضمان type safety
2. **Error Handling**: معالجة شاملة للأخطاء مع رسائل مخصصة
3. **Loading States**: إدارة حالة التحميل تلقائياً
4. **Reactive Programming**: استخدام RxJS للبرمجة التفاعلية
5. **Scalability**: البنية قابلة للتوسع بسهولة
6. **Maintainability**: كود منظم وقابل للصيانة

## 🎯 المزايا

- ✅ **Generic & Reusable**: يمكن استخدامها مع أي entity
- ✅ **Type Safe**: TypeScript generics لضمان الأمان
- ✅ **Reactive**: RxJS للبرمجة التفاعلية
- ✅ **Scalable**: قابلة للتوسع بسهولة
- ✅ **Maintainable**: كود منظم وقابل للصيانة
- ✅ **Error Handling**: معالجة شاملة للأخطاء
- ✅ **Loading States**: إدارة حالة التحميل
- ✅ **Pagination**: دعم الصفحات
- ✅ **Search & Filter**: بحث وتصفية
- ✅ **Sort**: ترتيب البيانات
- ✅ **File Operations**: رفع وتنزيل الملفات
- ✅ **Bulk Operations**: عمليات مجمعة
- ✅ **Custom Queries**: استعلامات مخصصة

## 🔄 التحديثات المستقبلية

- [ ] إضافة دعم للـ WebSocket
- [ ] إضافة دعم للـ Caching
- [ ] إضافة دعم للـ Offline Mode
- [ ] إضافة دعم للـ Real-time Updates
- [ ] إضافة دعم للـ Analytics
- [ ] إضافة دعم للـ Logging
- [ ] إضافة دعم للـ Performance Monitoring 