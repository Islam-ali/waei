import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly env = environment;

  // Environment info
  get isProduction(): boolean {
    return this.env.production;
  }

  get isDevelopment(): boolean {
    return !this.env.production;
  }

  get isStaging(): boolean {
    return this.env.appName.includes('Staging');
  }

  // API Configuration
  get apiBaseUrl(): string {
    return this.env.apiBaseUrl;
  }

  get baseUrl(): string {
    return this.env.baseUrl;
  }

  // App Configuration
  get appName(): string {
    return this.env.appName;
  }

  get version(): string {
    return this.env.version;
  }

  get debug(): boolean {
    return this.env.debug;
  }

  get logLevel(): string {
    return this.env.logLevel;
  }

  // Features Configuration
  get features() {
    return this.env.features;
  }

  get analyticsEnabled(): boolean {
    return this.env.features.analytics;
  }

  get loggingEnabled(): boolean {
    return this.env.features.logging;
  }

  get cachingEnabled(): boolean {
    return this.env.features.caching;
  }

  // Auth Configuration
  get auth() {
    return this.env.auth;
  }

  get tokenKey(): string {
    return this.env.auth.tokenKey;
  }

  get refreshTokenKey(): string {
    return this.env.auth.refreshTokenKey;
  }

  get tokenExpiry(): number {
    return this.env.auth.tokenExpiry;
  }

  get refreshTokenExpiry(): number {
    return this.env.auth.refreshTokenExpiry;
  }

  // API Configuration
  get api() {
    return this.env.api;
  }

  get apiTimeout(): number {
    return this.env.api.timeout;
  }

  get apiRetryAttempts(): number {
    return this.env.api.retryAttempts;
  }

  get apiRetryDelay(): number {
    return this.env.api.retryDelay;
  }

  // Upload Configuration
  get upload() {
    return this.env.upload;
  }

  get maxFileSize(): number {
    return this.env.upload.maxFileSize;
  }

  get allowedFileTypes(): string[] {
    return this.env.upload.allowedTypes;
  }

  // Utility methods
  isFileTypeAllowed(fileType: string): boolean {
    return this.allowedFileTypes.includes(fileType);
  }

  isFileSizeValid(fileSize: number): boolean {
    return fileSize <= this.maxFileSize;
  }

  getEnvironmentInfo(): any {
    return {
      environment: this.isProduction ? 'production' : this.isStaging ? 'staging' : 'development',
      appName: this.appName,
      version: this.version,
      apiBaseUrl: this.apiBaseUrl,
      debug: this.debug,
      logLevel: this.logLevel,
      features: this.features
    };
  }

  logEnvironmentInfo(): void {
    if (this.debug) {
      console.log('Environment Info:', this.getEnvironmentInfo());
    }
  }
} 