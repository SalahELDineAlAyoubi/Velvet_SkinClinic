import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateChildFn = () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  // ✅ check if user is logged in
  if (authService.isAuthenticated()) {
    
    //router.navigate(['/dashboard']);
    return true;
  }

  // ❌ not logged → redirect to login
  //router.navigate(['/login']);
  return false;
};
