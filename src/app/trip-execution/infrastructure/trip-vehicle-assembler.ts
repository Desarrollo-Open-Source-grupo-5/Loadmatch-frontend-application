import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {TripVehicle} from '../domain/model/trip-vehicle';
import {TripVehicleResource, TripVehiclesResponse} from './trip-vehicles-response';

/**
 * Maps vehicle resources to {@link TripVehicle} projections.
 */
export class TripVehicleAssembler implements BaseAssembler<TripVehicle, TripVehicleResource, TripVehiclesResponse> {

  /**
   * Converts a TripVehicleResource to a TripVehicle.
   * @param resource - The resource to convert.
   * @returns The converted TripVehicle.
   */
  toEntityFromResource = (resource: TripVehicleResource): TripVehicle =>
    new TripVehicle({id: resource.id, vehicleTypeId: resource.vehicleTypeId, licensePlate: resource.licensePlate});

  /**
   * Converts a TripVehicle to a TripVehicleResource.
   * @param entity - The projection to convert.
   * @returns The converted TripVehicleResource.
   */
  toResourceFromEntity = (entity: TripVehicle): TripVehicleResource =>
    ({id: entity.id, vehicleTypeId: entity.vehicleTypeId, licensePlate: entity.licensePlate} as TripVehicleResource);

  /**
   * Converts a TripVehiclesResponse to an array of TripVehicle.
   * @param response - The API response containing vehicles.
   * @returns An array of TripVehicle.
   */
  toEntitiesFromResponse = (response: TripVehiclesResponse): TripVehicle[] =>
    response.vehicles.map(resource => this.toEntityFromResource(resource));
}
