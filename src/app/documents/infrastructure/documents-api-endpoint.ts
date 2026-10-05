import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {Document} from '../domain/model/document.entity';
import {DocumentResource, DocumentsResponse} from './documents-response';
import {DocumentAssembler} from './document-assembler';

/**
 * Endpoint client for the carrier documents (`/documents`) of the Document Validation context.
 */
export class DocumentsApiEndpoint extends BaseApiEndpoint<Document, DocumentResource, DocumentsResponse, DocumentAssembler> {

  /**
   * Creates an instance of DocumentsApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderDocumentsEndpointPath}`,
      new DocumentAssembler());
  }

  /**
   * Fetches the documents of a carrier, including the ones replaced by newer uploads.
   * @param carrierId - Carrier identifier.
   * @returns Stream with the carrier's documents.
   */
  getByCarrierId(carrierId: number): Observable<Document[]> {
    return this.getAll({carrierId});
  }
}
