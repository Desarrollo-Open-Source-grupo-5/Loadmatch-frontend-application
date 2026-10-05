import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Money} from '../../shared/domain/model/money';
import {TripLoadRequest} from '../domain/model/trip-load-request';
import {TripLoadRequestResource, TripLoadRequestsResponse} from './trip-load-requests-response';

/**
 * Maps load request resources to {@link TripLoadRequest} projections.
 */
export class TripLoadRequestAssembler implements BaseAssembler<TripLoadRequest, TripLoadRequestResource, TripLoadRequestsResponse> {

  /**
   * Converts a TripLoadRequestResource to a TripLoadRequest.
   * @param resource - The resource to convert.
   * @returns The converted TripLoadRequest.
   */
  toEntityFromResource = (resource: TripLoadRequestResource): TripLoadRequest =>
    new TripLoadRequest({
      id: resource.id,
      shipperId: resource.shipperId,
      originDistrict: resource.originDistrict,
      originAddress: resource.originAddress,
      destinationDistrict: resource.destinationDistrict,
      destinationAddress: resource.destinationAddress,
      distanceKm: resource.distanceKm,
      cargoType: resource.cargoType,
      weightKg: resource.weightKg,
      offeredRate: new Money({amount: resource.rateAmount, currency: resource.rateCurrency}),
      pickupAt: new Date(resource.pickupAt)
    });

  /**
   * Converts a TripLoadRequest back to its resource subset.
   * @param entity - The projection to convert.
   * @returns The converted TripLoadRequestResource.
   */
  toResourceFromEntity = (entity: TripLoadRequest): TripLoadRequestResource =>
    ({
      id: entity.id,
      shipperId: entity.shipperId,
      originAddress: entity.originAddress,
      originDistrict: entity.originDistrict,
      destinationAddress: entity.destinationAddress,
      destinationDistrict: entity.destinationDistrict,
      distanceKm: entity.distanceKm,
      weightKg: entity.weightKg,
      cargoType: entity.cargoType,
      rateAmount: entity.offeredRate.amount,
      rateCurrency: entity.offeredRate.currency,
      pickupAt: entity.pickupAt.toISOString()
    } as TripLoadRequestResource);

  /**
   * Converts a TripLoadRequestsResponse to an array of TripLoadRequest.
   * @param response - The API response containing load requests.
   * @returns An array of TripLoadRequest.
   */
  toEntitiesFromResponse = (response: TripLoadRequestsResponse): TripLoadRequest[] =>
    response.loadRequests.map(resource => this.toEntityFromResource(resource));
}
