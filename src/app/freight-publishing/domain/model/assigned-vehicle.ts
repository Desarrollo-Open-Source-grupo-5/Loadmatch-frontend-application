import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Read-only projection of a Fleet vehicle with the data a shipper checks before handing over the cargo.
 */
export class AssignedVehicle implements BaseEntity {
  #id: string;
  #vehicleTypeId: string;
  #licensePlate: string;
  #payloadKg: number;

  /**
   * Creates an assigned vehicle.
   * @param vehicle - Identifier, vehicle type, license plate and payload capacity.
   */
  constructor(vehicle: { id: string; vehicleTypeId: string; licensePlate: string; payloadKg: number }) {
    this.#id = vehicle.id;
    this.#vehicleTypeId = vehicle.vehicleTypeId;
    this.#licensePlate = vehicle.licensePlate;
    this.#payloadKg = vehicle.payloadKg;
  }

  /**
   * Vehicle identifier.
   */
  get id(): string {
    return this.#id;
  }

  set id(value: string) {
    this.#id = value;
  }

  /**
   * Identifier of the vehicle type.
   */
  get vehicleTypeId(): string {
    return this.#vehicleTypeId;
  }

  set vehicleTypeId(value: string) {
    this.#vehicleTypeId = value;
  }

  /**
   * License plate, e.g. `B7K-482`.
   */
  get licensePlate(): string {
    return this.#licensePlate;
  }

  set licensePlate(value: string) {
    this.#licensePlate = value;
  }

  /**
   * Payload capacity in kilograms.
   */
  get payloadKg(): number {
    return this.#payloadKg;
  }

  set payloadKg(value: number) {
    this.#payloadKg = value;
  }
}
