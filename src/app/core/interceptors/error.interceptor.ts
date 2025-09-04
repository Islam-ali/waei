import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { StorageService } from '../services';
import { inject } from '@angular/core';

export interface ErrorInfo {
  message: string;
  status: number;
  url: string;
  timestamp: Date;
}

// Global state for errors
const errorSubject = new BehaviorSubject<ErrorInfo | null>(null);
export const error$ = errorSubject.asObservable();

// URLs that should skip error handling
const skipUrls: string[] = [
  '/api/health',
  '/api/ping'
];

function shouldSkipError(url: string): boolean {
  return skipUrls.some(skipUrl => url.includes(skipUrl));
}

function getErrorMessage(error: HttpErrorResponse): string {
  if (error.error instanceof ErrorEvent) {
    // Client-side error
    return `Client Error: ${error.error.message}`;
  } else {
    // Server-side error
    if (error.error && error.error.message) {
      return error.error.message;
    }
    
    switch (error.status) {
      case 400:
        return 'Bad Request - Invalid data provided';
      case 401:
        return 'Unauthorized - Please login again';
      case 403:
        return 'Forbidden - You do not have permission to access this resource';
      case 404:
        return 'Not Found - The requested resource was not found';
      case 409:
        return 'Conflict - The resource already exists';
      case 422:
        return 'Validation Error - Please check your input';
      case 429:
        return 'Too Many Requests - Please try again later';
      case 500:
        return 'Internal Server Error - Please try again later';
      case 502:
        return 'Bad Gateway - Service temporarily unavailable';
      case 503:
        return 'Service Unavailable - Please try again later';
      case 504:
        return 'Gateway Timeout - Request timed out';
      default:
        return `Error ${error.status}: ${error.statusText || 'Unknown error'}`;
    }
  }
}

function handleSpecificErrors(error: HttpErrorResponse, storageService: StorageService): void {
  switch (error.status) {
    case 401:
      // Handle unauthorized - redirect to login
      handleUnauthorized(storageService);
      break;
    case 403:
      // Handle forbidden - show access denied message
      handleForbidden();
      break;
    case 500:
      // Handle server error - log for debugging
      console.error('Server Error:', error);
      break;
  }
}

function handleUnauthorized(storageService: StorageService): void {
  // Clear auth token
  storageService.removeItem(environment.auth.tokenKey);
  storageService.removeItem(environment.auth.tokenKey, 'session');
  
  // Redirect to login page
  // Note: In a real app, you might want to use Router service
  console.log('User unauthorized, redirecting to login...');  
}

function handleForbidden(): void {
  // Show access denied message
  console.log('Access denied - insufficient permissions');
}

export const errorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Get storage service within the injection context
      const storageService = inject(StorageService);
      
      // Check if this request should skip error handling
      if (shouldSkipError(request.url)) {
        return throwError(() => error);
      }

      // Create error info object
      const errorInfo: ErrorInfo = {
        message: getErrorMessage(error),
        status: error.status,
        url: request.url,
        timestamp: new Date()
      };

      // Emit error to subscribers
      errorSubject.next(errorInfo);

      // Handle specific error statuses
      handleSpecificErrors(error, storageService);

      // Return the error to be handled by the calling code
      return throwError(() => error);
    })
  );
};

// Utility functions
export function clearError(): void {
  errorSubject.next(null);
}

export function addSkipUrl(url: string): void {
  if (!skipUrls.includes(url)) {
    skipUrls.push(url);
  }
}

export function removeSkipUrl(url: string): void {
  const index = skipUrls.indexOf(url);
  if (index > -1) {
    skipUrls.splice(index, 1);
  }
}

export function getCurrentError(): ErrorInfo | null {
  return errorSubject.value;
}

export function hasError(): boolean {
  return errorSubject.value !== null;
} 