import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';
import {CurrencyCode} from '../../shared/domain/model/money';

/**
 * Subset of the `/load-requests` resource read by Matching to build available loads.
 */
export interface AvailableLoadResource extends BaseResource {
  id: number;
  vehicleTypeId: number;
  originAddress: string;
  originDistrict: string;
  originLat: number;
  originLng: number;
  destinationAddress: string;
  destinationDistrict: string;
  distanceKm: number;
  weightKg: number;
  cargoType: string;
  rateAmount: number;
  rateCurrency: CurrencyCode;
  pickupAt: string;
  publishedAt: string | null;
  urgent: boolean;
}

/**
 * Envelope returned by the API for a collection of load requests.
 */
export interface AvailableLoadsResponse extends BaseResponse {
  loadRequests: AvailableLoadResource[];
}
