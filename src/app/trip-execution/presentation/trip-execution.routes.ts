import {Routes} from '@angular/router';

const carrierTrips = () =>
  import('./views/carrier-trips/carrier-trips').then(m => m.CarrierTrips);
const serviceHistory = () =>
  import('./views/service-history/service-history').then(m => m.ServiceHistory);
const loadTracking = () =>
  import('./views/load-tracking/load-tracking').then(m => m.LoadTracking);

const baseTitle = 'LoadMatch';

/**
 * Routes of the Trip Execution context used by shippers, mounted under `/shipper` next to the Freight Publishing
 * routes.
 */
export const tripExecutionShipperRoutes: Routes = [
  { path: 'tracking/:loadRequestId', loadComponent: loadTracking, title: `${baseTitle} - Load Tracking` },
];

/**
 * Routes of the Trip Execution context used by carriers, mounted under `/carrier` next to the Matching and Documents
 * routes.
 */
export const tripExecutionCarrierRoutes: Routes = [
  { path: 'trips',          loadComponent: carrierTrips, title: `${baseTitle} - My Trips` },
  { path: 'trips/history',  loadComponent: serviceHistory, title: `${baseTitle} - History` },
];
