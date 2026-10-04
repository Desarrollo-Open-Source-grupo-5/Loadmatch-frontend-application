import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Coordinates} from '../../shared/domain/model/coordinates';
import {Money} from '../../shared/domain/model/money';
import {AvailableLoad} from '../domain/model/available-load';
import {AvailableLoadResource, AvailableLoadsResponse} from './available-loads-response';

/**
 * Maps load request resources to {@link AvailableLoad} read models.
 */
export class AvailableLoadAssembler implements BaseAssembler<AvailableLoad, AvailableLoadResource, AvailableLoadsResponse> {

  /**
   * Converts an AvailableLoadResource to an AvailableLoad read model.
   * @param resource - The resource to convert.
   * @returns The converted AvailableLoad (distance to the carrier not computed yet).
   */
  toEntityFromResource = (resource: AvailableLoadResource): AvailableLoad =>
    new AvailableLoad({
      id: resource.id,
      originDistrict: resource.originDistrict,
      originAddress: resource.originAddress,
      originCoordinates: new Coordinates({latitude: resource.originLat, longitude: resource.originLng}),
      destinationDistrict: resource.destinationDistrict,
      destinationAddress: resource.destinationAddress,
      distanceKm: resource.distanceKm,
      weightKg: resource.weightKg,
      cargoType: resource.cargoType,
      vehicleTypeId: resource.vehicleTypeId,
      offeredRate: new Money({amount: resource.rateAmount, currency: resource.rateCurrency}),
      pickupAt: new Date(resource.pickupAt),
      publishedAt: resource.publishedAt ? new Date(resource.publishedAt) : null,
      urgent: resource.urgent
    });

  /**
   * Converts an AvailableLoad read model back to its resource subset.
   * @param entity - The read model to convert.
   * @returns The converted AvailableLoadResource.
   */
  toResourceFromEntity = (entity: AvailableLoad): AvailableLoadResource =>
    ({
      id: entity.id,
      vehicleTypeId: entity.vehicleTypeId,
      originAddress: entity.originAddress,
      originDistrict: entity.originDistrict,
      originLat: entity.originCoordinates.latitude,
      originLng: entity.originCoordinates.longitude,
      destinationAddress: entity.destinationAddress,
      destinationDistrict: entity.destinationDistrict,
      distanceKm: entity.distanceKm,
      weightKg: entity.weightKg,
      cargoType: entity.cargoType,
      rateAmount: entity.offeredRate.amount,
      rateCurrency: entity.offeredRate.currency,
      pickupAt: entity.pickupAt.toISOString(),
      publishedAt: entity.publishedAt?.toISOString() ?? null,
      urgent: entity.urgent
    } as AvailableLoadResource);

  /**
   * Converts an AvailableLoadsResponse to an array of AvailableLoad read models.
   * @param response - The API response containing load requests.
   * @returns An array of AvailableLoad read models.
   */
  toEntitiesFromResponse = (response: AvailableLoadsResponse): AvailableLoad[] =>
    response.loadRequests.map(resource => this.toEntityFromResource(resource));
}
