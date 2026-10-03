import {BaseEntity} from './base-entity';
import {BaseResource, BaseResponse} from './base-response';
import {BaseAssembler} from './base-assembler';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {ErrorHandlingEnabledBaseType} from './error-handling-enabled-base-type';

/**
 * Query string filters accepted by {@link BaseApiEndpoint.getAll}, e.g. `{ shipperId: 1 }`.
 */
export type EndpointQueryParams = Record<string, string | number | boolean>;

/**
 * Generic REST endpoint client providing CRUD operations over one resource collection.
 * @typeParam TEntity - Domain entity handled by the endpoint.
 * @typeParam TResource - Resource shape exchanged with the API.
 * @typeParam TResponse - Envelope shape returned by the API for collections.
 * @typeParam TAssembler - Assembler that maps between resources and entities.
 */
export abstract class BaseApiEndpoint<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse,
  TAssembler extends BaseAssembler<TEntity, TResource, TResponse>
> extends ErrorHandlingEnabledBaseType {
  protected constructor(
    protected http: HttpClient,
    protected endpointUrl: string,
    protected assembler: TAssembler
  ) {
    super();
  }

  /**
   * Fetches all entities from the configured endpoint.
   * @param params - Optional query string filters (e.g. `{ status: 'PUBLISHED' }`).
   * @returns Stream with the mapped entity collection.
   */
  getAll(params?: EndpointQueryParams): Observable<TEntity[]> {
    return this.http.get<TResponse | TResource[]>(this.endpointUrl, {params}).pipe(
      map(response => {
        if (Array.isArray(response)) {
          return response.map(resource => this.assembler.toEntityFromResource(resource));
        }
        return this.assembler.toEntitiesFromResponse(response as TResponse);
      }),
      catchError(this.handleError('Failed to fetch entities'))
    );
  }

  /**
   * Fetches a single entity by identifier.
   * @param id - Entity identifier.
   * @returns Stream with the mapped entity.
   */
  getById(id: number): Observable<TEntity> {
    return this.http.get<TResource>(`${this.endpointUrl}/${id}`).pipe(
      map(resource => this.assembler.toEntityFromResource(resource)),
      catchError(this.handleError('Failed to fetch entity'))
    );
  }

  /**
   * Creates a new entity in the remote endpoint.
   * @param entity - Entity to persist.
   * @returns Stream with the created entity returned by the API.
   */
  create(entity: TEntity): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.post<TResource>(this.endpointUrl, resource).pipe(
      map(created => this.assembler.toEntityFromResource(created)),
      catchError(this.handleError('Failed to create entity'))
    );
  }

  /**
   * Updates an existing entity.
   * @param entity - Entity state to persist.
   * @param id - Identifier of the target entity.
   * @returns Stream with the updated entity returned by the API.
   */
  update(entity: TEntity, id: number): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.put<TResource>(`${this.endpointUrl}/${id}`, resource).pipe(
      map(updated => this.assembler.toEntityFromResource(updated)),
      catchError(this.handleError('Failed to update entity'))
    );
  }

  /**
   * Deletes an entity by identifier.
   * @param id - Identifier of the entity to remove.
   * @returns Completion stream for the delete operation.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpointUrl}/${id}`).pipe(
      catchError(this.handleError('Failed to delete entity'))
    );
  }
}
