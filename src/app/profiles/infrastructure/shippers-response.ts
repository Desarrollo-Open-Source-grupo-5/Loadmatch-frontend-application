import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Shipper resource exchanged with the `/shippers` endpoint.
 */
export interface ShipperResource extends BaseResource {
  id: number;
  ruc: string;
  businessName: string;
  contactName: string;
  phoneNumber: string;
  reputationAverage: number;
  reputationTotalRatings: number;
}

/**
 * Envelope returned by the API for a collection of shippers.
 */
export interface ShippersResponse extends BaseResponse {
  shippers: ShipperResource[];
}
