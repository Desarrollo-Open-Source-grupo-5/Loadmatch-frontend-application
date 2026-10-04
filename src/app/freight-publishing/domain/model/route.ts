import {Location} from './location';

/**
 * Origin, destination and distance of a load request (value object `Route`).
 */
export class Route {
  readonly #origin: Location;
  readonly #destination: Location;
  readonly #distanceKm: number;

  /**
   * Creates a route value object.
   * @param props - Origin, destination and distance in kilometres.
   */
  constructor(props: { origin: Location; destination: Location; distanceKm: number }) {
    this.#origin = props.origin;
    this.#destination = props.destination;
    this.#distanceKm = props.distanceKm;
  }

  /**
   * Builds a route computing its distance with the Haversine formula, rounded to one decimal.
   * @param origin - Pickup location.
   * @param destination - Delivery location.
   * @returns The route between both locations.
   */
  static between(origin: Location, destination: Location): Route {
    const distanceKm = Math.round(origin.coordinates.distanceTo(destination.coordinates) * 10) / 10;
    return new Route({origin, destination, distanceKm});
  }

  /**
   * Pickup location.
   */
  get origin(): Location {
    return this.#origin;
  }

  /**
   * Delivery location.
   */
  get destination(): Location {
    return this.#destination;
  }

  /**
   * Trip distance in kilometres.
   */
  get distanceKm(): number {
    return this.#distanceKm;
  }

  /**
   * A route is valid when origin and destination are different points.
   * @returns True when the distance is greater than zero.
   */
  isValid(): boolean {
    return this.#distanceKm > 0;
  }
}
