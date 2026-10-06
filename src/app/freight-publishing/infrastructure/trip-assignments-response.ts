import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Subset of the `/trips` resource (owned by Trip Execution) read by Freight Publishing.
 */
export interface TripAssignmentResource extends BaseResource {
  id: number;
  loadRequestId: number;
  carrierId: number;
  vehicleId: number;
  assignedAt: string;
}

/**
 * Envelope returned by the API for a collection of trips.
 */
export interface TripAssignmentsResponse extends BaseResponse {
  trips: TripAssignmentResource[];
}
