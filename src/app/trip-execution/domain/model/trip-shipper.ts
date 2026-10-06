import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Read-only projection of a Profiles shipper with the business name a carrier sees in its trips.
 */
export class TripShipper implements BaseEntity {
  readonly #id: number;
  readonly #businessName: string;

  /**
   * Creates a trip shipper projection.
   * @param shipper - Identifier and business name.
   */
  constructor(shipper: { id: number; businessName: string }) {
    this.#id = shipper.id;
    this.#businessName = shipper.businessName;
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
}
