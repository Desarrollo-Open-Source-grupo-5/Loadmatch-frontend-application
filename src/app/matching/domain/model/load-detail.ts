import {Coordinates} from '../../../shared/domain/model/coordinates';
import {Dimensions} from '../../../shared/domain/model/dimensions';
import {Money} from '../../../shared/domain/model/money';
import {AvailableLoad} from './available-load';
import {ShipperReference} from './shipper-reference';

/**
 * Complete data of a load as seen by a carrier before accepting it, including the shipper's reputation.
 */
export class LoadDetail {
  readonly #loadRequestId: number;
  readonly #status: string;
  readonly #originDistrict: string;
  readonly #originAddress: string;
  readonly #originCoordinates: Coordinates;
  readonly #destinationDistrict: string;
  readonly #destinationAddress: string;
  readonly #destinationCoordinates: Coordinates;
  readonly #pickupAt: Date;
  readonly #cargoType: string;
  readonly #weightKg: number;
  readonly #dimensions: Dimensions;
  readonly #vehicleTypeName: string;
  readonly #offeredRate: Money;
  readonly #distanceKm: number;
  readonly #distanceToCarrierKm: number | null;
  readonly #urgent: boolean;
  readonly #shipperBusinessName: string;
  readonly #shipperReputationAverage: number;
  readonly #shipperReputationTotalRatings: number;

  /**
   * Creates a load detail.
   * @param detail - Read model attributes.
   */
  constructor(detail: {
    loadRequestId: number;
    status: string;
    originDistrict: string;
    originAddress: string;
    originCoordinates: Coordinates;
    destinationDistrict: string;
    destinationAddress: string;
    destinationCoordinates: Coordinates;
    pickupAt: Date;
    cargoType: string;
    weightKg: number;
    dimensions: Dimensions;
    vehicleTypeName: string;
    offeredRate: Money;
    distanceKm: number;
    distanceToCarrierKm: number | null;
    urgent: boolean;
    shipperBusinessName: string;
    shipperReputationAverage: number;
    shipperReputationTotalRatings: number;
  }) {
    this.#loadRequestId = detail.loadRequestId;
    this.#status = detail.status;
    this.#originDistrict = detail.originDistrict;
    this.#originAddress = detail.originAddress;
    this.#originCoordinates = detail.originCoordinates;
    this.#destinationDistrict = detail.destinationDistrict;
    this.#destinationAddress = detail.destinationAddress;
    this.#destinationCoordinates = detail.destinationCoordinates;
    this.#pickupAt = detail.pickupAt;
    this.#cargoType = detail.cargoType;
    this.#weightKg = detail.weightKg;
    this.#dimensions = detail.dimensions;
    this.#vehicleTypeName = detail.vehicleTypeName;
    this.#offeredRate = detail.offeredRate;
    this.#distanceKm = detail.distanceKm;
    this.#distanceToCarrierKm = detail.distanceToCarrierKm;
    this.#urgent = detail.urgent;
    this.#shipperBusinessName = detail.shipperBusinessName;
    this.#shipperReputationAverage = detail.shipperReputationAverage;
    this.#shipperReputationTotalRatings = detail.shipperReputationTotalRatings;
  }

  /**
   * Composes the read model from an available load, its shipper and the name of the required vehicle type.
   * @param load - Load read from `/load-requests`.
   * @param shipper - Shipper that published the load, read from `/shippers`.
   * @param vehicleTypeName - Name of the required vehicle type.
   * @param carrierLocation - Location selected by the carrier in the search, or null when unknown.
   * @returns The load detail.
   */
  static from(load: AvailableLoad, shipper: ShipperReference, vehicleTypeName: string, carrierLocation: Coordinates | null): LoadDetail {
    const located = carrierLocation ? load.withDistanceTo(carrierLocation) : load;
    return new LoadDetail({
      loadRequestId: load.id,
      status: load.status,
      originDistrict: load.originDistrict,
      originAddress: load.originAddress,
      originCoordinates: load.originCoordinates,
      destinationDistrict: load.destinationDistrict,
      destinationAddress: load.destinationAddress,
      destinationCoordinates: load.destinationCoordinates,
      pickupAt: load.pickupAt,
      cargoType: load.cargoType,
      weightKg: load.weightKg,
      dimensions: load.dimensions,
      vehicleTypeName,
      offeredRate: load.offeredRate,
      distanceKm: load.distanceKm,
      distanceToCarrierKm: located.distanceToCarrierKm,
      urgent: load.urgent,
      shipperBusinessName: shipper.businessName,
      shipperReputationAverage: shipper.reputationAverage,
      shipperReputationTotalRatings: shipper.reputationTotalRatings
    });
  }

  /**
   * Identifier of the load request.
   */
  get loadRequestId(): number {
    return this.#loadRequestId;
  }

  /**
   * Short code shown to users, e.g. `LR-0007`.
   */
  get code(): string {
    return `LR-${String(this.#loadRequestId).padStart(4, '0')}`;
  }

  /**
   * Status of the load request when it was consulted.
   */
  get status(): string {
    return this.#status;
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
   * Origin coordinates.
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
   * Destination coordinates.
   */
  get destinationCoordinates(): Coordinates {
    return this.#destinationCoordinates;
  }

  /**
   * Requested pickup date and time.
   */
  get pickupAt(): Date {
    return this.#pickupAt;
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
   * Cargo dimensions.
   */
  get dimensions(): Dimensions {
    return this.#dimensions;
  }

  /**
   * Name of the vehicle type required by the shipper.
   */
  get vehicleTypeName(): string {
    return this.#vehicleTypeName;
  }

  /**
   * Rate offered by the shipper.
   */
  get offeredRate(): Money {
    return this.#offeredRate;
  }

  /**
   * Trip distance between origin and destination, in kilometres.
   */
  get distanceKm(): number {
    return this.#distanceKm;
  }

  /**
   * Distance from the carrier location to the load origin in kilometres, or null if unknown.
   */
  get distanceToCarrierKm(): number | null {
    return this.#distanceToCarrierKm;
  }

  /**
   * Whether the shipper flagged the load as urgent.
   */
  get urgent(): boolean {
    return this.#urgent;
  }

  /**
   * Business name of the shipper.
   */
  get shipperBusinessName(): string {
    return this.#shipperBusinessName;
  }

  /**
   * Average rating of the shipper between 0 and 5.
   */
  get shipperReputationAverage(): number {
    return this.#shipperReputationAverage;
  }

  /**
   * Number of ratings the shipper received.
   */
  get shipperReputationTotalRatings(): number {
    return this.#shipperReputationTotalRatings;
  }

  /**
   * Indicates whether the shipper has received at least one rating.
   * @returns True when there are ratings.
   */
  hasShipperRatings(): boolean {
    return this.#shipperReputationTotalRatings > 0;
  }

  /**
   * A load can still be accepted while its load request is published.
   * @returns True when the status is `PUBLISHED`.
   */
  isAvailable(): boolean {
    return this.#status === 'PUBLISHED';
  }
}
