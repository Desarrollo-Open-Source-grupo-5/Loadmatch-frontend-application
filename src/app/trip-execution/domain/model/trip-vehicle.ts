import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Read-only projection of a Fleet vehicle with the license plate and type shown for a trip.
 */
export class TripVehicle implements BaseEntity {
  readonly #id: number;
  readonly #vehicleTypeId: number;
  readonly #licensePlate: string;

  /**
   * Creates a trip vehicle projection.
   * @param vehicle - Identifier, vehicle type and license plate.
   */
  constructor(vehicle: { id: number; vehicleTypeId: number; licensePlate: string }) {
    this.#id = vehicle.id;
    this.#vehicleTypeId = vehicle.vehicleTypeId;
    this.#licensePlate = vehicle.licensePlate;
  }

  /**
   * Vehicle identifier.
   */
  get id(): number {
    return this.#id;
  }

  /**
   * Identifier of the vehicle type.
   */
  get vehicleTypeId(): number {
    return this.#vehicleTypeId;
  }

  /**
   * License plate, e.g. `B7K-482`.
   */
  get licensePlate(): string {
    return this.#licensePlate;
  }
}
