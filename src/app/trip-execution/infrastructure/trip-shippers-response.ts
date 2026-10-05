import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Subset of the `/shippers` resource (owned by Profiles) read by Trip Execution.
 */
export interface TripShipperResource extends BaseResource {
  id: number;
  businessName: string;
}

/**
 * Envelope returned by the API for a collection of shippers.
 */
export interface TripShippersResponse extends BaseResponse {
  shippers: TripShipperResource[];
}
