import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Subset of the `/vehicles` resource read by Matching.
 */
export interface CarrierVehicleResource extends BaseResource {
  id: string;
  carrierId: string;
  vehicleTypeId: string;
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
