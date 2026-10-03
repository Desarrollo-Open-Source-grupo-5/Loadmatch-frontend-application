import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';
import {CurrencyCode} from '../../shared/domain/model/money';
import {LoadRequestStatus} from '../domain/model/load-request-status';

/**
 * Load request resource exchanged with the `/load-requests` endpoint (flat JSON, camelCase).
 */
export interface LoadRequestResource extends BaseResource {
  id: number;
  shipperId: number;
  vehicleTypeId: number;
  originAddress: string;
  originDistrict: string;
  originLat: number;
  originLng: number;
  destinationAddress: string;
  destinationDistrict: string;
  destinationLat: number;
  destinationLng: number;
  distanceKm: number;
  weightKg: number;
  dimLengthM: number;
  dimWidthM: number;
  dimHeightM: number;
  cargoType: string;
  rateAmount: number;
  rateCurrency: CurrencyCode;
  status: LoadRequestStatus;
  pickupAt: string;
  createdAt: string | null;
  publishedAt: string | null;
  urgent: boolean;
  cancellationReason: string | null;
}

/**
 * Envelope returned by the API for a collection of load requests.
 */
export interface LoadRequestsResponse extends BaseResponse {
  loadRequests: LoadRequestResource[];
}
