import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {AssignedVehicle} from '../domain/model/assigned-vehicle';
import {AssignedVehicleResource, AssignedVehiclesResponse} from './assigned-vehicles-response';

/**
 * Maps assigned vehicles to and from the `/vehicles` resource.
 */
export class AssignedVehicleAssembler implements BaseAssembler<AssignedVehicle, AssignedVehicleResource, AssignedVehiclesResponse> {

  /**
   * Converts an AssignedVehicleResource to an AssignedVehicle.
   * @param resource - The resource to convert.
   * @returns The converted AssignedVehicle.
   */
  toEntityFromResource = (resource: AssignedVehicleResource): AssignedVehicle =>
    new AssignedVehicle({
      id: resource.id,
      vehicleTypeId: resource.vehicleTypeId,
      licensePlate: resource.licensePlate,
      payloadKg: resource.payloadKg
    });

  /**
   * Converts an AssignedVehicle to an AssignedVehicleResource.
   * @param entity - The entity to convert.
   * @returns The converted AssignedVehicleResource.
   */
  toResourceFromEntity = (entity: AssignedVehicle): AssignedVehicleResource =>
    ({
      id: entity.id,
      vehicleTypeId: entity.vehicleTypeId,
      licensePlate: entity.licensePlate,
      payloadKg: entity.payloadKg
    } as AssignedVehicleResource);

  /**
   * Converts an AssignedVehiclesResponse to an array of AssignedVehicle.
   * @param response - The API response containing vehicles.
   * @returns An array of AssignedVehicle.
   */
  toEntitiesFromResponse = (response: AssignedVehiclesResponse): AssignedVehicle[] =>
    response.vehicles.map(resource => this.toEntityFromResource(resource));
}
