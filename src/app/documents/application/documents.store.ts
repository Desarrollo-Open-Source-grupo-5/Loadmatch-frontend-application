import {computed, inject, Injectable, signal} from '@angular/core';
import {forkJoin} from 'rxjs';
import {Document} from '../domain/model/document.entity';
import {DocumentType} from '../domain/model/document-type.entity';
import {RequiredDocument} from '../domain/model/required-document';
import {DocumentsApi} from '../infrastructure/documents-api';

/**
 * Holds Document Validation state: the document type catalog and the active carrier's documents, arranged as the
 * checklist of mandatory documents.
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentsStore {
  private readonly documentsApi = inject(DocumentsApi);

  private readonly documentTypesSignal = signal<DocumentType[]>([]);

  /**
   * Readonly signal with the document type catalog.
   */
  readonly documentTypes = this.documentTypesSignal.asReadonly();

  private readonly documentsSignal = signal<Document[]>([]);

  /**
   * Readonly signal with every document of the carrier last requested, including replaced ones.
   */
  readonly documents = this.documentsSignal.asReadonly();

  /**
   * Computed signal with one item per mandatory document type and the carrier's latest document of that type.
   */
  readonly requiredDocuments = computed(() => RequiredDocument.checklist(this.documentTypes(), this.documents()));

  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Readonly signal indicating if documents are loading.
   */
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);

  /**
   * Readonly signal for the current error message.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Carrier whose documents were last requested, used to ignore late responses.
   */
  private carrierId: number | null = null;

  /**
   * Loads the document type catalog and the documents of a carrier together, so the checklist is complete when it
   * appears.
   * @param carrierId - Carrier identifier.
   */
  loadCarrierDocuments = (carrierId: number): void => {
    if (this.carrierId !== carrierId) {
      this.documentsSignal.set([]);
    }
    this.carrierId = carrierId;
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    forkJoin({
      documentTypes: this.documentsApi.getDocumentTypes(),
      documents: this.documentsApi.getCarrierDocuments(carrierId)
    }).subscribe({
      next: ({documentTypes, documents}) => {
        // Ignore late responses that belong to a previously requested carrier.
        if (this.carrierId === carrierId) {
          this.documentTypesSignal.set(documentTypes);
          this.documentsSignal.set(documents);
          this.loadingSignal.set(false);
        }
      },
      error: err => {
        if (this.carrierId === carrierId) {
          this.errorSignal.set(this.formatError(err, 'Failed to load documents'));
          this.loadingSignal.set(false);
        }
      }
    });
  };

  /**
   * Normalizes unknown errors into a display-friendly message.
   * @param error - Source error.
   * @param fallback - Default message when details are unavailable.
   * @returns Normalized message.
   */
  private formatError = (error: unknown, fallback: string): string => {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  };
}
