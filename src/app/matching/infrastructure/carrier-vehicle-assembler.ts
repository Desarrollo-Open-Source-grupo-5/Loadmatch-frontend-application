import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {CarrierVehicle} from '../domain/model/carrier-vehicle';
import {CarrierVehicleResource, CarrierVehiclesResponse} from './carrier-vehicles-response';

/**
 * Maps vehicle resources to {@link CarrierVehicle} projections.
 */
export class CarrierVehicleAssembler implements BaseAssembler<CarrierVehicle, CarrierVehicleResource, CarrierVehiclesResponse> {

  /**
   * Converts a CarrierVehicleResource to a CarrierVehicle.
   * @param resource - The resource to convert.
   * @returns The converted CarrierVehicle.
   */
  toEntityFromResource = (resource: CarrierVehicleResource): CarrierVehicle =>
    new CarrierVehicle({
      id: resource.id,
      carrierId: resource.carrierId,
      vehicleTypeId: resource.vehicleTypeId,
      licensePlate: resource.licensePlate,
      payloadKg: resource.payloadKg,
      active: resource.active
    });

  /**
   * Converts a CarrierVehicle to a CarrierVehicleResource.
   * @param entity - The projection to convert.
   * @returns The converted CarrierVehicleResource.
   */
  toResourceFromEntity = (entity: CarrierVehicle): CarrierVehicleResource =>
    ({
      id: entity.id,
      carrierId: entity.carrierId,
      vehicleTypeId: entity.vehicleTypeId,
      licensePlate: entity.licensePlate,
      payloadKg: entity.payloadKg,
      active: entity.active
    } as CarrierVehicleResource);

  /**
   * Converts a CarrierVehiclesResponse to an array of CarrierVehicle.
   * @param response - The API response containing vehicles.
   * @returns An array of CarrierVehicle.
   */
  toEntitiesFromResponse = (response: CarrierVehiclesResponse): CarrierVehicle[] =>
    response.vehicles.map(resource => this.toEntityFromResource(resource));
}
