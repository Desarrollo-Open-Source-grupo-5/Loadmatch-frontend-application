import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {Document} from '../domain/model/document.entity';
import {DocumentType} from '../domain/model/document-type.entity';
import {DocumentsApiEndpoint} from './documents-api-endpoint';
import {DocumentTypesApiEndpoint} from './document-types-api-endpoint';

/**
 * Infrastructure facade for the Document Validation context: the document type catalog and the documents of a
 * carrier.
 */
@Injectable({providedIn: 'root'})
export class DocumentsApi extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly documentsEndpoint = new DocumentsApiEndpoint(this.http);
  private readonly documentTypesEndpoint = new DocumentTypesApiEndpoint(this.http);

  /**
   * Retrieves the document type catalog.
   * @returns Stream with the document types.
   */
  getDocumentTypes = (): Observable<DocumentType[]> =>
    this.documentTypesEndpoint.getAll();

  /**
   * Retrieves the documents uploaded by a carrier.
   * @param carrierId - Carrier identifier.
   * @returns Stream with the carrier's documents.
   */
  getCarrierDocuments = (carrierId: number): Observable<Document[]> =>
    this.documentsEndpoint.getByCarrierId(carrierId);
}
