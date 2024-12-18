import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const authServ = inject(AuthService);
  const userId = authServ.getNameIdentifier();
  const userRole = authServ.getUserRole();
  const isLoggedIn = !!userId;
  const allowedRoles = route.data['roles'];

  if (isLoggedIn) {
    if (userRole === 'AdminRole' || userRole === 'SuperAdmin') {
      return true; // Admins have full access
    } else if (allowedRoles && allowedRoles.includes(userRole)) {
      return true; // Allow access to specified paths for regular users      
    } else {
      return router.parseUrl('/login?redirect=' + state.url); // Redirect if access is denied
    }
  } else {
    sessionStorage.setItem('redirectAfterLogin', state.url);
    return router.parseUrl('/login?redirect=' + state.url); // Redirect if not logged in
  }
};
