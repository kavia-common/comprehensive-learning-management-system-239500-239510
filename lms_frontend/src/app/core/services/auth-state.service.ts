import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthResponse, AuthTokens, AuthUser, UserRole } from '../models/auth.models';

const LS_KEY = 'lms.auth.v1';

type PersistedAuth = {
  user: AuthUser;
  tokens: AuthTokens;
};

@Injectable({ providedIn: 'root' })
export class AuthStateService {
  private readonly _user$ = new BehaviorSubject<AuthUser | null>(null);
  private readonly _tokens$ = new BehaviorSubject<AuthTokens | null>(null);

  readonly user$ = this._user$.asObservable();
  readonly tokens$ = this._tokens$.asObservable();

  constructor() {
    const persisted = this.readPersisted();
    if (persisted) {
      this._user$.next(persisted.user);
      this._tokens$.next(persisted.tokens);
    }
  }

  // PUBLIC_INTERFACE
  get accessToken(): string | null {
    /** Current access token (if authenticated). */
    return this._tokens$.value?.accessToken ?? null;
  }

  // PUBLIC_INTERFACE
  get currentUser(): AuthUser | null {
    /** Current authenticated user (if any). */
    return this._user$.value;
  }

  // PUBLIC_INTERFACE
  isAuthenticated(): boolean {
    /** Returns true if a user and access token are present. */
    return !!this._user$.value && !!this._tokens$.value?.accessToken;
  }

  // PUBLIC_INTERFACE
  hasAnyRole(roles: UserRole[]): boolean {
    /** Returns true if current user has any of the specified roles. */
    const userRoles = this._user$.value?.roles ?? [];
    return roles.some(r => userRoles.includes(r));
  }

  // PUBLIC_INTERFACE
  setAuth(auth: AuthResponse): void {
    /** Set the current auth session and persist it. */
    this._user$.next(auth.user);
    this._tokens$.next(auth.tokens);
    this.persist({ user: auth.user, tokens: auth.tokens });
  }

  // PUBLIC_INTERFACE
  clear(): void {
    /** Clear current auth session. */
    this._user$.next(null);
    this._tokens$.next(null);
    localStorage.removeItem(LS_KEY);
  }

  private persist(data: PersistedAuth): void {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
  }

  private readPersisted(): PersistedAuth | null {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as PersistedAuth;
    } catch {
      return null;
    }
  }
}
