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
const tripExecutionShipperRoutes = () =>
  import('./trip-execution/presentation/trip-execution.routes').then(m => m.tripExecutionShipperRoutes);
const tripExecutionCarrierRoutes = () =>
  import('./trip-execution/presentation/trip-execution.routes').then(m => m.tripExecutionCarrierRoutes);
const documentsRoutes = () =>
  import('./documents/presentation/documents.routes').then(m => m.documentsRoutes);

const baseTitle = 'LoadMatch';

/**
 * Application routes.
 */
export const routes: Routes = [
  { path: 'home',     component: Home, title: `${baseTitle} - Home` },
  { path: 'about',    loadComponent: about, title: `${baseTitle} - About` },
  { path: 'shipper',  children: [
    { path: '', loadChildren: freightPublishingRoutes },
    { path: '', loadChildren: tripExecutionShipperRoutes },
  ] },
  { path: 'carrier',  children: [
    { path: '', loadChildren: matchingRoutes },
    { path: '', loadChildren: tripExecutionCarrierRoutes },
    { path: '', loadChildren: documentsRoutes },
  ] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**',       loadComponent: pageNotFound, title: `${baseTitle} - Page not found` },
];
