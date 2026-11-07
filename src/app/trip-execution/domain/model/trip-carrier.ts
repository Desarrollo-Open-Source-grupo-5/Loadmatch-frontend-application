import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Read-only projection of a Profiles carrier with the name a shipper sees when tracking its load.
 */
export class TripCarrier implements BaseEntity {
  readonly #id: string;
  readonly #firstNames: string;
  readonly #lastNames: string;

  /**
   * Creates a trip carrier projection.
   * @param carrier - Identifier and names.
   */
  constructor(carrier: { id: string; firstNames: string; lastNames: string }) {
    this.#id = carrier.id;
    this.#firstNames = carrier.firstNames;
    this.#lastNames = carrier.lastNames;
  }

  /**
   * Carrier identifier.
   */
  get id(): string {
    return this.#id;
  }

  /**
   * First names of the carrier.
   */
  get firstNames(): string {
    return this.#firstNames;
  }

  /**
   * Last names of the carrier.
   */
  get lastNames(): string {
    return this.#lastNames;
  }

  /**
   * First names followed by last names, e.g. `María Elena Torres Vílchez`.
   */
  get fullName(): string {
    return `${this.#firstNames} ${this.#lastNames}`.trim();
  }
}
