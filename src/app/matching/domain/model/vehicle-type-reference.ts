import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Identifier and name of a Fleet vehicle type, used by Matching to label loads and vehicles.
 */
export class VehicleTypeReference implements BaseEntity {
  readonly #id: number;
  readonly #name: string;

  /**
   * Creates a vehicle type reference.
   * @param reference - Identifier and name.
   */
  constructor(reference: { id: number; name: string }) {
    this.#id = reference.id;
    this.#name = reference.name;
  }

  /**
   * Vehicle type identifier.
   */
  get id(): number {
    return this.#id;
  }

  /**
   * Vehicle type name.
   */
  get name(): string {
    return this.#name;
  }
}
