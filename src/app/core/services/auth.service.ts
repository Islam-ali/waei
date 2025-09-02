import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private storageService: StorageService
  ) {}

  /**
   * Set authentication token
   */
  setAuthToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe) {
      this.storageService.setItem(environment.auth.tokenKey, token);
    } else {
      this.storageService.setItem(environment.auth.tokenKey, token, 'session');
    }
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    this.storageService.removeItem(environment.auth.tokenKey);
    this.storageService.removeItem(environment.auth.tokenKey, 'session');
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    // Try to get token from localStorage first
    let token = this.storageService.getItem(environment.auth.tokenKey);
    
    // If not found in localStorage, try sessionStorage
    if (!token) {
      token = this.storageService.getItem(environment.auth.tokenKey, 'session');
    }
    
    return token;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  /**
   * Check if token exists in localStorage (remember me)
   */
  hasRememberMeToken(): boolean {
    return this.storageService.hasItem(environment.auth.tokenKey, 'local');
  }

  /**
   * Check if token exists in sessionStorage (temporary)
   */
  hasSessionToken(): boolean {
    return this.storageService.hasItem(environment.auth.tokenKey, 'session');
  }
} 