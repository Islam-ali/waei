import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService, StorageType } from '../services';
import { inject } from '@angular/core';

// URLs that should skip authentication
const skipUrls: string[] = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/health',
  '/api/ping',
  '/public/'
];

function shouldSkipAuth(url: string): boolean {
  return skipUrls.some(skipUrl => url.includes(skipUrl));
}

function getAuthToken(storageService: StorageService): string | null {
  // Try to get token from localStorage first
  let token = storageService.getItem(environment.auth.tokenKey);
  
  // If not found in localStorage, try sessionStorage
  if (!token) {
    token = storageService.getItem(environment.auth.tokenKey, 'session');
  }
  
  return token;
}

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Get storage service within the injection context
  const storageService = inject(StorageService);
  
  // Check if this request should skip authentication
  if (shouldSkipAuth(request.url)) {
    return next(request);
  }

  // Get token from localStorage or sessionStorage
  const token = getAuthToken(storageService);
  
  if (token) {
    // Clone the request and add the authorization header
    const authRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(authRequest);
  }

  // If no token, proceed with original request
  return next(request);
}; 