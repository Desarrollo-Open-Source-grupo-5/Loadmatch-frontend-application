import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Subset of the `/carriers` resource (owned by Profiles) read by Trip Execution.
 */
export interface TripCarrierResource extends BaseResource {
  id: number;
  firstNames: string;
  lastNames: string;
}

/**
 * Envelope returned by the API for a collection of carriers.
 */
export interface TripCarriersResponse extends BaseResponse {
  carriers: TripCarrierResource[];
}
