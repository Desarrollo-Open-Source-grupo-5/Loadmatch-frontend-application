import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {TripShipper} from '../domain/model/trip-shipper';
import {TripShipperResource, TripShippersResponse} from './trip-shippers-response';

/**
 * Maps shipper resources to {@link TripShipper} projections.
 */
export class TripShipperAssembler implements BaseAssembler<TripShipper, TripShipperResource, TripShippersResponse> {

  /**
   * Converts a TripShipperResource to a TripShipper.
   * @param resource - The resource to convert.
   * @returns The converted TripShipper.
   */
  toEntityFromResource = (resource: TripShipperResource): TripShipper =>
    new TripShipper({id: resource.id, businessName: resource.businessName});

  /**
   * Converts a TripShipper to a TripShipperResource.
   * @param entity - The projection to convert.
   * @returns The converted TripShipperResource.
   */
  toResourceFromEntity = (entity: TripShipper): TripShipperResource =>
    ({id: entity.id, businessName: entity.businessName} as TripShipperResource);

  /**
   * Converts a TripShippersResponse to an array of TripShipper.
   * @param response - The API response containing shippers.
   * @returns An array of TripShipper.
   */
  toEntitiesFromResponse = (response: TripShippersResponse): TripShipper[] =>
    response.shippers.map(resource => this.toEntityFromResource(resource));
}
