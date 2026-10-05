import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Subset of the `/vehicle-types` resource (owned by Fleet) read by Trip Execution.
 */
export interface TripVehicleTypeResource extends BaseResource {
  id: number;
  name: string;
}

/**
 * Envelope returned by the API for a collection of vehicle types.
 */
export interface TripVehicleTypesResponse extends BaseResponse {
  vehicleTypes: TripVehicleTypeResource[];
}
