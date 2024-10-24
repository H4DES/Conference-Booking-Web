import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const router = inject(Router);
  const authServ = inject(AuthService);
  const userId = authServ.getNameIdentifier();
  console.log(userId)
  const isLoggedIn = !!userId;

  if(isLoggedIn){
    return true;
  }
  else{
    return router.parseUrl('/login?redirect=' + state.url);
  }
};
