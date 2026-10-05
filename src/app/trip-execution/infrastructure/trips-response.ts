import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';
import {TripStatus} from '../domain/model/trip-status';

/**
 * Status change of a trip as embedded in the `/trips` resource.
 */
export interface TripStatusChangeResource {
  previousStatus: TripStatus | null;
  newStatus: TripStatus;
  registeredAt: string;
}

/**
 * Trip resource exchanged with the `/trips` endpoint (flat JSON, camelCase, history oldest first).
 */
export interface TripResource extends BaseResource {
  id: number;
  loadRequestId: number;
  shipperId: number;
  carrierId: number;
  vehicleId: number;
  status: TripStatus;
  assignedAt: string;
  pickupAt: string;
  deliveredAt: string | null;
  confirmedAt: string | null;
  completedAt: string | null;
  history: TripStatusChangeResource[];
}

/**
 * Envelope returned by the API for a collection of trips.
 */
export interface TripsResponse extends BaseResponse {
  trips: TripResource[];
}
