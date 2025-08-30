import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

// Global state for loading
let requestCount = 0;
const loadingSubject = new BehaviorSubject<boolean>(false);
export const loading$ = loadingSubject.asObservable();

// URLs that should trigger loading indicator
const loadingUrls: string[] = [
  '/api/',
  '/auth/',
  '/users/',
  '/products/',
  '/bookings/'
];

// URLs that should be ignored for loading
const skipUrls: string[] = [
  '/api/health',
  '/api/ping'
];

function shouldShowLoading(url: string): boolean {
  // Skip URLs that should be ignored
  if (skipUrls.some(skipUrl => url.includes(skipUrl))) {
    return false;
  }

  // Show loading for URLs that match loading patterns
  return loadingUrls.some(loadingUrl => url.includes(loadingUrl));
}

export const loadingInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Check if this request should trigger loading
  if (shouldShowLoading(request.url)) {
    requestCount++;
    loadingSubject.next(true);
  }

  return next(request).pipe(
    tap({
      next: (event) => {
        // Optional: Log successful requests
        console.log('Request successful:', request.url);
      },
      error: (error) => {
        // Optional: Log failed requests
        console.error('Request failed:', request.url, error);
      }
    }),
    finalize(() => {
      // Check if this request should trigger loading
      if (shouldShowLoading(request.url)) {
        requestCount--;
        if (requestCount === 0) {
          loadingSubject.next(false);
        }
      }
    })
  );
};

// Utility functions
export function addLoadingUrl(url: string): void {
  if (!loadingUrls.includes(url)) {
    loadingUrls.push(url);
  }
}

export function removeLoadingUrl(url: string): void {
  const index = loadingUrls.indexOf(url);
  if (index > -1) {
    loadingUrls.splice(index, 1);
  }
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

export function getCurrentLoadingState(): boolean {
  return loadingSubject.value;
}

export function getCurrentRequestCount(): number {
  return requestCount;
} 