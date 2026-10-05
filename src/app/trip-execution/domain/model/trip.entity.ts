import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {NORMAL_TRIP_FLOW, TripGroup, tripGroupOf, TripStatus} from './trip-status';
import {TripStatusChange} from './trip-status-change';

/**
 * Execution of an accepted load request by a carrier and one of its vehicles (aggregate root `Trip` of the Trip
 * Execution context, simplified for the Web Application).
 */
export class Trip implements BaseEntity {
  readonly #id: number;
  readonly #loadRequestId: number;
  readonly #shipperId: number;
  readonly #carrierId: number;
  readonly #vehicleId: number;
  readonly #status: TripStatus;
  readonly #assignedAt: Date;
  readonly #pickupAt: Date;
  readonly #deliveredAt: Date | null;
  readonly #confirmedAt: Date | null;
  readonly #completedAt: Date | null;
  readonly #history: readonly TripStatusChange[];

  /**
   * Creates a trip.
   * @param trip - Trip attributes.
   */
  constructor(trip: {
    id: number;
    loadRequestId: number;
    shipperId: number;
    carrierId: number;
    vehicleId: number;
    status: TripStatus;
    assignedAt: Date;
    pickupAt: Date;
    deliveredAt?: Date | null;
    confirmedAt?: Date | null;
    completedAt?: Date | null;
    history?: readonly TripStatusChange[];
  }) {
    this.#id = trip.id;
    this.#loadRequestId = trip.loadRequestId;
    this.#shipperId = trip.shipperId;
    this.#carrierId = trip.carrierId;
    this.#vehicleId = trip.vehicleId;
    this.#status = trip.status;
    this.#assignedAt = trip.assignedAt;
    this.#pickupAt = trip.pickupAt;
    this.#deliveredAt = trip.deliveredAt ?? null;
    this.#confirmedAt = trip.confirmedAt ?? null;
    this.#completedAt = trip.completedAt ?? null;
    this.#history = [...(trip.history ?? [])];
  }

  /**
   * Trip identifier.
   */
  get id(): number {
    return this.#id;
  }

  /**
   * Identifier of the load request the trip originates from (reference by id to Freight Publishing).
   */
  get loadRequestId(): number {
    return this.#loadRequestId;
  }

  /**
   * Short code of the load request shown to users, e.g. `LR-0001`.
   */
  get loadRequestCode(): string {
    return `LR-${String(this.#loadRequestId).padStart(4, '0')}`;
  }

  /**
   * Identifier of the shipper that owns the load (reference by id to Profiles).
   */
  get shipperId(): number {
    return this.#shipperId;
  }

  /**
   * Identifier of the carrier that accepted the load (reference by id to Profiles).
   */
  get carrierId(): number {
    return this.#carrierId;
  }

  /**
   * Identifier of the vehicle assigned to the trip (reference by id to Fleet).
   */
  get vehicleId(): number {
    return this.#vehicleId;
  }

  /**
   * Current status.
   */
  get status(): TripStatus {
    return this.#status;
  }

  /**
   * Group of "My trips" the trip belongs to, or null when it is cancelled.
   */
  get group(): TripGroup | null {
    return tripGroupOf(this.#status);
  }

  /**
   * Date the carrier accepted the load request.
   */
  get assignedAt(): Date {
    return this.#assignedAt;
  }

  /**
   * Pickup date and time agreed in the load request.
   */
  get pickupAt(): Date {
    return this.#pickupAt;
  }

  /**
   * Date the carrier registered the delivery, or null before it.
   */
  get deliveredAt(): Date | null {
    return this.#deliveredAt;
  }

  /**
   * Date the shipper confirmed the receipt, or null before it.
   */
  get confirmedAt(): Date | null {
    return this.#confirmedAt;
  }

  /**
   * Date the trip was completed, or null while it is not completed.
   */
  get completedAt(): Date | null {
    return this.#completedAt;
  }

  /**
   * Status changes from the oldest to the newest (traceability of the trip).
   */
  get history(): readonly TripStatusChange[] {
    return this.#history;
  }

  /**
   * A trip is upcoming while the carrier has not started the way to the pickup point.
   * @returns True when the status is `ASSIGNED`.
   */
  isUpcoming(): boolean {
    return this.group === 'UPCOMING';
  }

  /**
   * A trip is in progress from the way to the pickup point until the delivery is closed, including delays and
   * disputed deliveries.
   * @returns True for every status between `EN_ROUTE_TO_PICKUP` and `DISPUTED`.
   */
  isInProgress(): boolean {
    return this.group === 'IN_PROGRESS';
  }

  /**
   * A trip is completed once the shipper closed the delivery.
   * @returns True when the status is `COMPLETED`.
   */
  isCompleted(): boolean {
    return this.#status === 'COMPLETED';
  }

  /**
   * A cancelled trip no longer moves the load request and is not listed.
   * @returns True when the status is `CANCELLED`.
   */
  isCancelled(): boolean {
    return this.#status === 'CANCELLED';
  }

  /**
   * Most recent status change.
   * @returns The last change of the history, or null when the history is empty.
   */
  lastStatusChange(): TripStatusChange | null {
    return this.#history.at(-1) ?? null;
  }

  /**
   * Statuses of the normal flow the trip has not reached yet, shown as pending steps of the tracking timeline.
   * @returns The pending statuses in order; empty for completed or cancelled trips.
   */
  pendingStatuses(): TripStatus[] {
    if (this.#status === 'COMPLETED' || this.#status === 'CANCELLED') {
      return [];
    }
    const reachedStatuses = [this.#status, ...this.#history.map(change => change.newStatus)];
    const furthestStep = Math.max(...reachedStatuses.map(status => NORMAL_TRIP_FLOW.indexOf(status)));
    return NORMAL_TRIP_FLOW.slice(furthestStep + 1);
  }
}
