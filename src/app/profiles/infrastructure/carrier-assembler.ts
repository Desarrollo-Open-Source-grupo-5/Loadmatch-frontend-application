import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Carrier} from '../domain/model/carrier.entity';
import {Reputation} from '../domain/model/reputation';
import {CarrierResource, CarriersResponse} from './carriers-response';

/**
 * Maps carrier entities to and from API resources.
 */
export class CarrierAssembler implements BaseAssembler<Carrier, CarrierResource, CarriersResponse> {

  /**
   * Converts a CarrierResource to a Carrier entity.
   * @param resource - The resource to convert.
   * @returns The converted Carrier entity.
   */
  toEntityFromResource = (resource: CarrierResource): Carrier =>
    new Carrier({
      id: resource.id,
      firstNames: resource.firstNames,
      lastNames: resource.lastNames,
      dni: resource.dni,
      phoneNumber: resource.phoneNumber,
      enablementStatus: resource.enablementStatus,
      reputation: new Reputation({
        average: resource.reputationAverage,
        totalRatings: resource.reputationTotalRatings
      })
    });

  /**
   * Converts a Carrier entity to a CarrierResource.
   * @param entity - The entity to convert.
   * @returns The converted CarrierResource.
   */
  toResourceFromEntity = (entity: Carrier): CarrierResource =>
    ({
      id: entity.id,
      firstNames: entity.firstNames,
      lastNames: entity.lastNames,
      dni: entity.dni,
      phoneNumber: entity.phoneNumber,
      enablementStatus: entity.enablementStatus,
      reputationAverage: entity.reputation.average,
      reputationTotalRatings: entity.reputation.totalRatings
    } as CarrierResource);

  /**
   * Converts a CarriersResponse to an array of Carrier entities.
   * @param response - The API response containing carriers.
   * @returns An array of Carrier entities.
   */
  toEntitiesFromResponse = (response: CarriersResponse): Carrier[] =>
    response.carriers.map(resource => this.toEntityFromResource(resource));
}
