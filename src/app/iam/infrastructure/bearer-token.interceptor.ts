import {HttpInterceptorFn} from '@angular/common/http';
import {inject} from '@angular/core';
import {environment} from '../../../environments/environment';
import {SessionStore} from '../application/session.store';

/**
 * Adds the JWT access token of the signed-in user to the requests sent to the LoadMatch Platform.
 * Requests to other hosts (simulated API, translation files) are sent unchanged.
 */
export const bearerTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const token = inject(SessionStore).token();
  if (!token || !request.url.startsWith(environment.platformApiBaseUrl)) {
    return next(request);
  }
  return next(request.clone({setHeaders: {Authorization: `Bearer ${token}`}}));
};
