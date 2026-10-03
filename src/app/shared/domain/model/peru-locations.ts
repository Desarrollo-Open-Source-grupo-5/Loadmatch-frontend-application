import {Coordinates} from './coordinates';

/**
 * Peruvian city or district where loads are picked up or delivered.
 */
export class PeruLocation {
  readonly #code: string;
  readonly #district: string;
  readonly #department: string;
  readonly #coordinates: Coordinates;

  /**
   * Creates a catalog location.
   * @param props - Location code, district, department and coordinates.
   */
  constructor(props: { code: string; district: string; department: string; latitude: number; longitude: number }) {
    this.#code = props.code;
    this.#district = props.district;
    this.#department = props.department;
    this.#coordinates = new Coordinates({latitude: props.latitude, longitude: props.longitude});
  }

  /**
   * Stable identifier of the location in the catalog (e.g. `CALLAO`).
   */
  get code(): string {
    return this.#code;
  }

  /**
   * District or city name, stored as `originDistrict`/`destinationDistrict` in load requests.
   */
  get district(): string {
    return this.#district;
  }

  /**
   * Department (region) the district belongs to.
   */
  get department(): string {
    return this.#department;
  }

  /**
   * Reference coordinates of the location.
   */
  get coordinates(): Coordinates {
    return this.#coordinates;
  }

  /**
   * Human-readable label, e.g. `Ate (Lima)` or `Callao`.
   */
  get label(): string {
    return this.#district === this.#department ? this.#district : `${this.#district} (${this.#department})`;
  }
}

/**
 * Catalog of Peruvian logistics locations.
 */
export const PERU_LOCATIONS: readonly PeruLocation[] = [
  new PeruLocation({code: 'LIMA', district: 'Lima', department: 'Lima', latitude: -12.0464, longitude: -77.0428}),
  new PeruLocation({code: 'CALLAO', district: 'Callao', department: 'Callao', latitude: -12.0566, longitude: -77.1181}),
  new PeruLocation({code: 'ATE', district: 'Ate', department: 'Lima', latitude: -12.0262, longitude: -76.919}),
  new PeruLocation({code: 'LURIN', district: 'Lurín', department: 'Lima', latitude: -12.2747, longitude: -76.8706}),
  new PeruLocation({code: 'CHANCAY', district: 'Chancay', department: 'Lima', latitude: -11.5653, longitude: -77.27}),
  new PeruLocation({code: 'HUACHO', district: 'Huacho', department: 'Lima', latitude: -11.1067, longitude: -77.605}),
  new PeruLocation({code: 'ICA', district: 'Ica', department: 'Ica', latitude: -14.0678, longitude: -75.7286}),
  new PeruLocation({code: 'AREQUIPA', district: 'Arequipa', department: 'Arequipa', latitude: -16.409, longitude: -71.5375}),
  new PeruLocation({code: 'TRUJILLO', district: 'Trujillo', department: 'La Libertad', latitude: -8.1116, longitude: -79.0288}),
  new PeruLocation({code: 'CHIMBOTE', district: 'Chimbote', department: 'Áncash', latitude: -9.0853, longitude: -78.5783}),
  new PeruLocation({code: 'CHICLAYO', district: 'Chiclayo', department: 'Lambayeque', latitude: -6.7714, longitude: -79.8409}),
  new PeruLocation({code: 'PIURA', district: 'Piura', department: 'Piura', latitude: -5.1945, longitude: -80.6328}),
  new PeruLocation({code: 'HUANCAYO', district: 'Huancayo', department: 'Junín', latitude: -12.0651, longitude: -75.2049}),
  new PeruLocation({code: 'CUSCO', district: 'Cusco', department: 'Cusco', latitude: -13.532, longitude: -71.9675}),
  new PeruLocation({code: 'TACNA', district: 'Tacna', department: 'Tacna', latitude: -18.0066, longitude: -70.2463}),
];

/**
 * Location used by default as the carrier position (Lima/Callao metropolitan area).
 */
export const DEFAULT_LOCATION_CODE = 'CALLAO';

/**
 * Finds a catalog location by its code.
 * @param code - Location code.
 * @returns The location, or undefined when the code is unknown.
 */
export const findLocationByCode = (code: string): PeruLocation | undefined =>
  PERU_LOCATIONS.find(location => location.code === code);

/**
 * Finds a catalog location by its district name, as stored in load request resources.
 * @param district - District name (e.g. `Callao`).
 * @returns The location, or undefined when the district is not in the catalog.
 */
export const findLocationByDistrict = (district: string): PeruLocation | undefined =>
  PERU_LOCATIONS.find(location => location.district === district);
