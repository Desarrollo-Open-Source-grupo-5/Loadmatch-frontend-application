import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {ShipperReference} from '../domain/model/shipper-reference';
import {ShipperReferenceResource, ShipperReferencesResponse} from './shipper-references-response';

/**
 * Maps shipper resources to {@link ShipperReference} projections.
 */
export class ShipperReferenceAssembler implements BaseAssembler<ShipperReference, ShipperReferenceResource, ShipperReferencesResponse> {

  /**
   * Converts a ShipperReferenceResource to a ShipperReference.
   * @param resource - The resource to convert.
   * @returns The converted ShipperReference.
   */
  toEntityFromResource = (resource: ShipperReferenceResource): ShipperReference =>
    new ShipperReference({
      id: resource.id,
      businessName: resource.businessName,
      reputationAverage: resource.reputationAverage,
      reputationTotalRatings: resource.reputationTotalRatings
    });

  /**
   * Converts a ShipperReference to a ShipperReferenceResource.
   * @param entity - The projection to convert.
   * @returns The converted ShipperReferenceResource.
   */
  toResourceFromEntity = (entity: ShipperReference): ShipperReferenceResource =>
    ({
      id: entity.id,
      businessName: entity.businessName,
      reputationAverage: entity.reputationAverage,
      reputationTotalRatings: entity.reputationTotalRatings
    } as ShipperReferenceResource);

  /**
   * Converts a ShipperReferencesResponse to an array of ShipperReference.
   * @param response - The API response containing shippers.
   * @returns An array of ShipperReference.
   */
  toEntitiesFromResponse = (response: ShipperReferencesResponse): ShipperReference[] =>
    response.shippers.map(resource => this.toEntityFromResource(resource));
}
