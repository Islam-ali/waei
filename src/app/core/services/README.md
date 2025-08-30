# Generic Services Documentation

This directory contains generic services that provide common functionality for managing data and API interactions in Angular applications.

## Services Overview

### 1. GenericService<T>
A generic service that provides common CRUD operations and data management functionality for any entity type.

### 2. GenericApiService<T>
A generic service that handles HTTP requests with proper error handling, interceptors, and common API operations.

## Quick Start

### 1. Define Your Entity

```typescript
import { BaseEntity } from './core/services/generic.service';

export interface Product extends BaseEntity {
  name: string;
  price: number;
  category: string;
  description?: string;
}
```

### 2. Create a Local Service

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from './core/services/generic.service';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends GenericService<Product> {
  constructor() {
    super();
    
    // Initialize with sample data
    this.setItems([
      {
        id: '1',
        name: 'Laptop',
        price: 999.99,
        category: 'Electronics',
        description: 'High-performance laptop',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  }

  // Custom methods specific to Product
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.filter(product => product.category === category);
  }

  getExpensiveProducts(minPrice: number): Observable<Product[]> {
    return this.filter(product => product.price >= minPrice);
  }
}
```

### 3. Create an API Service

```typescript
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericApiService } from './core/services/generic-api.service';
import { Product } from './models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService extends GenericApiService<Product> {
  constructor() {
    super();
    
    // Initialize with API configuration
    this.initialize({
      baseUrl: 'https://api.example.com',
      endpoint: 'products',
      timeout: 10000,
      retryCount: 3
    });
  }

  // Custom API methods
  getProductsByCategory(category: string): Observable<Product[]> {
    return this.filter({ category });
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.search(query);
  }
}
```

## GenericService Features

### Basic CRUD Operations

```typescript
// Get all items
this.productService.getAll().subscribe(products => {
  console.log('All products:', products);
});

// Get item by ID
this.productService.getById('1').subscribe(product => {
  console.log('Product:', product);
});

// Create new item
const newProduct = {
  name: 'New Product',
  price: 50.00,
  category: 'Electronics'
};
this.productService.create(newProduct).subscribe(product => {
  console.log('Created:', product);
});

// Update item
this.productService.update('1', { price: 75.00 }).subscribe(product => {
  console.log('Updated:', product);
});

// Delete item
this.productService.delete('1').subscribe(success => {
  console.log('Deleted:', success);
});
```

### Advanced Operations

```typescript
// Search by criteria
this.productService.search({ category: 'Electronics' }).subscribe(products => {
  console.log('Electronics products:', products);
});

// Filter with predicate
this.productService.filter(product => product.price > 100).subscribe(products => {
  console.log('Expensive products:', products);
});

// Sort items
this.productService.sort('price', 'desc').subscribe(products => {
  console.log('Sorted by price:', products);
});

// Pagination
const paginationParams = {
  page: 1,
  limit: 10,
  sortBy: 'name',
  sortOrder: 'asc',
  search: 'laptop'
};
this.productService.getPaginated(paginationParams).subscribe(result => {
  console.log('Paginated result:', result);
});
```

### State Management

```typescript
// Subscribe to state changes
this.productService.items$.subscribe(products => {
  console.log('Products updated:', products);
});

this.productService.loading$.subscribe(loading => {
  console.log('Loading state:', loading);
});

this.productService.error$.subscribe(error => {
  if (error) {
    console.error('Error:', error);
  }
});

// Get current state
const state = this.productService.getState();
console.log('Current state:', state);
```

## GenericApiService Features

### HTTP Operations

```typescript
// GET requests
this.productApiService.getAll().subscribe(products => {
  console.log('All products from API:', products);
});

this.productApiService.getById('1').subscribe(product => {
  console.log('Product from API:', product);
});

// POST request
const newProduct = { name: 'New Product', price: 50.00, category: 'Electronics' };
this.productApiService.post(newProduct).subscribe(product => {
  console.log('Created product:', product);
});

// PUT request
this.productApiService.put('1', { price: 75.00 }).subscribe(product => {
  console.log('Updated product:', product);
});

// PATCH request
this.productApiService.patch('1', { price: 75.00 }).subscribe(product => {
  console.log('Patched product:', product);
});

// DELETE request
this.productApiService.delete('1').subscribe(() => {
  console.log('Product deleted');
});
```

### Advanced API Operations

```typescript
// Query parameters
this.productApiService.get(undefined, { category: 'Electronics', minPrice: 100 }).subscribe(products => {
  console.log('Filtered products:', products);
});

// Custom headers
this.productApiService.getAll(undefined, undefined, {
  headers: new Headers({ 'X-Custom-Header': 'value' }) as any
}).subscribe(products => {
  console.log('Products with custom headers:', products);
});

