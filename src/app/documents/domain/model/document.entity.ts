import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {RejectionReason} from './rejection-reason';
import {ValidationStatus} from './validation-status';

/**
 * Milliseconds in a day, used to count calendar days.
 */
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * File a carrier uploaded to prove one of its document types and its validation result (aggregate root `Document` of
 * the Document Validation context, simplified for the Web Application).
 */
export class Document implements BaseEntity {
  /**
   * An approved document that expires within this many days shows a renewal warning.
   */
  static readonly EXPIRATION_WARNING_DAYS = 15;

  readonly #id: number;
  readonly #carrierId: number;
  readonly #documentTypeId: number;
  readonly #fileName: string;
  readonly #validationStatus: ValidationStatus;
  readonly #rejectionReason: RejectionReason | null;
  readonly #issueDate: Date | null;
  readonly #expirationDate: Date | null;
  readonly #uploadedAt: Date;
  readonly #validatedAt: Date | null;

  /**
   * Creates a document.
   * @param document - Document attributes.
   */
  constructor(document: {
    id: number;
    carrierId: number;
    documentTypeId: number;
    fileName: string;
    validationStatus: ValidationStatus;
    rejectionReason?: RejectionReason | null;
    issueDate?: Date | null;
    expirationDate?: Date | null;
    uploadedAt: Date;
    validatedAt?: Date | null;
  }) {
    this.#id = document.id;
    this.#carrierId = document.carrierId;
    this.#documentTypeId = document.documentTypeId;
    this.#fileName = document.fileName;
    this.#validationStatus = document.validationStatus;
    this.#rejectionReason = document.rejectionReason ?? null;
    this.#issueDate = document.issueDate ?? null;
    this.#expirationDate = document.expirationDate ?? null;
    this.#uploadedAt = document.uploadedAt;
    this.#validatedAt = document.validatedAt ?? null;
  }

  /**
   * Document identifier.
   */
  get id(): number {
    return this.#id;
  }

  /**
   * Identifier of the carrier that uploaded the document (reference by id to Profiles).
   */
  get carrierId(): number {
    return this.#carrierId;
  }

  /**
   * Identifier of the document type.
   */
  get documentTypeId(): number {
    return this.#documentTypeId;
  }

  /**
   * Name of the uploaded file, e.g. `soat-abc123.pdf`.
   */
  get fileName(): string {
    return this.#fileName;
  }

  /**
   * Validation status stored in the API.
   */
  get validationStatus(): ValidationStatus {
    return this.#validationStatus;
  }

  /**
   * Why the document was rejected, or null when it was not rejected.
   */
  get rejectionReason(): RejectionReason | null {
    return this.#rejectionReason;
  }

  /**
   * Issue date, or null when unknown.
   */
  get issueDate(): Date | null {
    return this.#issueDate;
  }

  /**
   * Expiration date, or null for documents that do not expire.
   */
  get expirationDate(): Date | null {
    return this.#expirationDate;
  }

  /**
   * Date and time the file was uploaded.
   */
  get uploadedAt(): Date {
    return this.#uploadedAt;
  }

  /**
   * Date and time the validation finished, or null while it is pending or in review.
   */
  get validatedAt(): Date | null {
    return this.#validatedAt;
  }

  /**
   * Counts the calendar days from today to the expiration date.
   * @param today - Current date.
   * @returns 0 when it expires today, a negative number when it already expired, or null when the document does not
   *   expire.
   */
  daysUntilExpiration(today: Date): number | null {
    if (!this.#expirationDate) {
      return null;
    }
    return Math.round((Document.startOfDay(this.#expirationDate) - Document.startOfDay(today)) / MILLISECONDS_PER_DAY);
  }

  /**
   * Indicates whether the document is marked as expired or its expiration date has passed.
   * @param today - Current date.
   * @returns True when the document is expired.
   */
  isExpired(today: Date): boolean {
    const daysLeft = this.daysUntilExpiration(today);
    return this.#validationStatus === 'EXPIRED' || (daysLeft !== null && daysLeft < 0);
  }

  /**
   * Indicates whether the document is still valid but expires within the given number of days.
   * @param days - Number of days, e.g. 15.
   * @param today - Current date.
   * @returns True when it expires between today and `days` days from today, both included.
   */
  expiresWithinDays(days: number, today: Date): boolean {
    const daysLeft = this.daysUntilExpiration(today);
    return !this.isExpired(today) && daysLeft !== null && daysLeft <= days;
  }

  /**
   * Status shown to the carrier: `EXPIRED` for an approved document past its expiration date, otherwise the stored
   * status.
   * @param today - Current date.
   * @returns The validation status to display.
   */
  displayStatus(today: Date): ValidationStatus {
    return this.#validationStatus === 'APPROVED' && this.isExpired(today) ? 'EXPIRED' : this.#validationStatus;
  }

  /**
   * An approved document that expires in {@link EXPIRATION_WARNING_DAYS} days or fewer must be renewed soon.
   * @param today - Current date.
   * @returns True when the renewal warning must be shown.
   */
  expiresSoon(today: Date): boolean {
    return this.displayStatus(today) === 'APPROVED' && this.expiresWithinDays(Document.EXPIRATION_WARNING_DAYS, today);
  }

  /**
   * Local midnight of a date, so dates are compared by calendar day.
   * @param date - Date to truncate.
   * @returns Milliseconds of the start of that day.
   */
  private static startOfDay(date: Date): number {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  }
}
