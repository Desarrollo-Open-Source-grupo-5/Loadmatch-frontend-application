import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Subset of the `/vehicles` resource (owned by Fleet) read by Trip Execution.
 */
export interface TripVehicleResource extends BaseResource {
  id: number;
  vehicleTypeId: number;
  licensePlate: string;
}

/**
 * Envelope returned by the API for a collection of vehicles.
 */
export interface TripVehiclesResponse extends BaseResponse {
  vehicles: TripVehicleResource[];
}
