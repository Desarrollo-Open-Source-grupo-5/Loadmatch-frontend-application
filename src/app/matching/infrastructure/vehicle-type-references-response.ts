import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Subset of the `/vehicle-types` resource read by Matching.
 */
export interface VehicleTypeReferenceResource extends BaseResource {
  id: number;
  name: string;
}

/**
 * Envelope returned by the API for a collection of vehicle types.
 */
export interface VehicleTypeReferencesResponse extends BaseResponse {
  vehicleTypes: VehicleTypeReferenceResource[];
}
