import { BaseEntity } from './base-entity.model';

export interface User extends BaseEntity {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  isActive: boolean;
  role: 'admin' | 'user' | 'moderator';
  lastLoginAt?: Date;
}

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  password: string;
  role?: 'admin' | 'user' | 'moderator';
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  role?: 'admin' | 'user' | 'moderator';
} 