// File upload
const file = new File(['content'], 'image.jpg', { type: 'image/jpeg' });
this.productApiService.upload(file, 'image', 'upload').subscribe(result => {
  console.log('File uploaded:', result);
});

// File download
this.productApiService.download('export', { format: 'csv' }).subscribe(blob => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'products.csv';
  a.click();
});

// Pagination
const paginationParams = {
  page: 1,
  limit: 10,
  sortBy: 'name',
  sortOrder: 'asc'
};
this.productApiService.getPaginated(paginationParams).subscribe(result => {
  console.log('Paginated API result:', result);
});
```

### Authentication

```typescript
// Set authentication token
this.productApiService.setAuthToken('your-jwt-token');

// Add custom headers
this.productApiService.addHeader('X-API-Key', 'your-api-key');

// Remove headers
this.productApiService.removeHeader('X-API-Key');
```

## Combining Services

You can create a manager service that combines both local and API operations:

```typescript
@Injectable({
  providedIn: 'root'
})
export class ProductManagerService {
  constructor(
    private productService: ProductService,
    private productApiService: ProductApiService
  ) {}

  // Sync local data with API
  syncProducts(): Observable<Product[]> {
    return new Observable(observer => {
      this.productApiService.getAll().subscribe({
        next: (products) => {
          this.productService.setItems(products);
          observer.next(products);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }

  // Create product both locally and on API
  createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    return new Observable(observer => {
      this.productApiService.post(productData).subscribe({
        next: (product) => {
          this.productService.addItems([product]);
          observer.next(product);
          observer.complete();
        },
        error: (error) => observer.error(error)
      });
    });
  }
}
```

## Best Practices

### 1. Type Safety
Always define proper interfaces for your entities:

```typescript
export interface Product extends BaseEntity {
  name: string;
  price: number;
  category: string;
  description?: string;
  tags?: string[];
  metadata?: Record<string, any>;
}
```

### 2. Error Handling
Use the built-in error handling and observables:

```typescript
this.productService.error$.subscribe(error => {
  if (error) {
    // Show error message to user
    this.showErrorMessage(error);
  }
});
```

### 3. Loading States
Use loading states for better UX:

```typescript
this.productService.loading$.subscribe(loading => {
  if (loading) {
    this.showLoadingSpinner();
  } else {
    this.hideLoadingSpinner();
  }
});
```

### 4. Configuration Management
Store API configuration in environment files:

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://api.example.com',
  apiTimeout: 10000,
  apiRetryCount: 3
};

// In your service
this.productApiService.initialize({
  baseUrl: environment.apiUrl,
  endpoint: 'products',
  timeout: environment.apiTimeout,
  retryCount: environment.apiRetryCount
});
```

### 5. Custom Methods
Extend the generic services with domain-specific methods:

```typescript
export class ProductService extends GenericService<Product> {
  // Domain-specific methods
  getFeaturedProducts(): Observable<Product[]> {
    return this.filter(product => product.featured === true);
  }

  getProductsByPriceRange(min: number, max: number): Observable<Product[]> {
    return this.filter(product => product.price >= min && product.price <= max);
  }

  searchProductsByText(text: string): Observable<Product[]> {
    return this.filter(product => 
      product.name.toLowerCase().includes(text.toLowerCase()) ||
      product.description?.toLowerCase().includes(text.toLowerCase())
    );
  }
}
```

## Interfaces Reference

### BaseEntity
```typescript
interface BaseEntity {
  id?: string | number;
  createdAt?: Date;
  updatedAt?: Date;
}
```

### PaginationParams
```typescript
interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}
```

### PaginatedResponse
```typescript
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

### ApiConfig
```typescript
interface ApiConfig {
  baseUrl: string;
  endpoint: string;
  timeout?: number;
  retryCount?: number;
  headers?: HttpHeaders;
}
```

## Migration Guide

If you're migrating from existing services:

1. **Extend GenericService** instead of creating new services from scratch
2. **Use the built-in observables** for state management
3. **Leverage the pagination and filtering** methods
4. **Implement custom methods** for domain-specific logic
5. **Use the error handling** and loading states

## Troubleshooting

### Common Issues

1. **TypeScript errors**: Ensure your entity extends `BaseEntity`
2. **HTTP errors**: Check API configuration and network connectivity
3. **State not updating**: Verify you're subscribing to the correct observables
4. **Performance issues**: Use pagination for large datasets

### Debug Tips

```typescript
// Enable debug logging
this.productService.getState(); // Check current state
this.productApiService.getState(); // Check API state

// Monitor all state changes
this.productService.items$.subscribe(items => {
  console.log('Items changed:', items);
});
``` 