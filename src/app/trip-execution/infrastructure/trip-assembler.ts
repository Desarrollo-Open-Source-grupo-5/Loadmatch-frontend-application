import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Trip} from '../domain/model/trip.entity';
import {TripStatusChange} from '../domain/model/trip-status-change';
import {TripResource, TripsResponse} from './trips-response';

/**
 * Maps trip entities to and from the `/trips` resource, including the status history.
 */
export class TripAssembler implements BaseAssembler<Trip, TripResource, TripsResponse> {

  /**
   * Converts a TripResource to a Trip entity, rebuilding its dates and status changes.
   * @param resource - The resource to convert.
   * @returns The converted Trip entity.
   */
  toEntityFromResource = (resource: TripResource): Trip =>
    new Trip({
      id: resource.id,
      loadRequestId: resource.loadRequestId,
      shipperId: resource.shipperId,
      carrierId: resource.carrierId,
      vehicleId: resource.vehicleId,
      status: resource.status,
      assignedAt: new Date(resource.assignedAt),
      pickupAt: new Date(resource.pickupAt),
      deliveredAt: resource.deliveredAt ? new Date(resource.deliveredAt) : null,
      confirmedAt: resource.confirmedAt ? new Date(resource.confirmedAt) : null,
      completedAt: resource.completedAt ? new Date(resource.completedAt) : null,
      history: (resource.history ?? []).map(change => new TripStatusChange({
        previousStatus: change.previousStatus,
        newStatus: change.newStatus,
        registeredAt: new Date(change.registeredAt)
      }))
    });

  /**
   * Converts a Trip entity to a TripResource.
   * @param entity - The entity to convert.
   * @returns The converted TripResource.
   */
  toResourceFromEntity = (entity: Trip): TripResource =>
    ({
      id: entity.id,
      loadRequestId: entity.loadRequestId,
      shipperId: entity.shipperId,
      carrierId: entity.carrierId,
      vehicleId: entity.vehicleId,
      status: entity.status,
      assignedAt: entity.assignedAt.toISOString(),
      pickupAt: entity.pickupAt.toISOString(),
      deliveredAt: entity.deliveredAt?.toISOString() ?? null,
      confirmedAt: entity.confirmedAt?.toISOString() ?? null,
      completedAt: entity.completedAt?.toISOString() ?? null,
      history: entity.history.map(change => ({
        previousStatus: change.previousStatus,
        newStatus: change.newStatus,
        registeredAt: change.registeredAt.toISOString()
      }))
    } as TripResource);

  /**
   * Converts a TripsResponse to an array of Trip entities.
   * @param response - The API response containing trips.
   * @returns An array of Trip entities.
   */
  toEntitiesFromResponse = (response: TripsResponse): Trip[] =>
    response.trips.map(resource => this.toEntityFromResource(resource));
}
