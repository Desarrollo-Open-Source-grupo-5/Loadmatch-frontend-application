import {Routes} from '@angular/router';

const loadRequestList = () =>
  import('./views/load-request-list/load-request-list').then(m => m.LoadRequestList);
const loadRequestForm = () =>
  import('./views/load-request-form/load-request-form').then(m => m.LoadRequestForm);
const loadRequestDetail = () =>
  import('./views/load-request-detail/load-request-detail').then(m => m.LoadRequestDetail);

const baseTitle = 'LoadMatch';

/**
 * Routes of the Freight Publishing context, mounted under `/shipper`.
 */
export const freightPublishingRoutes: Routes = [
  { path: 'load-requests',            loadComponent: loadRequestList, title: `${baseTitle} - My Loads` },
  { path: 'load-requests/new',        loadComponent: loadRequestForm, title: `${baseTitle} - Publish Load` },
  { path: 'load-requests/:id',        loadComponent: loadRequestDetail, title: `${baseTitle} - Load Detail` },
  { path: 'load-requests/:id/edit',   loadComponent: loadRequestForm, title: `${baseTitle} - Edit Load` },
  { path: '', redirectTo: 'load-requests', pathMatch: 'full' },
];
