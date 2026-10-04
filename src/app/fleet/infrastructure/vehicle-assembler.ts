import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Vehicle} from '../domain/model/vehicle.entity';
import {VehicleResource, VehiclesResponse} from './vehicles-response';

/**
 * Maps vehicle entities to and from API resources.
 */
export class VehicleAssembler implements BaseAssembler<Vehicle, VehicleResource, VehiclesResponse> {

  /**
   * Converts a VehicleResource to a Vehicle entity.
   * @param resource - The resource to convert.
   * @returns The converted Vehicle entity.
   */
  toEntityFromResource = (resource: VehicleResource): Vehicle =>
    new Vehicle({
      id: resource.id,
      carrierId: resource.carrierId,
      vehicleTypeId: resource.vehicleTypeId,
      licensePlate: resource.licensePlate,
      brand: resource.brand,
      payloadKg: resource.payloadKg,
      active: resource.active
    });

  /**
   * Converts a Vehicle entity to a VehicleResource.
   * @param entity - The entity to convert.
   * @returns The converted VehicleResource.
   */
  toResourceFromEntity = (entity: Vehicle): VehicleResource =>
    ({
      id: entity.id,
      carrierId: entity.carrierId,
      vehicleTypeId: entity.vehicleTypeId,
      licensePlate: entity.licensePlate,
      brand: entity.brand,
      payloadKg: entity.payloadKg,
      active: entity.active
    } as VehicleResource);

  /**
   * Converts a VehiclesResponse to an array of Vehicle entities.
   * @param response - The API response containing vehicles.
   * @returns An array of Vehicle entities.
   */
  toEntitiesFromResponse = (response: VehiclesResponse): Vehicle[] =>
    response.vehicles.map(resource => this.toEntityFromResource(resource));
}
