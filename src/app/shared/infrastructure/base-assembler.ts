import {BaseEntity} from './base-entity';
import {BaseResource, BaseResponse} from './base-response';

/**
 * Defines conversions between domain entities and API resources, as well as between API responses and domain
 * entities.
 * @typeParam TEntity - The type of the domain entity.
 * @typeParam TResource - Resource type returned by the API for the entity.
 * @typeParam TResponse - Response type returned by the API for a collection of entities.
 */
export interface BaseAssembler<TEntity extends BaseEntity, TResource extends BaseResource, TResponse extends BaseResponse> {

  /**
   * Converts an API resource into a domain entity.
   * @param resource - The API resource to convert.
   * @returns The corresponding domain entity.
   */
  toEntityFromResource(resource: TResource): TEntity;

  /**
   * Converts a domain entity into an API resource.
   * @param entity - The domain entity to convert.
   * @returns The corresponding API resource.
   */
  toResourceFromEntity(entity: TEntity): TResource;

  /**
   * Converts an API response into an array of domain entities.
   * @param response - The API response to convert.
   * @returns An array of corresponding domain entities.
   */
  toEntitiesFromResponse(response: TResponse): TEntity[];
}
