import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {DocumentType} from '../domain/model/document-type.entity';
import {DocumentTypeResource, DocumentTypesResponse} from './document-types-response';

/**
 * Maps document type entities to and from the `/document-types` resource.
 */
export class DocumentTypeAssembler implements BaseAssembler<DocumentType, DocumentTypeResource, DocumentTypesResponse> {

  /**
   * Converts a DocumentTypeResource to a DocumentType entity.
   * @param resource - The resource to convert.
   * @returns The converted DocumentType entity.
   */
  toEntityFromResource = (resource: DocumentTypeResource): DocumentType =>
    new DocumentType({
      id: resource.id,
      code: resource.code,
      name: resource.name,
      mandatory: resource.mandatory,
      requiresExpiration: resource.requiresExpiration
    });

  /**
   * Converts a DocumentType entity to a DocumentTypeResource.
   * @param entity - The entity to convert.
   * @returns The converted DocumentTypeResource.
   */
  toResourceFromEntity = (entity: DocumentType): DocumentTypeResource =>
    ({
      id: entity.id,
      code: entity.code,
      name: entity.name,
      mandatory: entity.mandatory,
      requiresExpiration: entity.requiresExpiration
    } as DocumentTypeResource);

  /**
   * Converts a DocumentTypesResponse to an array of DocumentType entities.
   * @param response - The API response containing document types.
   * @returns An array of DocumentType entities.
   */
  toEntitiesFromResponse = (response: DocumentTypesResponse): DocumentType[] =>
    response.documentTypes.map(resource => this.toEntityFromResource(resource));
}
