import { inject, Inject, Injectable } from '@angular/core';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, retry, timeout, switchMap } from 'rxjs/operators';
import { BaseEntity } from '../../models/base-entity.model';
import { PaginationParams, PaginatedResponse } from '../../models/pagination.model';
import { ApiResponse } from '../../models/api-response.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericApiService<T extends BaseEntity> {
  private readonly DEFAULT_TIMEOUT = environment.api.timeout;
  private readonly DEFAULT_RETRY_ATTEMPTS = environment.api.retryAttempts;
  private readonly RETRY_DELAY = environment.api.retryDelay;
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  // GET - Get single item by ID
  getById(endpoint: string, id: string | number): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`)
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry({ count: this.DEFAULT_RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
        catchError(this.handleError)
      );
  }

  // GET - Get all items
  getAll(endpoint: string, params?: Record<string, any>): Observable<ApiResponse<T[]>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<ApiResponse<T[]>>(`${this.baseUrl}/${endpoint}`, { params: httpParams })
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry({ count: this.DEFAULT_RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
        catchError(this.handleError)
      );
  }

  // GET - Get paginated items
  getPaginated(endpoint: string, paginationParams: PaginationParams): Observable<ApiResponse<PaginatedResponse<T>>> {
    let httpParams = new HttpParams();
    if (paginationParams) {
      Object.keys(paginationParams).forEach(key => {
        if (paginationParams[key as keyof PaginationParams] !== null && paginationParams[key as keyof PaginationParams] !== undefined) {
          httpParams = httpParams.set(key, paginationParams[key as keyof PaginationParams]?.toString() || '');
        }
      });
    }

    return this.http.get<ApiResponse<PaginatedResponse<T>>>(`${this.baseUrl}/${endpoint}/paginated`, { params: httpParams })
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry({ count: this.DEFAULT_RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
        catchError(this.handleError)
      );
  }

  // POST - Create new item
  create(endpoint: string, item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, item)
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry({ count: this.DEFAULT_RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
        catchError(this.handleError)
      );
  }

  // PUT - Update entire item
  update(endpoint: string, id: string | number, item: Partial<T>): Observable<ApiResponse<T>> {
    return this.http.put<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`, item)
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry({ count: this.DEFAULT_RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
        catchError(this.handleError)
      );
  }

  // PATCH - Partial update
  patch(endpoint: string, id: string | number, updates: Partial<T>): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/${id}`, updates)
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry({ count: this.DEFAULT_RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
        catchError(this.handleError)
      );
  }

  // DELETE - Delete item
  delete(endpoint: string, id: string | number): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${endpoint}/${id}`)
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry({ count: this.DEFAULT_RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
        catchError(this.handleError)
      );
  }

  // Upload file
  upload(endpoint: string, file: File, additionalData?: Record<string, any>): Observable<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}/upload`, formData)
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry({ count: this.DEFAULT_RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
        catchError(this.handleError)
      );
  }

  // Download file
  download(endpoint: string, id: string | number, filename?: string): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${endpoint}/${id}/download`, { responseType: 'blob' })
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry({ count: this.DEFAULT_RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
        catchError(this.handleError)
      );
  }

  // Custom query with query parameters
  query(endpoint: string, params?: Record<string, any>): Observable<ApiResponse<any>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/${endpoint}`, { params: httpParams })
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry({ count: this.DEFAULT_RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
        catchError(this.handleError)
      );
  }

  // Custom POST with endpoint
  post(endpoint: string, data: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.baseUrl}/${endpoint}`, data)
      .pipe(
        timeout(this.DEFAULT_TIMEOUT),
        retry({ count: this.DEFAULT_RETRY_ATTEMPTS, delay: this.RETRY_DELAY }),
        catchError(this.handleError)
      );
  }

  // Error handling
  private handleError = (error: any) => {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.status ? 
        `Error Code: ${error.status}\nMessage: ${error.message}` : 
        'Server error';
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  };
} 