import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStateService } from '../services/auth-state.service';

// PUBLIC_INTERFACE
export const authGuard: CanActivateFn = () => {
  /** Route guard: requires authentication. */
  const auth = inject(AuthStateService);
  const router = inject(Router);

  if (auth.isAuthenticated()) return true;
  return router.parseUrl('/login');
};
