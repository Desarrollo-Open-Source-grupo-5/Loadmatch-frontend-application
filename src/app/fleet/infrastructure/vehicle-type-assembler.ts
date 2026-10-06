import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Dimensions} from '../../shared/domain/model/dimensions';
import {VehicleType} from '../domain/model/vehicle-type.entity';
import {VehicleTypeResource, VehicleTypesResponse} from './vehicle-types-response';

/**
 * Maps vehicle type entities to and from API resources.
 */
export class VehicleTypeAssembler implements BaseAssembler<VehicleType, VehicleTypeResource, VehicleTypesResponse> {

  /**
   * Converts a VehicleTypeResource to a VehicleType entity.
   * @param resource - The resource to convert.
   * @returns The converted VehicleType entity.
   */
  toEntityFromResource = (resource: VehicleTypeResource): VehicleType =>
    new VehicleType({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      maxWeightKg: resource.maxWeightKg,
      maxDimensions: new Dimensions({
        lengthM: resource.dimMaxLengthM,
        widthM: resource.dimMaxWidthM,
        heightM: resource.dimMaxHeightM
      }),
      active: resource.active
    });

  /**
   * Converts a VehicleType entity to a VehicleTypeResource.
   * @param entity - The entity to convert.
   * @returns The converted VehicleTypeResource.
   */
  toResourceFromEntity = (entity: VehicleType): VehicleTypeResource =>
    ({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      maxWeightKg: entity.maxWeightKg,
      dimMaxLengthM: entity.maxDimensions.lengthM,
      dimMaxWidthM: entity.maxDimensions.widthM,
      dimMaxHeightM: entity.maxDimensions.heightM,
      active: entity.active
    } as VehicleTypeResource);

  /**
   * Converts a VehicleTypesResponse to an array of VehicleType entities.
   * @param response - The API response containing vehicle types.
   * @returns An array of VehicleType entities.
   */
  toEntitiesFromResponse = (response: VehicleTypesResponse): VehicleType[] =>
    response.vehicleTypes.map(resource => this.toEntityFromResource(resource));
}
