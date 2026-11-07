import {Routes} from '@angular/router';

const signIn = () => import('./views/sign-in/sign-in').then(m => m.SignIn);

const baseTitle = 'LoadMatch';

/**
 * Routes of the Identity and Access Management bounded context.
 */
export const iamRoutes: Routes = [
  {path: 'sign-in', loadComponent: signIn, title: `${baseTitle} - Sign in`}
];
