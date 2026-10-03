import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Coordinates} from '../../shared/domain/model/coordinates';
import {Dimensions} from '../../shared/domain/model/dimensions';
import {Money} from '../../shared/domain/model/money';
import {LoadRequest} from '../domain/model/load-request.entity';
import {Location} from '../domain/model/location';
import {Route} from '../domain/model/route';
import {LoadRequestResource, LoadRequestsResponse} from './load-requests-response';

/**
 * Maps load request entities to and from the flat API resource.
 */
export class LoadRequestAssembler implements BaseAssembler<LoadRequest, LoadRequestResource, LoadRequestsResponse> {

  /**
   * Converts a LoadRequestResource to a LoadRequest entity, rebuilding its value objects.
   * @param resource - The resource to convert.
   * @returns The converted LoadRequest entity.
   */
  toEntityFromResource = (resource: LoadRequestResource): LoadRequest =>
    new LoadRequest({
      id: resource.id,
      shipperId: resource.shipperId,
      vehicleTypeId: resource.vehicleTypeId,
      route: new Route({
        origin: new Location({
          address: resource.originAddress,
          district: resource.originDistrict,
          coordinates: new Coordinates({latitude: resource.originLat, longitude: resource.originLng})
        }),
        destination: new Location({
          address: resource.destinationAddress,
          district: resource.destinationDistrict,
          coordinates: new Coordinates({latitude: resource.destinationLat, longitude: resource.destinationLng})
        }),
        distanceKm: resource.distanceKm
      }),
      weightKg: resource.weightKg,
      dimensions: new Dimensions({
        lengthM: resource.dimLengthM,
        widthM: resource.dimWidthM,
        heightM: resource.dimHeightM
      }),
      cargoType: resource.cargoType,
      offeredRate: new Money({amount: resource.rateAmount, currency: resource.rateCurrency}),
      status: resource.status,
      pickupAt: new Date(resource.pickupAt),
      createdAt: resource.createdAt ? new Date(resource.createdAt) : null,
      publishedAt: resource.publishedAt ? new Date(resource.publishedAt) : null,
      urgent: resource.urgent,
      cancellationReason: resource.cancellationReason
    });

  /**
   * Converts a LoadRequest entity to a LoadRequestResource.
   * @param entity - The entity to convert.
   * @returns The converted LoadRequestResource.
   */
  toResourceFromEntity = (entity: LoadRequest): LoadRequestResource =>
    ({
      id: entity.id,
      shipperId: entity.shipperId,
      vehicleTypeId: entity.vehicleTypeId,
      originAddress: entity.route.origin.address,
      originDistrict: entity.route.origin.district,
      originLat: entity.route.origin.coordinates.latitude,
      originLng: entity.route.origin.coordinates.longitude,
      destinationAddress: entity.route.destination.address,
      destinationDistrict: entity.route.destination.district,
      destinationLat: entity.route.destination.coordinates.latitude,
      destinationLng: entity.route.destination.coordinates.longitude,
      distanceKm: entity.route.distanceKm,
      weightKg: entity.weightKg,
      dimLengthM: entity.dimensions.lengthM,
      dimWidthM: entity.dimensions.widthM,
      dimHeightM: entity.dimensions.heightM,
      cargoType: entity.cargoType,
      rateAmount: entity.offeredRate.amount,
      rateCurrency: entity.offeredRate.currency,
      status: entity.status,
      pickupAt: entity.pickupAt.toISOString(),
      createdAt: entity.createdAt?.toISOString() ?? null,
      publishedAt: entity.publishedAt?.toISOString() ?? null,
      urgent: entity.urgent,
      cancellationReason: entity.cancellationReason
    } as LoadRequestResource);

  /**
   * Converts a LoadRequestsResponse to an array of LoadRequest entities.
   * @param response - The API response containing load requests.
   * @returns An array of LoadRequest entities.
   */
  toEntitiesFromResponse = (response: LoadRequestsResponse): LoadRequest[] =>
    response.loadRequests.map(resource => this.toEntityFromResource(resource));
}
