import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {DocumentType} from '../domain/model/document-type.entity';
import {DocumentTypeResource, DocumentTypesResponse} from './document-types-response';
import {DocumentTypeAssembler} from './document-type-assembler';

/**
 * Endpoint client for the document type catalog (`/document-types`).
 */
export class DocumentTypesApiEndpoint extends BaseApiEndpoint<DocumentType, DocumentTypeResource, DocumentTypesResponse, DocumentTypeAssembler> {

  /**
   * Creates an instance of DocumentTypesApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderDocumentTypesEndpointPath}`,
      new DocumentTypeAssembler());
  }
}
