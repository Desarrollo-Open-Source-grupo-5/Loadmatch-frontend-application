import {Document} from './document.entity';
import {DocumentType} from './document-type.entity';
import {DocumentDisplayStatus} from './validation-status';

/**
 * A mandatory document type together with the carrier's latest document of that type, if any: one row of the
 * validation status checklist.
 */
export class RequiredDocument {
  readonly #documentType: DocumentType;
  readonly #document: Document | null;

  /**
   * Creates a required document.
   * @param props - Mandatory document type and the carrier's latest document of that type, or null.
   */
  constructor(props: { documentType: DocumentType; document: Document | null }) {
    this.#documentType = props.documentType;
    this.#document = props.document;
  }

  /**
   * Builds the checklist of a carrier: one item per mandatory document type with its most recently uploaded
   * document.
   * @param documentTypes - Document type catalog.
   * @param documents - Documents of the carrier.
   * @returns The required documents.
   */
  static checklist(documentTypes: readonly DocumentType[], documents: readonly Document[]): RequiredDocument[] {
    return documentTypes
      .filter(documentType => documentType.isMandatory())
      .map(documentType => new RequiredDocument({
        documentType,
        document: documents
          .filter(document => document.documentTypeId === documentType.id)
          .reduce<Document | null>((latest, document) =>
            !latest || document.uploadedAt.getTime() > latest.uploadedAt.getTime() ? document : latest, null)
      }));
  }

  /**
   * Mandatory document type.
   */
  get documentType(): DocumentType {
    return this.#documentType;
  }

  /**
   * Latest document of the carrier for this type, or null when it was not uploaded.
   */
  get document(): Document | null {
    return this.#document;
  }

  /**
   * Status to show: the display status of the document, or `NOT_UPLOADED` when there is none.
   * @param today - Current date.
   * @returns The status of the checklist item.
   */
  displayStatus(today: Date): DocumentDisplayStatus {
    return this.#document?.displayStatus(today) ?? 'NOT_UPLOADED';
  }

  /**
   * The carrier must upload a new file when the document is missing, rejected or expired.
   * @param today - Current date.
   * @returns True when a new file is needed.
   */
  requiresNewFile(today: Date): boolean {
    const status = this.displayStatus(today);
    return status === 'NOT_UPLOADED' || status === 'REJECTED' || status === 'EXPIRED';
  }
}
