import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const authServ = inject(AuthService);
  const userId = authServ.getNameIdentifier();
  const userRole = authServ.getUserRole();
  console.log(userId, userRole);

  const isLoggedIn = !!userId;

  // Define paths accessible by regular users
  const allowedRoles = route.data['roles'];

  if (isLoggedIn) {
    if (userRole === 'AdminRole') {
      return true; // Admins have full access
    } else if (allowedRoles && allowedRoles.includes(userRole)) {
      return true; // Allow access to specified paths for regular users
      return router.parseUrl('/login?redirect=' + state.url); // Redirect if access is denied
      
    } else {
      return router.parseUrl('/login?redirect=' + state.url); // Redirect if access is denied
    }
  } else {
    sessionStorage.setItem('redirectAfterLogin', state.url);
    return router.parseUrl('/login?redirect=' + state.url); // Redirect if not logged in
  }
};
