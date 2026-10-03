import { Routes } from '@angular/router';
import {Home} from './shared/presentation/views/home/home';

const about = () => import('./shared/presentation/views/about/about')
  .then(m => m.About);
const pageNotFound = () => import('./shared/presentation/views/page-not-found/page-not-found')
  .then(m => m.PageNotFound);
const freightPublishingRoutes = () =>
  import('./freight-publishing/presentation/freight-publishing.routes').then(m => m.freightPublishingRoutes);
const matchingRoutes = () =>
  import('./matching/presentation/matching.routes').then(m => m.matchingRoutes);

const baseTitle = 'LoadMatch';

/**
 * Application routes.
 */
export const routes: Routes = [
  { path: 'home',     component: Home, title: `${baseTitle} - Home` },
  { path: 'about',    loadComponent: about, title: `${baseTitle} - About` },
  { path: 'shipper',  loadChildren: freightPublishingRoutes },
  { path: 'carrier',  loadChildren: matchingRoutes },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**',       loadComponent: pageNotFound, title: `${baseTitle} - Page not found` },
];
