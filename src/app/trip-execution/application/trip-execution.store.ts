import {computed, inject, Injectable, signal} from '@angular/core';
import {map, Observable, of, switchMap} from 'rxjs';
import {Money} from '../../shared/domain/model/money';
import {TripLoadRequest} from '../domain/model/trip-load-request';
import {TripOverview} from '../domain/model/trip-overview';
import {TRIP_GROUPS, TripGroup} from '../domain/model/trip-status';
import {TripExecutionApi} from '../infrastructure/trip-execution-api';

/**
 * Load request consulted by its shipper and its current trip, if any.
 */
interface LoadTracking {
  /**
   * The load request, or null when it does not exist or belongs to another shipper.
   */
  loadRequest: TripLoadRequest | null;
  /**
   * Its current trip, or null when no carrier accepted it yet.
   */
  trip: TripOverview | null;
}

/**
 * Holds Trip Execution state: the active carrier's trips grouped as "My trips" and its service history, and the trip
 * of the load request a shipper is tracking.
 */
@Injectable({
  providedIn: 'root'
})
export class TripExecutionStore {
  private readonly tripExecutionApi = inject(TripExecutionApi);

  private readonly tripsSignal = signal<TripOverview[]>([]);

  /**
   * Readonly signal with the trips of the carrier last requested with {@link loadCarrierTrips}.
   */
  readonly trips = this.tripsSignal.asReadonly();

  /**
   * Computed signal with the completed trips, most recently completed first.
   */
  readonly completedTrips = computed(() =>
    this.trips()
      .filter(item => item.trip.isCompleted())
      .sort((a, b) => (b.trip.completedAt?.getTime() ?? 0) - (a.trip.completedAt?.getTime() ?? 0) || b.id - a.id)
  );

  /**
   * Computed signal with the trips of each group of "My trips": upcoming and in progress trips by pickup date
   * (soonest first), completed trips as in {@link completedTrips}.
   */
  readonly tripsByGroup = computed<Record<TripGroup, TripOverview[]>>(() => ({
    UPCOMING: this.sortByPickup(this.trips().filter(item => item.trip.isUpcoming())),
    IN_PROGRESS: this.sortByPickup(this.trips().filter(item => item.trip.isInProgress())),
    COMPLETED: this.completedTrips()
  }));

  /**
   * Computed signal with the number of listed trips (every group); zero means the carrier has no trips.
   */
  readonly listedTripCount = computed(() =>
    TRIP_GROUPS.reduce((count, group) => count + this.tripsByGroup()[group].length, 0)
  );

  /**
   * Computed signal with the sum of the rates of the completed trips.
   */
  readonly completedTripsTotal = computed(() =>
    Money.ofSoles(this.completedTrips().reduce((total, item) => total + item.loadRequest.offeredRate.amount, 0))
  );

  private readonly trackedTripSignal = signal<TripOverview | null>(null);

  /**
   * Readonly signal with the trip of the tracked load request, or null while it loads or when tracking is not
   * available.
   */
  readonly trackedTrip = this.trackedTripSignal.asReadonly();

  private readonly trackedLoadRequestSignal = signal<TripLoadRequest | null>(null);

  /**
   * Readonly signal with the tracked load request, or null when it does not exist or belongs to another shipper.
   */
  readonly trackedLoadRequest = this.trackedLoadRequestSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Readonly signal indicating if trips are loading.
   */
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);

  /**
   * Readonly signal for the current error message.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Carrier whose trips were last requested, used to ignore late responses.
   */
  private carrierId: number | null = null;

  /**
   * Load request whose tracking was last requested, used to ignore late responses.
   */
  private trackingRequestId: number | null = null;

  /**
   * Loads the trips of a carrier.
   * @param carrierId - Carrier identifier.
   */
  loadCarrierTrips = (carrierId: number): void => {
    if (this.carrierId !== carrierId) {
      this.tripsSignal.set([]);
    }
    this.carrierId = carrierId;
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.tripExecutionApi.getCarrierTrips(carrierId).subscribe({
      next: trips => {
        // Ignore late responses that belong to a previously requested carrier.
        if (this.carrierId === carrierId) {
          this.tripsSignal.set(trips);
          this.loadingSignal.set(false);
        }
      },
      error: err => {
        if (this.carrierId === carrierId) {
          this.errorSignal.set(this.formatError(err, 'Failed to load trips'));
          this.loadingSignal.set(false);
        }
      }
    });
  };

  /**
   * Loads the trip of a load request so its shipper can track it.
   * @param loadRequestId - Load request identifier.
   * @param shipperId - Active shipper, who must own the load request.
   */
  loadTrackingByLoadRequest = (loadRequestId: number, shipperId: number): void => {
    this.trackingRequestId = loadRequestId;
    this.trackedTripSignal.set(null);
    this.trackedLoadRequestSignal.set(null);
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.tripExecutionApi.getLoadRequest(loadRequestId).pipe(
      switchMap((loadRequest): Observable<LoadTracking> =>
        loadRequest.shipperId === shipperId
          ? this.tripExecutionApi.getActiveTripOfLoadRequest(loadRequest).pipe(map(trip => ({loadRequest, trip})))
          : of({loadRequest: null, trip: null})
      )
    ).subscribe({
      next: ({loadRequest, trip}) => {
        // Ignore late responses that belong to a previously tracked load request.
        if (this.trackingRequestId === loadRequestId) {
          this.trackedLoadRequestSignal.set(loadRequest);
          this.trackedTripSignal.set(trip);
          this.loadingSignal.set(false);
        }
      },
      error: err => {
        if (this.trackingRequestId !== loadRequestId) {
          return;
        }
        const message = this.formatError(err, 'Failed to load the tracking');
        if (!message.endsWith('Not found')) {
          this.errorSignal.set(message);
        }
        this.loadingSignal.set(false);
      }
    });
  };

  /**
   * Orders trips by pickup date, the soonest first.
   * @param trips - Trips to order.
   * @returns A new ordered array.
   */
  private sortByPickup = (trips: TripOverview[]): TripOverview[] =>
    [...trips].sort((a, b) => a.trip.pickupAt.getTime() - b.trip.pickupAt.getTime() || a.id - b.id);

  /**
   * Normalizes unknown errors into a display-friendly message.
   * @param error - Source error.
   * @param fallback - Default message when details are unavailable.
   * @returns Normalized message.
   */
  private formatError = (error: unknown, fallback: string): string => {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  };
}
