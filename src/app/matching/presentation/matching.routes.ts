import {Routes} from '@angular/router';

const availableLoadSearch = () =>
  import('./views/available-load-search/available-load-search').then(m => m.AvailableLoadSearch);

const baseTitle = 'LoadMatch';

/**
 * Routes of the Matching context, mounted under `/carrier`.
 */
export const matchingRoutes: Routes = [
  { path: 'available-loads',  loadComponent: availableLoadSearch, title: `${baseTitle} - Find Loads` },
  { path: '', redirectTo: 'available-loads', pathMatch: 'full' },
];
