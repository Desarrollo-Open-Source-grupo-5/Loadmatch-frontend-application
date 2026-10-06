import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {AvailableLoad} from './available-load';

/**
 * Read-only projection of a Fleet vehicle that Matching uses to check load compatibility.
 */
export class CarrierVehicle implements BaseEntity {
  readonly #id: number;
  readonly #carrierId: number;
  readonly #vehicleTypeId: number;
  readonly #licensePlate: string;
  readonly #payloadKg: number;
  readonly #active: boolean;

  /**
   * Creates a carrier vehicle projection.
   * @param vehicle - Vehicle attributes needed for matching.
   */
  constructor(vehicle: {
    id: number;
    carrierId: number;
    vehicleTypeId: number;
    licensePlate: string;
    payloadKg: number;
    active: boolean;
  }) {
    this.#id = vehicle.id;
    this.#carrierId = vehicle.carrierId;
    this.#vehicleTypeId = vehicle.vehicleTypeId;
    this.#licensePlate = vehicle.licensePlate;
    this.#payloadKg = vehicle.payloadKg;
    this.#active = vehicle.active;
  }

  /**
   * Vehicle identifier.
   */
  get id(): number {
    return this.#id;
  }

  /**
   * Identifier of the carrier that owns the vehicle.
   */
  get carrierId(): number {
    return this.#carrierId;
  }

  /**
   * Identifier of the vehicle type.
   */
  get vehicleTypeId(): number {
    return this.#vehicleTypeId;
  }

  /**
   * License plate.
   */
  get licensePlate(): string {
    return this.#licensePlate;
  }

  /**
   * Maximum payload in kilograms.
   */
  get payloadKg(): number {
    return this.#payloadKg;
  }

  /**
   * Whether the vehicle is active.
   */
  get active(): boolean {
    return this.#active;
  }

  /**
   * A load is compatible when the vehicle is active, is of the required vehicle type and the load weight does not
   * exceed its payload.
   * @param load - Load to check.
   * @returns True when the vehicle can take the load.
   */
  canTransport(load: AvailableLoad): boolean {
    return this.#active && this.#vehicleTypeId === load.vehicleTypeId && load.weightKg <= this.#payloadKg;
  }
}
