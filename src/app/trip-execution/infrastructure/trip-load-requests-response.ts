import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';
import {CurrencyCode} from '../../shared/domain/model/money';

/**
 * Subset of the `/load-requests` resource (owned by Freight Publishing) read by Trip Execution.
 */
interface TripLoadRequestFields extends BaseResource {
  id: string;
  shipperId: string;
  originAddress: string;
  originDistrict: string;
  destinationAddress: string;
  destinationDistrict: string;
  distanceKm?: number | null;
  weightKg: number;
  cargoType: string;
  pickupAt: string;
}

export type TripLoadRequestResource = TripLoadRequestFields & (
  | { rateAmount: number; rateCurrency: CurrencyCode }
  | { offeredRateAmount: number; currency: CurrencyCode }
);

/**
 * Envelope returned by the API for a collection of load requests.
 */
export interface TripLoadRequestsResponse extends BaseResponse {
  loadRequests: TripLoadRequestResource[];
}
