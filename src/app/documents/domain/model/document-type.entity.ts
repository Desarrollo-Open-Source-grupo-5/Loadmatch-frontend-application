import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Kind of document a carrier must provide, such as the driver license or the SOAT (aggregate root `DocumentType` of
 * the Document Validation context).
 */
export class DocumentType implements BaseEntity {
  readonly #id: number;
  readonly #code: string;
  readonly #name: string;
  readonly #mandatory: boolean;
  readonly #requiresExpiration: boolean;

  /**
   * Creates a document type.
   * @param documentType - Identifier, code, name and whether it is mandatory and expires.
   */
  constructor(documentType: { id: number; code: string; name: string; mandatory: boolean; requiresExpiration: boolean }) {
    this.#id = documentType.id;
    this.#code = documentType.code;
    this.#name = documentType.name;
    this.#mandatory = documentType.mandatory;
    this.#requiresExpiration = documentType.requiresExpiration;
  }

  /**
   * Document type identifier.
   */
  get id(): number {
    return this.#id;
  }

  /**
   * Catalog code, e.g. `SOAT`.
   */
  get code(): string {
    return this.#code;
  }

  /**
   * Stored name, e.g. `Driver license`.
   */
  get name(): string {
    return this.#name;
  }

  /**
   * Whether every carrier must provide this document to accept trips.
   */
  get mandatory(): boolean {
    return this.#mandatory;
  }

  /**
   * Whether documents of this type have an expiration date.
   */
  get requiresExpiration(): boolean {
    return this.#requiresExpiration;
  }

  /**
   * A mandatory document type is part of the carrier's validation checklist.
   * @returns True when the type is mandatory.
   */
  isMandatory(): boolean {
    return this.#mandatory;
  }
}
