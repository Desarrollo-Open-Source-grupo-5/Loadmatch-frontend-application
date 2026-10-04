import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Read-only projection of a Profiles carrier with the contact data a shipper needs.
 */
export class CarrierContact implements BaseEntity {
  #id: number;
  #firstNames: string;
  #lastNames: string;
  #phoneNumber: string;
  #reputationAverage: number;
  #reputationTotalRatings: number;

  /**
   * Creates a carrier contact.
   * @param contact - Identifier, names, phone number and reputation.
   */
  constructor(contact: {
    id: number;
    firstNames: string;
    lastNames: string;
    phoneNumber: string;
    reputationAverage: number;
    reputationTotalRatings: number;
  }) {
    this.#id = contact.id;
    this.#firstNames = contact.firstNames;
    this.#lastNames = contact.lastNames;
    this.#phoneNumber = contact.phoneNumber;
    this.#reputationAverage = contact.reputationAverage;
    this.#reputationTotalRatings = contact.reputationTotalRatings;
  }

  /**
   * Carrier identifier.
   */
  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  /**
   * First names of the carrier.
   */
  get firstNames(): string {
    return this.#firstNames;
  }

  set firstNames(value: string) {
    this.#firstNames = value;
  }

  /**
   * Last names of the carrier.
   */
  get lastNames(): string {
    return this.#lastNames;
  }

  set lastNames(value: string) {
    this.#lastNames = value;
  }

  /**
   * First names followed by last names, e.g. `Jorge Luis Ramírez Huamán`.
   */
  get fullName(): string {
    return `${this.#firstNames} ${this.#lastNames}`.trim();
  }

  /**
   * Contact phone number, e.g. `+51 912 345 678`.
   */
  get phoneNumber(): string {
    return this.#phoneNumber;
  }

  set phoneNumber(value: string) {
    this.#phoneNumber = value;
  }

  /**
   * Average rating between 0 and 5.
   */
  get reputationAverage(): number {
    return this.#reputationAverage;
  }

  set reputationAverage(value: number) {
    this.#reputationAverage = value;
  }

  /**
   * Number of ratings received.
   */
  get reputationTotalRatings(): number {
    return this.#reputationTotalRatings;
  }

  set reputationTotalRatings(value: number) {
    this.#reputationTotalRatings = value;
  }
}
