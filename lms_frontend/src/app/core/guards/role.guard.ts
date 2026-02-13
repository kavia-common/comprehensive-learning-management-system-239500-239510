import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';
import { UserRole } from '../models/auth.models';

// PUBLIC_INTERFACE
export function roleGuard(roles: UserRole[]): CanActivateFn {
  /** Route guard: requires user to have at least one of the specified roles. */
  return () => {
    const auth = inject(AuthStateService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) return router.parseUrl('/login');
    if (auth.hasAnyRole(roles)) return true;
    return router.parseUrl('/app/dashboard');
  };
}
