import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Identifier and name of a Fleet vehicle type, used by Trip Execution to label the vehicle of a trip.
 */
export class TripVehicleType implements BaseEntity {
  readonly #id: number;
  readonly #name: string;

  /**
   * Creates a trip vehicle type projection.
   * @param vehicleType - Identifier and name.
   */
  constructor(vehicleType: { id: number; name: string }) {
    this.#id = vehicleType.id;
    this.#name = vehicleType.name;
  }

  /**
   * Vehicle type identifier.
   */
  get id(): number {
    return this.#id;
  }

  /**
   * Vehicle type name, e.g. `Trailer`.
   */
  get name(): string {
    return this.#name;
  }
}
