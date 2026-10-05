import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {Document} from '../domain/model/document.entity';
import {RejectionReason} from '../domain/model/rejection-reason';
import {DocumentResource, DocumentsResponse} from './documents-response';

/**
 * Parses a calendar date (`YYYY-MM-DD`) as local midnight.
 * @param value - Calendar date, or null.
 * @returns The date at local midnight, or null.
 */
const toCalendarDate = (value: string | null): Date | null => {
  if (!value) {
    return null;
  }
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Formats a date as a calendar date (`YYYY-MM-DD`) using its local day.
 * @param date - Date to format, or null.
 * @returns The calendar date, or null.
 */
const toCalendarDateString = (date: Date | null): string | null =>
  date
    ? [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(part => String(part).padStart(2, '0')).join('-')
    : null;

/**
 * Maps document entities to and from the `/documents` resource.
 */
export class DocumentAssembler implements BaseAssembler<Document, DocumentResource, DocumentsResponse> {

  /**
   * Converts a DocumentResource to a Document entity, rebuilding its dates and rejection reason.
   * @param resource - The resource to convert.
   * @returns The converted Document entity.
   */
  toEntityFromResource = (resource: DocumentResource): Document =>
    new Document({
      id: resource.id,
      carrierId: resource.carrierId,
      documentTypeId: resource.documentTypeId,
      fileName: resource.fileName,
      validationStatus: resource.validationStatus,
      rejectionReason: resource.rejectionReasonCode
        ? new RejectionReason({code: resource.rejectionReasonCode, description: resource.rejectionReasonDescription ?? ''})
        : null,
      issueDate: toCalendarDate(resource.issueDate),
      expirationDate: toCalendarDate(resource.expirationDate),
      uploadedAt: new Date(resource.uploadedAt),
      validatedAt: resource.validatedAt ? new Date(resource.validatedAt) : null
    });

  /**
   * Converts a Document entity to a DocumentResource.
   * @param entity - The entity to convert.
   * @returns The converted DocumentResource.
   */
  toResourceFromEntity = (entity: Document): DocumentResource =>
    ({
      id: entity.id,
      carrierId: entity.carrierId,
      documentTypeId: entity.documentTypeId,
      fileName: entity.fileName,
      validationStatus: entity.validationStatus,
      rejectionReasonCode: entity.rejectionReason?.code ?? null,
      rejectionReasonDescription: entity.rejectionReason?.description ?? null,
      issueDate: toCalendarDateString(entity.issueDate),
      expirationDate: toCalendarDateString(entity.expirationDate),
      uploadedAt: entity.uploadedAt.toISOString(),
      validatedAt: entity.validatedAt?.toISOString() ?? null
    } as DocumentResource);

  /**
   * Converts a DocumentsResponse to an array of Document entities.
   * @param response - The API response containing documents.
   * @returns An array of Document entities.
   */
  toEntitiesFromResponse = (response: DocumentsResponse): Document[] =>
    response.documents.map(resource => this.toEntityFromResource(resource));
}
