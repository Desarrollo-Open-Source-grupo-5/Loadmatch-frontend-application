import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Business name and reputation of the Profiles shipper that published a load, used by Matching to show who the
 * carrier would work for.
 */
export class ShipperReference implements BaseEntity {
  readonly #id: number;
  readonly #businessName: string;
  readonly #reputationAverage: number;
  readonly #reputationTotalRatings: number;

  /**
   * Creates a shipper reference.
   * @param reference - Identifier, business name and reputation.
   */
  constructor(reference: { id: number; businessName: string; reputationAverage: number; reputationTotalRatings: number }) {
    this.#id = reference.id;
    this.#businessName = reference.businessName;
    this.#reputationAverage = reference.reputationAverage;
    this.#reputationTotalRatings = reference.reputationTotalRatings;
  }

  /**
   * Shipper identifier.
   */
  get id(): number {
    return this.#id;
  }

  /**
   * Business name of the shipper company.
   */
  get businessName(): string {
    return this.#businessName;
  }

  /**
   * Average rating between 0 and 5.
   */
  get reputationAverage(): number {
    return this.#reputationAverage;
  }

  /**
   * Number of ratings received.
   */
  get reputationTotalRatings(): number {
    return this.#reputationTotalRatings;
  }
}
