import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Subset of the `/shippers` resource (owned by Profiles) read by Matching.
 */
export interface ShipperReferenceResource extends BaseResource {
  id: number;
  businessName: string;
  reputationAverage: number;
  reputationTotalRatings: number;
}

/**
 * Envelope returned by the API for a collection of shippers.
 */
export interface ShipperReferencesResponse extends BaseResponse {
  shippers: ShipperReferenceResource[];
}
