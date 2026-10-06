import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {Dimensions} from '../../../shared/domain/model/dimensions';

/**
 * Catalog category of vehicle with its load limits (aggregate root `VehicleType` of the Fleet context).
 */
export class VehicleType implements BaseEntity {
  #id: number;
  #name: string;
  #description: string;
  #maxWeightKg: number;
  #maxDimensions: Dimensions;
  #active: boolean;

  /**
   * Creates a vehicle type.
   * @param vehicleType - Vehicle type attributes.
   */
  constructor(vehicleType: {
    id: number;
    name: string;
    description: string;
    maxWeightKg: number;
    maxDimensions: Dimensions;
    active: boolean;
  }) {
    this.#id = vehicleType.id;
    this.#name = vehicleType.name;
    this.#description = vehicleType.description;
    this.#maxWeightKg = vehicleType.maxWeightKg;
    this.#maxDimensions = vehicleType.maxDimensions;
    this.#active = vehicleType.active;
  }

  /**
   * Vehicle type identifier.
   */
  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  /**
   * Name of the vehicle type (e.g. `Trailer`).
   */
  get name(): string {
    return this.#name;
  }

  set name(value: string) {
    this.#name = value;
  }

  /**
   * Short description of typical use.
   */
  get description(): string {
    return this.#description;
  }

  set description(value: string) {
    this.#description = value;
  }

  /**
   * Maximum load weight in kilograms.
   */
  get maxWeightKg(): number {
    return this.#maxWeightKg;
  }

  set maxWeightKg(value: number) {
    this.#maxWeightKg = value;
  }

  /**
   * Maximum load dimensions.
   */
  get maxDimensions(): Dimensions {
    return this.#maxDimensions;
  }

  set maxDimensions(value: Dimensions) {
    this.#maxDimensions = value;
  }

  /**
   * Whether the type is offered in the catalog.
   */
  get active(): boolean {
    return this.#active;
  }

  set active(value: boolean) {
    this.#active = value;
  }

  /**
   * Checks whether a load fits within the limits of this vehicle type.
   * @param weightKg - Load weight in kilograms.
   * @param dimensions - Load dimensions.
   * @returns True when the type is active and the load respects weight and dimension limits.
   */
  acceptsLoad(weightKg: number, dimensions: Dimensions): boolean {
    return this.#active && weightKg <= this.#maxWeightKg && dimensions.fitsIn(this.#maxDimensions);
  }
}
