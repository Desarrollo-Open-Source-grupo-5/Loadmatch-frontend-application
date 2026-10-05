import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';
import {CurrencyCode} from '../../shared/domain/model/money';

/**
 * Subset of the `/load-requests` resource (owned by Freight Publishing) read by Trip Execution.
 */
export interface TripLoadRequestResource extends BaseResource {
  id: number;
  shipperId: number;
  originAddress: string;
  originDistrict: string;
  destinationAddress: string;
  destinationDistrict: string;
  distanceKm: number;
  weightKg: number;
  cargoType: string;
  rateAmount: number;
  rateCurrency: CurrencyCode;
  pickupAt: string;
}

/**
 * Envelope returned by the API for a collection of load requests.
 */
export interface TripLoadRequestsResponse extends BaseResponse {
  loadRequests: TripLoadRequestResource[];
}
