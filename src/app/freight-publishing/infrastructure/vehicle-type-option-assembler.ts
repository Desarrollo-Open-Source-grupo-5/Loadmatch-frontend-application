import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {VehicleTypeOption} from '../domain/model/vehicle-type-option';
import {VehicleTypeOptionResource, VehicleTypeOptionsResponse} from './vehicle-type-options-response';

/**
 * Maps vehicle type options to and from the `/vehicle-types` resource.
 */
export class VehicleTypeOptionAssembler implements BaseAssembler<VehicleTypeOption, VehicleTypeOptionResource, VehicleTypeOptionsResponse> {

  /**
   * Converts a VehicleTypeOptionResource to a VehicleTypeOption.
   * @param resource - The resource to convert.
   * @returns The converted VehicleTypeOption.
   */
  toEntityFromResource = (resource: VehicleTypeOptionResource): VehicleTypeOption =>
    new VehicleTypeOption({
      id: resource.id,
      name: resource.name,
      maxWeightKg: resource.maxWeightKg,
      active: resource.active
    });

  /**
   * Converts a VehicleTypeOption to a VehicleTypeOptionResource.
   * @param entity - The entity to convert.
   * @returns The converted VehicleTypeOptionResource.
   */
  toResourceFromEntity = (entity: VehicleTypeOption): VehicleTypeOptionResource =>
    ({
      id: entity.id,
      name: entity.name,
      maxWeightKg: entity.maxWeightKg,
      active: entity.active
    } as VehicleTypeOptionResource);

  /**
   * Converts a VehicleTypeOptionsResponse to an array of VehicleTypeOption.
   * @param response - The API response containing vehicle types.
   * @returns An array of VehicleTypeOption.
   */
  toEntitiesFromResponse = (response: VehicleTypeOptionsResponse): VehicleTypeOption[] =>
    response.vehicleTypes.map(resource => this.toEntityFromResource(resource));
}
