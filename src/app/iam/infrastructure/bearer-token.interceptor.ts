import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {Router} from '@angular/router';
import {catchError, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {SessionStore} from '../application/session.store';

/**
 * Adds the JWT access token of the signed-in user to the requests sent to the LoadMatch Platform.
 * Requests to other hosts (simulated API, translation files) are sent unchanged.
 * When the platform rejects the token (401), the session is closed and the user returns to the sign-in view.
 */
export const bearerTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const sessionStore = inject(SessionStore);
  const router = inject(Router);
  const token = sessionStore.token();
  if (!token || !request.url.startsWith(environment.platformApiBaseUrl)) {
    return next(request);
  }
  return next(request.clone({setHeaders: {Authorization: `Bearer ${token}`}})).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        sessionStore.signOut();
        router.navigate(['/sign-in']).then();
      }
      return throwError(() => error);
    })
  );
};
