import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {VehicleTypeReference} from '../domain/model/vehicle-type-reference';
import {VehicleTypeReferenceResource, VehicleTypeReferencesResponse} from './vehicle-type-references-response';

/**
 * Maps vehicle type resources to {@link VehicleTypeReference} projections.
 */
export class VehicleTypeReferenceAssembler implements BaseAssembler<VehicleTypeReference, VehicleTypeReferenceResource, VehicleTypeReferencesResponse> {

  /**
   * Converts a VehicleTypeReferenceResource to a VehicleTypeReference.
   * @param resource - The resource to convert.
   * @returns The converted VehicleTypeReference.
   */
  toEntityFromResource = (resource: VehicleTypeReferenceResource): VehicleTypeReference =>
    new VehicleTypeReference({id: resource.id, name: resource.name});

  /**
   * Converts a VehicleTypeReference to a VehicleTypeReferenceResource.
   * @param entity - The projection to convert.
   * @returns The converted VehicleTypeReferenceResource.
   */
  toResourceFromEntity = (entity: VehicleTypeReference): VehicleTypeReferenceResource =>
    ({id: entity.id, name: entity.name} as VehicleTypeReferenceResource);

  /**
   * Converts a VehicleTypeReferencesResponse to an array of VehicleTypeReference.
   * @param response - The API response containing vehicle types.
   * @returns An array of VehicleTypeReference.
   */
  toEntitiesFromResponse = (response: VehicleTypeReferencesResponse): VehicleTypeReference[] =>
    response.vehicleTypes.map(resource => this.toEntityFromResource(resource));
}
