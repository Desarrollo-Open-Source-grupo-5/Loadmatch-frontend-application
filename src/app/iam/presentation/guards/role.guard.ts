import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {SessionStore} from '../../application/session.store';
import {UserRole} from '../../domain/model/user-role';

/**
 * Home view of each role, used to send users back to their own area.
 */
const HOME_PATH_BY_ROLE: Record<UserRole, string> = {
  SHIPPER: '/shipper/dashboard',
  CARRIER: '/carrier/available-loads'
};

/**
 * Creates a guard that allows the route only to users with the given role.
 * Users without a session go to the sign-in view and users with another role go to the home view of their role.
 * @param role - Role required by the route.
 * @returns The guard for that role.
 */
export const roleGuard = (role: UserRole): CanActivateFn => () => {
  const user = inject(SessionStore).currentUser();
  const router = inject(Router);
  if (!user) {
    return router.createUrlTree(['/sign-in']);
  }
  return user.role === role ? true : router.createUrlTree([HOME_PATH_BY_ROLE[user.role]]);
};
