import {BaseEntity} from '../../../shared/domain/model/base-entity';

/**
 * Read-only projection of a Fleet vehicle type, used by the publish form to choose the required vehicle and to
 * validate the maximum load weight.
 */
export class VehicleTypeOption implements BaseEntity {
  #id: number;
  #name: string;
  #maxWeightKg: number;
  #active: boolean;

  /**
   * Creates a vehicle type option.
   * @param option - Identifier, name, maximum weight and availability.
   */
  constructor(option: { id: number; name: string; maxWeightKg: number; active: boolean }) {
    this.#id = option.id;
    this.#name = option.name;
    this.#maxWeightKg = option.maxWeightKg;
    this.#active = option.active;
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
   * Vehicle type name.
   */
  get name(): string {
    return this.#name;
  }

  set name(value: string) {
    this.#name = value;
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
   * Whether the type can be selected for new load requests.
   */
  get active(): boolean {
    return this.#active;
  }

  set active(value: boolean) {
    this.#active = value;
  }
}
