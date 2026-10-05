import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {TripVehicleType} from '../domain/model/trip-vehicle-type';
import {TripVehicleTypeResource, TripVehicleTypesResponse} from './trip-vehicle-types-response';

/**
 * Maps vehicle type resources to {@link TripVehicleType} projections.
 */
export class TripVehicleTypeAssembler implements BaseAssembler<TripVehicleType, TripVehicleTypeResource, TripVehicleTypesResponse> {

  /**
   * Converts a TripVehicleTypeResource to a TripVehicleType.
   * @param resource - The resource to convert.
   * @returns The converted TripVehicleType.
   */
  toEntityFromResource = (resource: TripVehicleTypeResource): TripVehicleType =>
    new TripVehicleType({id: resource.id, name: resource.name});

  /**
   * Converts a TripVehicleType to a TripVehicleTypeResource.
   * @param entity - The projection to convert.
   * @returns The converted TripVehicleTypeResource.
   */
  toResourceFromEntity = (entity: TripVehicleType): TripVehicleTypeResource =>
    ({id: entity.id, name: entity.name} as TripVehicleTypeResource);

  /**
   * Converts a TripVehicleTypesResponse to an array of TripVehicleType.
   * @param response - The API response containing vehicle types.
   * @returns An array of TripVehicleType.
   */
  toEntitiesFromResponse = (response: TripVehicleTypesResponse): TripVehicleType[] =>
    response.vehicleTypes.map(resource => this.toEntityFromResource(resource));
}
