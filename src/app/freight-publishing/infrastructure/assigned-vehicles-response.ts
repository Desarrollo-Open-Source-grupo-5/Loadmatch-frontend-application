import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Subset of the `/vehicles` resource (owned by Fleet) read by Freight Publishing.
 */
export interface AssignedVehicleResource extends BaseResource {
  id: number;
  vehicleTypeId: number;
  licensePlate: string;
  payloadKg: number;
}

/**
 * Envelope returned by the API for a collection of vehicles.
 */
export interface AssignedVehiclesResponse extends BaseResponse {
  vehicles: AssignedVehicleResource[];
}
