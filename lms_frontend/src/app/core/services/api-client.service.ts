import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { getAppEnv } from '../config/app-env';

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  private readonly http = inject(HttpClient);

  // PUBLIC_INTERFACE
  get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Observable<T> {
    /** HTTP GET with base URL and standardized error mapping. */
    const url = this.toUrl(path);
    const httpParams = this.toParams(params);
    return this.http.get<T>(url, { params: httpParams }).pipe(catchError(e => this.mapError(e)));
  }

  // PUBLIC_INTERFACE
  post<T>(path: string, body: unknown): Observable<T> {
    /** HTTP POST with base URL and standardized error mapping. */
    const url = this.toUrl(path);
    return this.http.post<T>(url, body).pipe(catchError(e => this.mapError(e)));
  }

  // PUBLIC_INTERFACE
  put<T>(path: string, body: unknown): Observable<T> {
    /** HTTP PUT with base URL and standardized error mapping. */
    const url = this.toUrl(path);
    return this.http.put<T>(url, body).pipe(catchError(e => this.mapError(e)));
  }

  // PUBLIC_INTERFACE
  delete<T>(path: string): Observable<T> {
    /** HTTP DELETE with base URL and standardized error mapping. */
    const url = this.toUrl(path);
    return this.http.delete<T>(url).pipe(catchError(e => this.mapError(e)));
  }

  private toUrl(path: string): string {
    const { apiBaseUrl } = getAppEnv();
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    if (path.startsWith('/')) return `${apiBaseUrl}${path}`;
    return `${apiBaseUrl}/${path}`;
  }

  private toParams(params?: Record<string, string | number | boolean | undefined>): HttpParams | undefined {
    if (!params) return undefined;
    let p = new HttpParams();
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined) continue;
      p = p.set(k, String(v));
    }
    return p;
  }

  private mapError(err: unknown): Observable<never> {
    if (err instanceof HttpErrorResponse) {
      const apiErr: ApiError = {
        status: err.status,
        message: (err.error && typeof err.error === 'object' && 'message' in err.error) ? String((err.error as any).message) : (err.message || 'Request failed'),
        details: err.error,
      };
      return throwError(() => apiErr);
    }
    return throwError(() => ({ status: 0, message: 'Unexpected error', details: err } satisfies ApiError));
  }
}
