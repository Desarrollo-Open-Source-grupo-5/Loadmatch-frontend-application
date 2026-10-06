import {BaseResource, BaseResponse} from '../../shared/infrastructure/base-response';
import {ValidationStatus} from '../domain/model/validation-status';

/**
 * Document resource exchanged with the `/documents` endpoint (flat JSON, camelCase).
 */
export interface DocumentResource extends BaseResource {
  id: number;
  carrierId: number;
  documentTypeId: number;
  fileName: string;
  validationStatus: ValidationStatus;
  rejectionReasonCode: string | null;
  rejectionReasonDescription: string | null;
  issueDate: string | null;
  expirationDate: string | null;
  uploadedAt: string;
  validatedAt: string | null;
}

/**
 * Envelope returned by the API for a collection of documents.
 */
export interface DocumentsResponse extends BaseResponse {
  documents: DocumentResource[];
}
