import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, finalize } from 'rxjs';
import { GenericApiService } from './generic-api.service';
import { GenericStateService } from './generic-state.service';
import { Product, CreateProductRequest, UpdateProductRequest } from '../../models/product.model';
import { ApiResponse } from '../../models/api-response.model';
import { PaginationParams, PaginatedResponse } from '../../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiService: GenericApiService<Product>;
  private stateService: GenericStateService<Product>;

  constructor(
    private http: HttpClient
  ) {
    this.apiService = new GenericApiService<Product>();
    this.stateService = new GenericStateService<Product>();
  }

  // State selectors
  get products$() { return this.stateService.items$; }
  get selectedProduct$() { return this.stateService.selectedItem$; }
  get loading$() { return this.stateService.loading$; }
  get error$() { return this.stateService.error$; }
  get pagination$() { return this.stateService.pagination$; }
  get filteredProducts$() { return this.stateService.filteredItems$; }

  // Load all products
  loadProducts(params?: Record<string, any>): Observable<ApiResponse<Product[]>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.getAll('products', params).pipe(
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

  // Load paginated products
  loadPaginatedProducts(paginationParams: PaginationParams): Observable<ApiResponse<PaginatedResponse<Product>>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.getPaginated('products', paginationParams).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.setItems(response.data.data);
          this.stateService.setPagination(response.data);
        } else {
          this.stateService.setError(response.error || 'Failed to load products');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Get product by ID
  getProductById(id: string | number): Observable<ApiResponse<Product>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.getById('products', id).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.setSelectedItem(response.data);
        } else {
          this.stateService.setError(response.error || 'Failed to load product');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Create new product
  createProduct(productData: CreateProductRequest): Observable<ApiResponse<Product>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.create('products', productData as any).pipe(
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
  updateProduct(id: string | number, updates: UpdateProductRequest): Observable<ApiResponse<Product>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.update('products', id, updates).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.updateItem(response.data);
          this.stateService.setSelectedItem(response.data);
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

    return this.apiService.delete('products', id).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.removeItem(id);
          this.stateService.setSelectedItem(null);
        } else {
          this.stateService.setError(response.error || 'Failed to delete product');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Upload product image
  uploadProductImage(productId: string | number, file: File): Observable<ApiResponse<Product>> {
    this.stateService.setLoading(true);
    this.stateService.setError(null);

    return this.apiService.upload('products', file, { productId }).pipe(
      tap(response => {
        if (response.success) {
          this.stateService.updateItem(response.data);
          this.stateService.setSelectedItem(response.data);
        } else {
          this.stateService.setError(response.error || 'Failed to upload image');
        }
      }),
      finalize(() => this.stateService.setLoading(false))
    );
  }

  // Download product report
  downloadProductReport(productId: string | number): Observable<Blob> {
    return this.apiService.download('products', productId, 'product-report.pdf');
  }

  // State management methods
  setSelectedProduct(product: Product | null): void {
    this.stateService.setSelectedItem(product);
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
  getProductsByCategory(category: string): Observable<ApiResponse<Product[]>> {
    return this.apiService.query('by-category', { category });
  }

  getActiveProducts(): Observable<ApiResponse<Product[]>> {
    return this.apiService.query('active');
  }

  getProductsByPriceRange(minPrice: number, maxPrice: number): Observable<ApiResponse<Product[]>> {
    return this.apiService.query('by-price-range', { minPrice, maxPrice });
  }

  getProductsByTags(tags: string[]): Observable<ApiResponse<Product[]>> {
    return this.apiService.query('by-tags', { tags: tags.join(',') });
  }

  // Bulk operations
  bulkUpdateProducts(productIds: (string | number)[], updates: UpdateProductRequest): Observable<ApiResponse<Product[]>> {
    return this.apiService.post('bulk-update', { productIds, updates });
  }

  bulkDeleteProducts(productIds: (string | number)[]): Observable<ApiResponse<boolean>> {
    return this.apiService.post('bulk-delete', { productIds });
  }

  bulkUpdateStock(productIds: (string | number)[], stockChange: number): Observable<ApiResponse<Product[]>> {
    return this.apiService.post('bulk-update-stock', { productIds, stockChange });
  }

  // Inventory management
  updateStock(productId: string | number, quantity: number, operation: 'add' | 'subtract'): Observable<ApiResponse<Product>> {
    return this.apiService.post('update-stock', { productId, quantity, operation });
  }

  getLowStockProducts(threshold: number = 10): Observable<ApiResponse<Product[]>> {
    return this.apiService.query('low-stock', { threshold });
  }

  // Analytics
  getProductAnalytics(productId: string | number, period: 'daily' | 'weekly' | 'monthly'): Observable<ApiResponse<any>> {
    return this.apiService.query('analytics', { productId, period });
  }

  getCategoryAnalytics(category: string): Observable<ApiResponse<any>> {
    return this.apiService.query('category-analytics', { category });
  }
} 