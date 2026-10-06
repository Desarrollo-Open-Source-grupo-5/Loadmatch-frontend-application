import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Vehicle registered by a carrier (aggregate root `Vehicle` of the Fleet context).
 */
export class Vehicle implements BaseEntity {
  #id: number;
  #carrierId: number;
  #vehicleTypeId: number;
  #licensePlate: string;
  #brand: string;
  #payloadKg: number;
  #active: boolean;

  /**
   * Creates a vehicle.
   * @param vehicle - Vehicle attributes.
   */
  constructor(vehicle: {
    id: number;
    carrierId: number;
    vehicleTypeId: number;
    licensePlate: string;
    brand: string;
    payloadKg: number;
    active: boolean;
  }) {
    this.#id = vehicle.id;
    this.#carrierId = vehicle.carrierId;
    this.#vehicleTypeId = vehicle.vehicleTypeId;
    this.#licensePlate = vehicle.licensePlate;
    this.#brand = vehicle.brand;
    this.#payloadKg = vehicle.payloadKg;
    this.#active = vehicle.active;
  }

  /**
   * Vehicle identifier.
   */
  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  /**
   * Identifier of the carrier that owns the vehicle (reference by id).
   */
  get carrierId(): number {
    return this.#carrierId;
  }

  set carrierId(value: number) {
    this.#carrierId = value;
  }

  /**
   * Identifier of the vehicle type (reference by id).
   */
  get vehicleTypeId(): number {
    return this.#vehicleTypeId;
  }

  set vehicleTypeId(value: number) {
    this.#vehicleTypeId = value;
  }

  /**
   * Peruvian license plate (e.g. `ABC-123`).
   */
  get licensePlate(): string {
    return this.#licensePlate;
  }

  set licensePlate(value: string) {
    this.#licensePlate = value;
  }

  /**
   * Vehicle brand.
   */
  get brand(): string {
    return this.#brand;
  }

  set brand(value: string) {
    this.#brand = value;
  }

  /**
   * Maximum payload in kilograms.
   */
  get payloadKg(): number {
    return this.#payloadKg;
  }

  set payloadKg(value: number) {
    this.#payloadKg = value;
  }

  /**
   * Whether the vehicle is active.
   */
  get active(): boolean {
    return this.#active;
  }

  set active(value: boolean) {
    this.#active = value;
  }

  /**
   * Indicates whether the vehicle is enabled to operate.
   * @returns True when the vehicle is active.
   */
  isEnabled(): boolean {
    return this.#active;
  }

  /**
   * Checks whether the vehicle can transport a load of the given weight.
   * @param weightKg - Load weight in kilograms.
   * @returns True when the vehicle is enabled and the weight does not exceed its payload.
   */
  canTransport(weightKg: number): boolean {
    return this.isEnabled() && weightKg <= this.#payloadKg;
  }
}
