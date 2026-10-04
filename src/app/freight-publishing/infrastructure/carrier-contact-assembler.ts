import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {CarrierContact} from '../domain/model/carrier-contact';
import {CarrierContactResource, CarrierContactsResponse} from './carrier-contacts-response';

/**
 * Maps carrier contacts to and from the `/carriers` resource.
 */
export class CarrierContactAssembler implements BaseAssembler<CarrierContact, CarrierContactResource, CarrierContactsResponse> {

  /**
   * Converts a CarrierContactResource to a CarrierContact.
   * @param resource - The resource to convert.
   * @returns The converted CarrierContact.
   */
  toEntityFromResource = (resource: CarrierContactResource): CarrierContact =>
    new CarrierContact({
      id: resource.id,
      firstNames: resource.firstNames,
      lastNames: resource.lastNames,
      phoneNumber: resource.phoneNumber,
      reputationAverage: resource.reputationAverage,
      reputationTotalRatings: resource.reputationTotalRatings
    });

  /**
   * Converts a CarrierContact to a CarrierContactResource.
   * @param entity - The entity to convert.
   * @returns The converted CarrierContactResource.
   */
  toResourceFromEntity = (entity: CarrierContact): CarrierContactResource =>
    ({
      id: entity.id,
      firstNames: entity.firstNames,
      lastNames: entity.lastNames,
      phoneNumber: entity.phoneNumber,
      reputationAverage: entity.reputationAverage,
      reputationTotalRatings: entity.reputationTotalRatings
    } as CarrierContactResource);

  /**
   * Converts a CarrierContactsResponse to an array of CarrierContact.
   * @param response - The API response containing carriers.
   * @returns An array of CarrierContact.
   */
  toEntitiesFromResponse = (response: CarrierContactsResponse): CarrierContact[] =>
    response.carriers.map(resource => this.toEntityFromResource(resource));
}
