import {TripStatus} from './trip-status';

/**
 * One status change of a trip.
 */
export class TripStatusChange {
  readonly #previousStatus: TripStatus | null;
  readonly #newStatus: TripStatus;
  readonly #registeredAt: Date;

  /**
   * Creates a trip status change.
   * @param props - Previous status (null for the first one), new status and registration date.
   */
  constructor(props: { previousStatus: TripStatus | null; newStatus: TripStatus; registeredAt: Date }) {
    this.#previousStatus = props.previousStatus;
    this.#newStatus = props.newStatus;
    this.#registeredAt = props.registeredAt;
  }

  /**
   * Status before the change, or null when the trip was created.
   */
  get previousStatus(): TripStatus | null {
    return this.#previousStatus;
  }

  /**
   * Status the trip moved to.
   */
  get newStatus(): TripStatus {
    return this.#newStatus;
  }

  /**
   * Date and time the change was registered.
   */
  get registeredAt(): Date {
    return this.#registeredAt;
  }
}
