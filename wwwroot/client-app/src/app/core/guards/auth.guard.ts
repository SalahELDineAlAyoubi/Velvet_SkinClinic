import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateChildFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = authService.isAuthenticated();
  if (!isAuthenticated) {
    return router.createUrlTree(['/login']);
  }
  // ❌ not logged → redirect to login
   return true;
};
