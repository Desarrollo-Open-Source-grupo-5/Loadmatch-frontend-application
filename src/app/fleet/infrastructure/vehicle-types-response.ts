import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Vehicle type resource exchanged with the `/vehicle-types` endpoint.
 */
export interface VehicleTypeResource extends BaseResource {
  id: number;
  name: string;
  description: string;
  maxWeightKg: number;
  dimMaxLengthM: number;
  dimMaxWidthM: number;
  dimMaxHeightM: number;
  active: boolean;
}

/**
 * Envelope returned by the API for a collection of vehicle types.
 */
export interface VehicleTypesResponse extends BaseResponse {
  vehicleTypes: VehicleTypeResource[];
}
