import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Subset of the `/vehicles` resource read by Matching.
 */
export interface CarrierVehicleResource extends BaseResource {
  id: number;
  carrierId: number;
  vehicleTypeId: number;
  licensePlate: string;
  payloadKg: number;
  active: boolean;
}

/**
 * Envelope returned by the API for a collection of vehicles.
 */
export interface CarrierVehiclesResponse extends BaseResponse {
  vehicles: CarrierVehicleResource[];
}
