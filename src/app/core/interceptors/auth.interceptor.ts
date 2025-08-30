import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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

function getAuthToken(): string | null {
  // Try to get token from localStorage first
  let token = localStorage.getItem(environment.auth.tokenKey);
  
  // If not found in localStorage, try sessionStorage
  if (!token) {
    token = sessionStorage.getItem(environment.auth.tokenKey);
  }
  
  return token;
}

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Check if this request should skip authentication
  if (shouldSkipAuth(request.url)) {
    return next(request);
  }

  // Get token from localStorage or sessionStorage
  const token = getAuthToken();
  
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

// Utility functions
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

export function setAuthToken(token: string, rememberMe: boolean = false): void {
  if (rememberMe) {
    localStorage.setItem(environment.auth.tokenKey, token);
  } else {
    sessionStorage.setItem(environment.auth.tokenKey, token);
  }
}

export function clearAuthToken(): void {
  localStorage.removeItem(environment.auth.tokenKey);
  sessionStorage.removeItem(environment.auth.tokenKey);
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
} 