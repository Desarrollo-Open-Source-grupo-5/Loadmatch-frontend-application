import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {Coordinates} from '../../../shared/domain/model/coordinates';
import {Money} from '../../../shared/domain/model/money';

/**
 * Published load request as seen by a carrier searching for freight (read model `AvailableLoad` of the Matching
 * context).
 */
export class AvailableLoad implements BaseEntity {
  readonly #id: number;
  readonly #originDistrict: string;
  readonly #originAddress: string;
  readonly #originCoordinates: Coordinates;
  readonly #destinationDistrict: string;
  readonly #destinationAddress: string;
  readonly #distanceKm: number;
  readonly #weightKg: number;
  readonly #cargoType: string;
  readonly #vehicleTypeId: number;
  readonly #offeredRate: Money;
  readonly #pickupAt: Date;
  readonly #publishedAt: Date | null;
  readonly #urgent: boolean;
  readonly #distanceToCarrierKm: number | null;

  /**
   * Creates an available load.
   * @param load - Read model attributes.
   */
  constructor(load: {
    id: number;
    originDistrict: string;
    originAddress: string;
    originCoordinates: Coordinates;
    destinationDistrict: string;
    destinationAddress: string;
    distanceKm: number;
    weightKg: number;
    cargoType: string;
    vehicleTypeId: number;
    offeredRate: Money;
    pickupAt: Date;
    publishedAt: Date | null;
    urgent: boolean;
    distanceToCarrierKm?: number | null;
  }) {
    this.#id = load.id;
    this.#originDistrict = load.originDistrict;
    this.#originAddress = load.originAddress;
    this.#originCoordinates = load.originCoordinates;
    this.#destinationDistrict = load.destinationDistrict;
    this.#destinationAddress = load.destinationAddress;
    this.#distanceKm = load.distanceKm;
    this.#weightKg = load.weightKg;
    this.#cargoType = load.cargoType;
    this.#vehicleTypeId = load.vehicleTypeId;
    this.#offeredRate = load.offeredRate;
    this.#pickupAt = load.pickupAt;
    this.#publishedAt = load.publishedAt;
    this.#urgent = load.urgent;
    this.#distanceToCarrierKm = load.distanceToCarrierKm ?? null;
  }

  /**
   * Identifier of the underlying load request.
   */
  get id(): number {
    return this.#id;
  }

  /**
   * Short code shown to users, e.g. `LR-0007`.
   */
  get code(): string {
    return `LR-${String(this.#id).padStart(4, '0')}`;
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
   * Origin coordinates, used to compute the distance to the carrier.
   */
  get originCoordinates(): Coordinates {
    return this.#originCoordinates;
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
   * Cargo weight in kilograms.
   */
  get weightKg(): number {
    return this.#weightKg;
  }

  /**
   * Kind of goods.
   */
  get cargoType(): string {
    return this.#cargoType;
  }

  /**
   * Identifier of the vehicle type required by the shipper.
   */
  get vehicleTypeId(): number {
    return this.#vehicleTypeId;
  }

  /**
   * Rate offered by the shipper.
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

  /**
   * Publication date of the load request.
   */
  get publishedAt(): Date | null {
    return this.#publishedAt;
  }

  /**
   * Whether the shipper flagged the load as urgent.
   */
  get urgent(): boolean {
    return this.#urgent;
  }

  /**
   * Distance from the carrier location to the load origin in kilometres, or null if not computed.
   */
  get distanceToCarrierKm(): number | null {
    return this.#distanceToCarrierKm;
  }

  /**
   * Returns a copy of this read model with the distance to the carrier computed.
   * @param carrierLocation - Coordinates of the carrier.
   * @returns A new available load with `distanceToCarrierKm` rounded to one decimal.
   */
  withDistanceTo(carrierLocation: Coordinates): AvailableLoad {
    return new AvailableLoad({
      id: this.#id,
      originDistrict: this.#originDistrict,
      originAddress: this.#originAddress,
      originCoordinates: this.#originCoordinates,
      destinationDistrict: this.#destinationDistrict,
      destinationAddress: this.#destinationAddress,
      distanceKm: this.#distanceKm,
      weightKg: this.#weightKg,
      cargoType: this.#cargoType,
      vehicleTypeId: this.#vehicleTypeId,
      offeredRate: this.#offeredRate,
      pickupAt: this.#pickupAt,
      publishedAt: this.#publishedAt,
      urgent: this.#urgent,
      distanceToCarrierKm: Math.round(carrierLocation.distanceTo(this.#originCoordinates) * 10) / 10
    });
  }
}
