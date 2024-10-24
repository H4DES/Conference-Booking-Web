import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  
  const authToken = localStorage.getItem('authToken');
  
  if (authToken) {
    const cloneRequest = req.clone({
      setHeaders:{
        Authorization: `Bearer ${authToken}`
      },
    });
    return next(cloneRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          // localStorage.removeItem('userid');
          localStorage.removeItem('authToken');
          console.error('Your session has expired. Please login again to continue using the app Session Expired');
        }
      return throwError(() => error);
      })
    );
  }
  else {
    return next(req);
  }
};
