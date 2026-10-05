import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {TripCarrier} from '../domain/model/trip-carrier';
import {TripCarrierResource, TripCarriersResponse} from './trip-carriers-response';

/**
 * Maps carrier resources to {@link TripCarrier} projections.
 */
export class TripCarrierAssembler implements BaseAssembler<TripCarrier, TripCarrierResource, TripCarriersResponse> {

  /**
   * Converts a TripCarrierResource to a TripCarrier.
   * @param resource - The resource to convert.
   * @returns The converted TripCarrier.
   */
  toEntityFromResource = (resource: TripCarrierResource): TripCarrier =>
    new TripCarrier({id: resource.id, firstNames: resource.firstNames, lastNames: resource.lastNames});

  /**
   * Converts a TripCarrier to a TripCarrierResource.
   * @param entity - The projection to convert.
   * @returns The converted TripCarrierResource.
   */
  toResourceFromEntity = (entity: TripCarrier): TripCarrierResource =>
    ({id: entity.id, firstNames: entity.firstNames, lastNames: entity.lastNames} as TripCarrierResource);

  /**
   * Converts a TripCarriersResponse to an array of TripCarrier.
   * @param response - The API response containing carriers.
   * @returns An array of TripCarrier.
   */
  toEntitiesFromResponse = (response: TripCarriersResponse): TripCarrier[] =>
    response.carriers.map(resource => this.toEntityFromResource(resource));
}
