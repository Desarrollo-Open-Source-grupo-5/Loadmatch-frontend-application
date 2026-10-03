import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {Dimensions} from '../../../shared/domain/model/dimensions';
import {Money} from '../../../shared/domain/model/money';
import {LoadRequestStatus} from './load-request-status';
import {Route} from './route';

/**
 * Transport and cargo data a shipper provides when publishing or editing a load request.
 */
export interface LoadRequestDetails {
  /**
   * Identifier of the required vehicle type (reference by id to Fleet).
   */
  vehicleTypeId: number;
  /**
   * Origin, destination and distance.
   */
  route: Route;
  /**
   * Cargo weight in kilograms.
   */
  weightKg: number;
  /**
   * Cargo dimensions.
   */
  dimensions: Dimensions;
  /**
   * Kind of goods (e.g. `Packaged food`).
   */
  cargoType: string;
  /**
   * Rate offered by the shipper.
   */
  offeredRate: Money;
  /**
   * Requested pickup date and time.
   */
  pickupAt: Date;
}

/**
 * Request to move a load from an origin to a destination (aggregate root `LoadRequest` of the Freight Publishing
 * context).
 */
export class LoadRequest implements BaseEntity {
  #id: number;
  #shipperId: number;
  #vehicleTypeId: number;
  #route: Route;
  #weightKg: number;
  #dimensions: Dimensions;
  #cargoType: string;
  #offeredRate: Money;
  #status: LoadRequestStatus;
  #pickupAt: Date;
  #createdAt: Date | null;
  #publishedAt: Date | null;
  #urgent: boolean;
  #cancellationReason: string | null;

  /**
   * Creates a load request.
   * @param loadRequest - Load request attributes.
   */
  constructor(loadRequest: LoadRequestDetails & {
    id: number;
    shipperId: number;
    status?: LoadRequestStatus;
    createdAt?: Date | null;
    publishedAt?: Date | null;
    urgent?: boolean;
    cancellationReason?: string | null;
  }) {
    this.#id = loadRequest.id;
    this.#shipperId = loadRequest.shipperId;
    this.#vehicleTypeId = loadRequest.vehicleTypeId;
    this.#route = loadRequest.route;
    this.#weightKg = loadRequest.weightKg;
    this.#dimensions = loadRequest.dimensions;
    this.#cargoType = loadRequest.cargoType;
    this.#offeredRate = loadRequest.offeredRate;
    this.#status = loadRequest.status ?? 'DRAFT';
    this.#pickupAt = loadRequest.pickupAt;
    this.#createdAt = loadRequest.createdAt ?? null;
    this.#publishedAt = loadRequest.publishedAt ?? null;
    this.#urgent = loadRequest.urgent ?? false;
    this.#cancellationReason = loadRequest.cancellationReason ?? null;
  }

  /**
   * Load request identifier.
   */
  get id(): number {
    return this.#id;
  }

  set id(value: number) {
    this.#id = value;
  }

  /**
   * Short code shown to users, e.g. `LR-0007`.
   */
  get code(): string {
    return `LR-${String(this.#id).padStart(4, '0')}`;
  }

  /**
   * Identifier of the shipper that owns the request (reference by id to Profiles).
   */
  get shipperId(): number {
    return this.#shipperId;
  }

  set shipperId(value: number) {
    this.#shipperId = value;
  }

  /**
   * Identifier of the required vehicle type (reference by id to Fleet).
   */
  get vehicleTypeId(): number {
    return this.#vehicleTypeId;
  }

  set vehicleTypeId(value: number) {
    this.#vehicleTypeId = value;
  }

  /**
   * Origin, destination and distance.
   */
  get route(): Route {
    return this.#route;
  }

  set route(value: Route) {
    this.#route = value;
  }

  /**
   * Cargo weight in kilograms.
   */
  get weightKg(): number {
    return this.#weightKg;
  }

  set weightKg(value: number) {
    this.#weightKg = value;
  }

  /**
   * Cargo dimensions.
   */
  get dimensions(): Dimensions {
    return this.#dimensions;
  }

  set dimensions(value: Dimensions) {
    this.#dimensions = value;
  }

  /**
   * Kind of goods.
   */
  get cargoType(): string {
    return this.#cargoType;
  }

  set cargoType(value: string) {
    this.#cargoType = value;
  }

  /**
   * Rate offered by the shipper.
   */
  get offeredRate(): Money {
    return this.#offeredRate;
  }

  set offeredRate(value: Money) {
    this.#offeredRate = value;
  }

  /**
   * Requested pickup date and time.
   */
  get pickupAt(): Date {
    return this.#pickupAt;
  }

  set pickupAt(value: Date) {
    this.#pickupAt = value;
  }

  /**
   * Whether the request was republished as urgent.
   */
  get urgent(): boolean {
    return this.#urgent;
  }

  set urgent(value: boolean) {
    this.#urgent = value;
  }

  /**
   * Current lifecycle status.
   */
  get status(): LoadRequestStatus {
    return this.#status;
  }

  /**
   * Creation date, or null before the request is saved.
   */
  get createdAt(): Date | null {
    return this.#createdAt;
  }

  /**
   * Publication date, or null while the request is a draft.
   */
  get publishedAt(): Date | null {
    return this.#publishedAt;
  }

  /**
   * Reason given when the request was cancelled, or null.
   */
  get cancellationReason(): string | null {
    return this.#cancellationReason;
  }

