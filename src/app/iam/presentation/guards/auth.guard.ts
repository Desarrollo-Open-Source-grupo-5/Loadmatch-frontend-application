import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {SessionStore} from '../../application/session.store';

/**
 * Allows the route only to signed-in users; anyone else is sent to the sign-in view.
 */
export const authGuard: CanActivateFn = () => {
  const sessionStore = inject(SessionStore);
  const router = inject(Router);
  return sessionStore.isSignedIn() ? true : router.createUrlTree(['/sign-in']);
};
