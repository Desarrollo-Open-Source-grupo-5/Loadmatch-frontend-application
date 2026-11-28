import {Routes} from '@angular/router';

const paymentScreen = () =>
  import('./views/payment-screen/payment-screen').then(m => m.PaymentScreen);

const baseTitle = 'LoadMatch';

/**
 * Shipper payment routes (/shipper/payments/:tripId).
 */
export const shipperPaymentRoutes: Routes = [
  {path: 'payments/:tripId', loadComponent: paymentScreen, title: `${baseTitle} - Pay trip`}
];