  /**
   * A request is available for matching while it is published (searching for a vehicle).
   * @returns True when the status is `PUBLISHED`.
   */
  isAvailable(): boolean {
    return this.#status === 'PUBLISHED';
  }

  /**
   * A request can be edited until a carrier accepts it.
   * @returns True when the status is `DRAFT` or `PUBLISHED`.
   */
  isEditable(): boolean {
    return this.#status === 'DRAFT' || this.#status === 'PUBLISHED';
  }

  /**
   * A request can be cancelled while it is not assigned to a carrier.
   * @returns True when the status is `DRAFT` or `PUBLISHED`.
   */
  isCancellable(): boolean {
    return this.#status === 'DRAFT' || this.#status === 'PUBLISHED';
  }

  /**
   * Tracking is only meaningful while the cargo travels.
   * @returns True when the status is `IN_TRANSIT`.
   */
  isTrackable(): boolean {
    return this.#status === 'IN_TRANSIT';
  }

  /**
   * Publishes a draft so carriers can find it.
   * @param now - Current date, injectable for tests.
   * @throws Error when the request is not a draft or its data is invalid.
   */
  publish(now: Date = new Date()): void {
    if (this.#status !== 'DRAFT') {
      throw new Error(`Only draft load requests can be published (current status: ${this.#status})`);
    }
    this.validateDetails(this.toDetails(), now);
    this.#status = 'PUBLISHED';
    this.#createdAt = this.#createdAt ?? now;
    this.#publishedAt = now;
  }

  /**
   * Changes the transport and cargo data of a request that was not accepted yet.
   * @param details - New data (pickup date, weight, rate and the remaining fields).
   * @param now - Current date, injectable for tests.
   * @throws Error when the request is not editable or the new data is invalid.
   */
  edit(details: LoadRequestDetails, now: Date = new Date()): void {
    if (!this.isEditable()) {
      throw new Error(`Load request ${this.code} can no longer be edited (current status: ${this.#status})`);
    }
    this.validateDetails(details, now);
    this.#vehicleTypeId = details.vehicleTypeId;
    this.#route = details.route;
    this.#weightKg = details.weightKg;
    this.#dimensions = details.dimensions;
    this.#cargoType = details.cargoType;
    this.#offeredRate = details.offeredRate;
    this.#pickupAt = details.pickupAt;
  }

  /**
   * Withdraws the request from the market.
   * @param reason - Reason given by the shipper.
   * @throws Error when the request is already assigned or later, or the reason is empty.
   */
  cancel(reason: string): void {
    if (!this.isCancellable()) {
      throw new Error(`Load request ${this.code} can no longer be cancelled (current status: ${this.#status})`);
    }
    if (!reason.trim()) {
      throw new Error('A cancellation reason is required');
    }
    this.#status = 'CANCELLED';
    this.#cancellationReason = reason.trim();
  }

  /**
   * Creates an independent copy, so changes can be applied without touching the stored state until the API confirms
   * them.
   * @returns A copy of this load request.
   */
  clone(): LoadRequest {
    return new LoadRequest({
      ...this.toDetails(),
      id: this.#id,
      shipperId: this.#shipperId,
      status: this.#status,
      createdAt: this.#createdAt,
      publishedAt: this.#publishedAt,
      urgent: this.#urgent,
      cancellationReason: this.#cancellationReason
    });
  }

  /**
   * Collects the editable data of the request.
   * @returns Current transport and cargo data.
   */
  private toDetails(): LoadRequestDetails {
    return {
      vehicleTypeId: this.#vehicleTypeId,
      route: this.#route,
      weightKg: this.#weightKg,
      dimensions: this.#dimensions,
      cargoType: this.#cargoType,
      offeredRate: this.#offeredRate,
      pickupAt: this.#pickupAt
    };
  }

  /**
   * Validates route, weight, dimensions, rate and pickup date.
   * @param details - Data to validate.
   * @param now - Current date.
   * @throws Error describing the first invalid attribute.
   */
  private validateDetails(details: LoadRequestDetails, now: Date): void {
    if (!details.route.isValid()) {
      throw new Error('Origin and destination must be different');
    }
    this.validateWeightAndDimensions(details);
    if (!details.cargoType.trim()) {
      throw new Error('Cargo type is required');
    }
    if (!details.offeredRate.isPositive()) {
      throw new Error('Offered rate must be greater than zero');
    }
    this.validatePickupDateInFuture(details.pickupAt, now);
  }

  /**
   * Validates that weight and every dimension are positive.
   * @param details - Data to validate.
   * @throws Error when a value is not positive.
   */
  private validateWeightAndDimensions(details: LoadRequestDetails): void {
    const {lengthM, widthM, heightM} = details.dimensions;
    if (details.weightKg <= 0 || lengthM <= 0 || widthM <= 0 || heightM <= 0) {
      throw new Error('Weight and dimensions must be greater than zero');
    }
  }

  /**
   * Validates that the pickup date is in the future.
   * @param pickupAt - Requested pickup date.
   * @param now - Current date.
   * @throws Error when the pickup date is not after now.
   */
  private validatePickupDateInFuture(pickupAt: Date, now: Date): void {
    if (pickupAt.getTime() <= now.getTime()) {
      throw new Error('Pickup date must be in the future');
    }
  }
}
