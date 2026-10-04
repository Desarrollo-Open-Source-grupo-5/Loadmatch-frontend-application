import {AssignedVehicle} from './assigned-vehicle';
import {CarrierContact} from './carrier-contact';

/**
 * Carrier and vehicle that accepted a load request, as shown to its shipper.
 */
export class AssignedCarrier {
  readonly #carrierId: number;
  readonly #carrierFullName: string;
  readonly #phoneNumber: string;
  readonly #reputationAverage: number;
  readonly #reputationTotalRatings: number;
  readonly #licensePlate: string;
  readonly #vehicleTypeName: string;
  readonly #payloadKg: number;

  /**
   * Creates an assigned carrier read model.
   * @param assignedCarrier - Carrier contact data and assigned vehicle data.
   */
  constructor(assignedCarrier: {
    carrierId: number;
    carrierFullName: string;
    phoneNumber: string;
    reputationAverage: number;
    reputationTotalRatings: number;
    licensePlate: string;
    vehicleTypeName: string;
    payloadKg: number;
  }) {
    this.#carrierId = assignedCarrier.carrierId;
    this.#carrierFullName = assignedCarrier.carrierFullName;
    this.#phoneNumber = assignedCarrier.phoneNumber;
    this.#reputationAverage = assignedCarrier.reputationAverage;
    this.#reputationTotalRatings = assignedCarrier.reputationTotalRatings;
    this.#licensePlate = assignedCarrier.licensePlate;
    this.#vehicleTypeName = assignedCarrier.vehicleTypeName;
    this.#payloadKg = assignedCarrier.payloadKg;
  }

  /**
   * Composes the read model from the projections read from `/carriers`, `/vehicles` and `/vehicle-types`.
   * @param carrier - Contact data of the carrier that accepted the request.
   * @param vehicle - Vehicle assigned to the trip.
   * @param vehicleTypeName - Name of the vehicle's type (empty when the catalog does not have it).
   * @returns The assigned carrier.
   */
  static from(carrier: CarrierContact, vehicle: AssignedVehicle, vehicleTypeName: string): AssignedCarrier {
    return new AssignedCarrier({
      carrierId: carrier.id,
      carrierFullName: carrier.fullName,
      phoneNumber: carrier.phoneNumber,
      reputationAverage: carrier.reputationAverage,
      reputationTotalRatings: carrier.reputationTotalRatings,
      licensePlate: vehicle.licensePlate,
      vehicleTypeName,
      payloadKg: vehicle.payloadKg
    });
  }

  /**
   * Identifier of the carrier.
   */
  get carrierId(): number {
    return this.#carrierId;
  }

  /**
   * First names followed by last names of the carrier.
   */
  get carrierFullName(): string {
    return this.#carrierFullName;
  }

  /**
   * Contact phone number of the carrier.
   */
  get phoneNumber(): string {
    return this.#phoneNumber;
  }

  /**
   * Average rating of the carrier between 0 and 5.
   */
  get reputationAverage(): number {
    return this.#reputationAverage;
  }

  /**
   * Number of ratings the carrier received.
   */
  get reputationTotalRatings(): number {
    return this.#reputationTotalRatings;
  }

  /**
   * License plate of the assigned vehicle.
   */
  get licensePlate(): string {
    return this.#licensePlate;
  }

  /**
   * Type name of the assigned vehicle, e.g. `Trailer`.
   */
  get vehicleTypeName(): string {
    return this.#vehicleTypeName;
  }

  /**
   * Payload capacity of the assigned vehicle in kilograms.
   */
  get payloadKg(): number {
    return this.#payloadKg;
  }

  /**
   * Indicates whether the carrier has received at least one rating.
   * @returns True when there are ratings.
   */
  hasRatings(): boolean {
    return this.#reputationTotalRatings > 0;
  }

  /**
   * Phone number in the form used by a `tel:` link (only `+` and digits).
   * @returns The dialable phone number, e.g. `+51912345678`.
   */
  dialablePhoneNumber(): string {
    return this.#phoneNumber.replace(/[^+\d]/g, '');
  }
}
