import { BaseEntity } from './base-entity.model';

export interface Product extends BaseEntity {
  name: string;
  price: number;
  category: string;
  description?: string;
  image?: string;
  isActive: boolean;
  stock: number;
  sku: string;
  tags?: string[];
  specifications?: Record<string, any>;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  category: string;
  description?: string;
  stock: number;
  sku: string;
  tags?: string[];
  specifications?: Record<string, any>;
}

export interface UpdateProductRequest {
  name?: string;
  price?: number;
  category?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  stock?: number;
  sku?: string;
  tags?: string[];
  specifications?: Record<string, any>;
} 