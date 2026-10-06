/**
 * Geographic point expressed in decimal degrees.
 */
export class Coordinates {
  /**
   * Mean Earth radius in kilometres used by the Haversine formula.
   */
  static readonly EARTH_RADIUS_KM = 6371;

  readonly #latitude: number;
  readonly #longitude: number;

  /**
   * Creates a coordinates value object.
   * @param props - Latitude and longitude in decimal degrees.
   */
  constructor(props: { latitude: number; longitude: number }) {
    this.#latitude = props.latitude;
    this.#longitude = props.longitude;
  }

  /**
   * Latitude in decimal degrees (negative to the south).
   */
  get latitude(): number {
    return this.#latitude;
  }

  /**
   * Longitude in decimal degrees (negative to the west).
   */
  get longitude(): number {
    return this.#longitude;
  }

  /**
   * Computes the great-circle distance to another point with the Haversine formula.
   * @param other - Destination point.
   * @returns Distance in kilometres.
   */
  distanceTo(other: Coordinates): number {
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const deltaLatitude = toRadians(other.latitude - this.latitude);
    const deltaLongitude = toRadians(other.longitude - this.longitude);
    const haversine =
      Math.sin(deltaLatitude / 2) ** 2 +
      Math.cos(toRadians(this.latitude)) *
        Math.cos(toRadians(other.latitude)) *
        Math.sin(deltaLongitude / 2) ** 2;
    return 2 * Coordinates.EARTH_RADIUS_KM * Math.asin(Math.sqrt(haversine));
  }
}
