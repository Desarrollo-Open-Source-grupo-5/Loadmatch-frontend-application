import {Trip} from './trip.entity';
import {TripCarrier} from './trip-carrier';
import {TripLoadRequest} from './trip-load-request';
import {TripShipper} from './trip-shipper';
import {TripVehicle} from './trip-vehicle';

/**
 * A trip together with the data of other contexts its views show: the route, cargo and rate of the load request, the
 * shipper, the carrier and the vehicle.
 */
export class TripOverview {
  readonly #trip: Trip;
  readonly #loadRequest: TripLoadRequest;
  readonly #shipperName: string;
  readonly #carrierName: string;
  readonly #licensePlate: string;
  readonly #vehicleTypeName: string;

  /**
   * Creates a trip overview.
   * @param overview - Trip, load request projection and the names and plate to display.
   */
  constructor(overview: {
    trip: Trip;
    loadRequest: TripLoadRequest;
    shipperName: string;
    carrierName: string;
    licensePlate: string;
    vehicleTypeName: string;
  }) {
    this.#trip = overview.trip;
    this.#loadRequest = overview.loadRequest;
    this.#shipperName = overview.shipperName;
    this.#carrierName = overview.carrierName;
    this.#licensePlate = overview.licensePlate;
    this.#vehicleTypeName = overview.vehicleTypeName;
  }

  /**
   * Composes the read model from the projections read from `/load-requests`, `/shippers`, `/carriers`, `/vehicles`
   * and `/vehicle-types`.
   * @param trip - Trip.
   * @param loadRequest - Load request the trip originates from.
   * @param references - Shipper, carrier and vehicle of the trip and the name of the vehicle type, when known.
   * @returns The trip overview.
   */
  static from(
    trip: Trip,
    loadRequest: TripLoadRequest,
    references: { shipper?: TripShipper; carrier?: TripCarrier; vehicle?: TripVehicle; vehicleTypeName?: string }
  ): TripOverview {
    return new TripOverview({
      trip,
      loadRequest,
      shipperName: references.shipper?.businessName ?? '',
      carrierName: references.carrier?.fullName ?? '',
      licensePlate: references.vehicle?.licensePlate ?? '',
      vehicleTypeName: references.vehicleTypeName ?? ''
    });
  }

  /**
   * Identifier of the trip.
   */
  get id(): number {
    return this.#trip.id;
  }

  /**
   * The trip.
   */
  get trip(): Trip {
    return this.#trip;
  }

  /**
   * Route, cargo, pickup date and rate of the load request.
   */
  get loadRequest(): TripLoadRequest {
    return this.#loadRequest;
  }

  /**
   * Business name of the shipper.
   */
  get shipperName(): string {
    return this.#shipperName;
  }

  /**
   * Full name of the carrier.
   */
  get carrierName(): string {
    return this.#carrierName;
  }

  /**
   * License plate of the vehicle assigned to the trip.
   */
  get licensePlate(): string {
    return this.#licensePlate;
  }

  /**
   * Type name of the vehicle assigned to the trip, e.g. `Trailer`.
   */
  get vehicleTypeName(): string {
    return this.#vehicleTypeName;
  }
}
