import {Routes} from '@angular/router';

const rateTrip = () =>
  import('./views/rate-trip/rate-trip').then(m => m.RateTrip);

const baseTitle = 'LoadMatch';

/**
 * Shipper rating routes (/shipper/ratings/:tripId).
 */
export const shipperRatingRoutes: Routes = [
  {path: 'ratings/:tripId', loadComponent: rateTrip, data: {raterType: 'SHIPPER'}, title: `${baseTitle} - Rate carrier`}
];

/**
 * Carrier rating routes (/carrier/ratings/:tripId).
 */
export const carrierRatingRoutes: Routes = [
  {path: 'ratings/:tripId', loadComponent: rateTrip, data: {raterType: 'CARRIER'}, title: `${baseTitle} - Rate shipper`}
];

