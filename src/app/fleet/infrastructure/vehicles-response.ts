import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Vehicle resource exchanged with the `/vehicles` endpoint.
 */
export interface VehicleResource extends BaseResource {
  id: number;
  carrierId: number;
  vehicleTypeId: number;
  licensePlate: string;
  brand: string;
  payloadKg: number;
  active: boolean;
}

/**
 * Envelope returned by the API for a collection of vehicles.
 */
export interface VehiclesResponse extends BaseResponse {
  vehicles: VehicleResource[];
}
