import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';
import {EnablementStatus} from '../domain/model/enablement-status';

/**
 * Carrier resource exchanged with the `/carriers` endpoint.
 */
export interface CarrierResource extends BaseResource {
  id: number;
  firstNames: string;
  lastNames: string;
  dni: string;
  phoneNumber: string;
  enablementStatus: EnablementStatus;
  reputationAverage: number;
  reputationTotalRatings: number;
}

/**
 * Envelope returned by the API for a collection of carriers.
 */
export interface CarriersResponse extends BaseResponse {
  carriers: CarrierResource[];
}
