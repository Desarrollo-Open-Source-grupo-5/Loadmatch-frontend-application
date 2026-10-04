import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Subset of the `/vehicle-types` resource read by Freight Publishing.
 */
export interface VehicleTypeOptionResource extends BaseResource {
  id: number;
  name: string;
  maxWeightKg: number;
  active: boolean;
}

/**
 * Envelope returned by the API for a collection of vehicle types.
 */
export interface VehicleTypeOptionsResponse extends BaseResponse {
  vehicleTypes: VehicleTypeOptionResource[];
}
