import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {Money} from '../../../shared/domain/model/money';

/**
 * Read-only projection of a Freight Publishing load request with the route, cargo, pickup date and rate the trip
 * views show.
 */
export class TripLoadRequest implements BaseEntity {
  readonly #id: number;
  readonly #shipperId: number;
  readonly #originDistrict: string;
  readonly #originAddress: string;
  readonly #destinationDistrict: string;
  readonly #destinationAddress: string;
  readonly #distanceKm: number;
  readonly #cargoType: string;
  readonly #weightKg: number;
  readonly #offeredRate: Money;
  readonly #pickupAt: Date;

  /**
   * Creates a trip load request projection.
   * @param loadRequest - Identifier, shipper, route, cargo, rate and pickup date.
   */
  constructor(loadRequest: {
    id: number;
    shipperId: number;
    originDistrict: string;
    originAddress: string;
    destinationDistrict: string;
    destinationAddress: string;
    distanceKm: number;
    cargoType: string;
    weightKg: number;
    offeredRate: Money;
    pickupAt: Date;
  }) {
    this.#id = loadRequest.id;
    this.#shipperId = loadRequest.shipperId;
    this.#originDistrict = loadRequest.originDistrict;
    this.#originAddress = loadRequest.originAddress;
    this.#destinationDistrict = loadRequest.destinationDistrict;
    this.#destinationAddress = loadRequest.destinationAddress;
    this.#distanceKm = loadRequest.distanceKm;
    this.#cargoType = loadRequest.cargoType;
    this.#weightKg = loadRequest.weightKg;
    this.#offeredRate = loadRequest.offeredRate;
    this.#pickupAt = loadRequest.pickupAt;
  }

  /**
   * Load request identifier.
   */
  get id(): number {
    return this.#id;
  }

  /**
   * Short code shown to users, e.g. `LR-0003`.
   */
  get code(): string {
    return `LR-${String(this.#id).padStart(4, '0')}`;
  }

  /**
   * Identifier of the shipper that owns the load request.
   */
  get shipperId(): number {
    return this.#shipperId;
  }

  /**
   * Origin district or city.
   */
  get originDistrict(): string {
    return this.#originDistrict;
  }

  /**
   * Origin street address.
   */
  get originAddress(): string {
    return this.#originAddress;
  }

  /**
   * Destination district or city.
   */
  get destinationDistrict(): string {
    return this.#destinationDistrict;
  }

  /**
   * Destination street address.
   */
  get destinationAddress(): string {
    return this.#destinationAddress;
  }

  /**
   * Trip distance between origin and destination, in kilometres.
   */
  get distanceKm(): number {
    return this.#distanceKm;
  }

  /**
   * Kind of goods.
   */
  get cargoType(): string {
    return this.#cargoType;
  }

  /**
   * Cargo weight in kilograms.
   */
  get weightKg(): number {
    return this.#weightKg;
  }

  /**
   * Rate offered by the shipper (the amount the carrier earns for the trip).
   */
  get offeredRate(): Money {
    return this.#offeredRate;
  }

  /**
   * Requested pickup date and time.
   */
  get pickupAt(): Date {
    return this.#pickupAt;
  }
}
