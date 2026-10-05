import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';

/**
 * Document type resource exchanged with the `/document-types` endpoint.
 */
export interface DocumentTypeResource extends BaseResource {
  id: number;
  code: string;
  name: string;
  mandatory: boolean;
  requiresExpiration: boolean;
}

/**
 * Envelope returned by the API for a collection of document types.
 */
export interface DocumentTypesResponse extends BaseResponse {
  documentTypes: DocumentTypeResource[];
}
