import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {TripAssignment} from '../domain/model/trip-assignment';
import {TripAssignmentResource, TripAssignmentsResponse} from './trip-assignments-response';

/**
 * Maps trip assignments to and from the `/trips` resource.
 */
export class TripAssignmentAssembler implements BaseAssembler<TripAssignment, TripAssignmentResource, TripAssignmentsResponse> {

  /**
   * Converts a TripAssignmentResource to a TripAssignment.
   * @param resource - The resource to convert.
   * @returns The converted TripAssignment.
   */
  toEntityFromResource = (resource: TripAssignmentResource): TripAssignment =>
    new TripAssignment({
      id: resource.id,
      loadRequestId: resource.loadRequestId,
      carrierId: resource.carrierId,
      vehicleId: resource.vehicleId,
      assignedAt: new Date(resource.assignedAt)
    });

  /**
   * Converts a TripAssignment to a TripAssignmentResource.
   * @param entity - The entity to convert.
   * @returns The converted TripAssignmentResource.
   */
  toResourceFromEntity = (entity: TripAssignment): TripAssignmentResource =>
    ({
      id: entity.id,
      loadRequestId: entity.loadRequestId,
      carrierId: entity.carrierId,
      vehicleId: entity.vehicleId,
      assignedAt: entity.assignedAt.toISOString()
    } as TripAssignmentResource);

  /**
   * Converts a TripAssignmentsResponse to an array of TripAssignment.
   * @param response - The API response containing trips.
   * @returns An array of TripAssignment.
   */
  toEntitiesFromResponse = (response: TripAssignmentsResponse): TripAssignment[] =>
    response.trips.map(resource => this.toEntityFromResource(resource));
}
