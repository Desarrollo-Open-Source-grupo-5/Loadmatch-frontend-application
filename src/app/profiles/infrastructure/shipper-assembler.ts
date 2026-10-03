import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Shipper} from '../domain/model/shipper.entity';
import {Reputation} from '../domain/model/reputation';
import {ShipperResource, ShippersResponse} from './shippers-response';

/**
 * Maps shipper entities to and from API resources.
 */
export class ShipperAssembler implements BaseAssembler<Shipper, ShipperResource, ShippersResponse> {

  /**
   * Converts a ShipperResource to a Shipper entity.
   * @param resource - The resource to convert.
   * @returns The converted Shipper entity.
   */
  toEntityFromResource = (resource: ShipperResource): Shipper =>
    new Shipper({
      id: resource.id,
      ruc: resource.ruc,
      businessName: resource.businessName,
      contactName: resource.contactName,
      phoneNumber: resource.phoneNumber,
      reputation: new Reputation({
        average: resource.reputationAverage,
        totalRatings: resource.reputationTotalRatings
      })
    });

  /**
   * Converts a Shipper entity to a ShipperResource.
   * @param entity - The entity to convert.
   * @returns The converted ShipperResource.
   */
  toResourceFromEntity = (entity: Shipper): ShipperResource =>
    ({
      id: entity.id,
      ruc: entity.ruc,
      businessName: entity.businessName,
      contactName: entity.contactName,
      phoneNumber: entity.phoneNumber,
      reputationAverage: entity.reputation.average,
      reputationTotalRatings: entity.reputation.totalRatings
    } as ShipperResource);

  /**
   * Converts a ShippersResponse to an array of Shipper entities.
   * @param response - The API response containing shippers.
   * @returns An array of Shipper entities.
   */
  toEntitiesFromResponse = (response: ShippersResponse): Shipper[] =>
    response.shippers.map(resource => this.toEntityFromResource(resource));
}
