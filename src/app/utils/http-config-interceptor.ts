import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuthService } from '../navbar/auth.service';

//It is now provided directly in main.ts
export const httpConfigInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Build headers
  let headers = req.headers.set('Accept', 'application/json');

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  if (!req.headers.has('Content-Type')) {
    headers = headers.set('Content-Type', 'application/json');
  }

  const clonedReq = req.clone({
    headers,
    withCredentials: true
  });

  return next(clonedReq).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        console.log('Response Event:', event);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.error('Error Occurred:', error);
      return throwError(() => error);
    })
  );
};
