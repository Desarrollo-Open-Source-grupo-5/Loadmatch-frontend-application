import {Coordinates} from '../../../shared/domain/model/coordinates';

/**
 * Pickup or delivery point of a load request (value object `Location`).
 */
export class Location {
  readonly #address: string;
  readonly #district: string;
  readonly #coordinates: Coordinates;

  /**
   * Creates a location value object.
   * @param props - Street address, district and coordinates.
   */
  constructor(props: { address: string; district: string; coordinates: Coordinates }) {
    this.#address = props.address;
    this.#district = props.district;
    this.#coordinates = props.coordinates;
  }

  /**
   * Street address, warehouse or reference.
   */
  get address(): string {
    return this.#address;
  }

  /**
   * District or city (e.g. `Callao`).
   */
  get district(): string {
    return this.#district;
  }

  /**
   * Geographic coordinates of the point.
   */
  get coordinates(): Coordinates {
    return this.#coordinates;
  }
}
