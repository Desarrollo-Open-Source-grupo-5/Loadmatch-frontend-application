import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Subset of the `/carriers` resource (owned by Profiles) read by Freight Publishing.
 */
export interface CarrierContactResource extends BaseResource {
  id: number;
  firstNames: string;
  lastNames: string;
  phoneNumber: string;
  reputationAverage: number;
  reputationTotalRatings: number;
}

/**
 * Envelope returned by the API for a collection of carriers.
 */
export interface CarrierContactsResponse extends BaseResponse {
  carriers: CarrierContactResource[];
}
