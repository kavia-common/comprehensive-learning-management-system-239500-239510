import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly api: ApiClientService) {}

  // PUBLIC_INTERFACE
  login(req: LoginRequest): Observable<AuthResponse> {
    /** Authenticate user and obtain tokens + profile. */
    return this.api.post<AuthResponse>('/auth/login', req);
  }

  // PUBLIC_INTERFACE
  register(req: RegisterRequest): Observable<AuthResponse> {
    /** Register user (student/instructor/admin depending on backend policy) and obtain session. */
    return this.api.post<AuthResponse>('/auth/register', req);
  }

  // PUBLIC_INTERFACE
  me(): Observable<{ user: AuthResponse['user'] }> {
    /** Fetch current user profile. */
    return this.api.get<{ user: AuthResponse['user'] }>('/auth/me');
  }
}
