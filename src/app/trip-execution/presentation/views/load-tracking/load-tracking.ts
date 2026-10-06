import {Component, computed, effect, inject, untracked} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {TranslatePipe} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {ProfileRequired} from '../../../../shared/presentation/components/profile-required/profile-required';
import {LocalizedDatePipe} from '../../../../shared/presentation/pipes/localized-date.pipe';
import {LocalizedNumberPipe} from '../../../../shared/presentation/pipes/localized-number.pipe';
import {TripExecutionStore} from '../../../application/trip-execution.store';
import {TripStatus} from '../../../domain/model/trip-status';
import {TripStatusChip} from '../../components/trip-status-chip/trip-status-chip';

/**
 * Step of the tracking timeline.
 */
export interface TrackingStep {
  /**
   * Exact trip status of the step.
   */
  status: TripStatus;
  /**
   * `done` for past changes, `current` for the latest change and `pending` for the steps of the normal flow the trip
   * has not reached yet.
   */
  state: 'done' | 'current' | 'pending';
  /**
   * Date the status was registered, or null for pending steps.
   */
  registeredAt: Date | null;
}

/**
 * Tracking of one of the active shipper's load requests: current status, route, pickup date, carrier and vehicle, and
 * a vertical timeline built from the trip history with the pending steps of the normal flow.
 */
@Component({
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    MatProgressBar,
    TranslatePipe,
    LocalizedDatePipe,
    LocalizedNumberPipe,
    TripStatusChip,
    ProfileRequired
  ],
  selector: 'app-load-tracking',
  styleUrl: './load-tracking.css',
  templateUrl: './load-tracking.html',
})
export class LoadTracking {
  private static readonly CURRENT_STEP_ICONS: Partial<Record<TripStatus, string>> = {
    DELAYED: 'schedule',
    DISPUTED: 'report',
    COMPLETED: 'task_alt'
  };

  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly route = inject(ActivatedRoute);

  /**
   * Trip Execution store.
   */
  protected readonly store = inject(TripExecutionStore);

  /**
   * True when a shipper profile is active.
   */
  protected readonly isShipper = this.activeProfileStore.isShipper;

  /**
   * Load request identifier taken from the route, or null when it is not a valid identifier.
   */
  protected readonly loadRequestId: number | null = this.parseId(this.route.snapshot.paramMap.get('loadRequestId'));

  /**
   * Timeline of the tracked trip: its status changes, oldest first, followed by the pending steps.
   */
  protected readonly timeline = computed<TrackingStep[]>(() => {
    const trip = this.store.trackedTrip()?.trip;
    if (!trip) {
      return [];
    }
    const lastIndex = trip.history.length - 1;
    const reached = trip.history.map((change, index): TrackingStep => ({
      status: change.newStatus,
      state: index === lastIndex ? 'current' : 'done',
      registeredAt: change.registeredAt
    }));
    const pending = trip.pendingStatuses().map((status): TrackingStep => ({status, state: 'pending', registeredAt: null}));
    return [...reached, ...pending];
  });

  /**
   * Link back to the load request detail when it belongs to the shipper, or to "My Loads" otherwise.
   */
  protected readonly backLink = computed(() => {
    const loadRequest = this.store.trackedLoadRequest();
    return loadRequest ? ['/shipper/load-requests', loadRequest.id] : ['/shipper/load-requests'];
  });

  /**
   * Creates the view and loads the tracking every time the active shipper changes.
   */
  constructor() {
    effect(() => {
      const shipperId = this.activeProfileStore.shipperId();
      untracked(() => {
        if (shipperId && this.loadRequestId !== null) {
          this.store.loadTrackingByLoadRequest(this.loadRequestId, shipperId);
        }
      });
    });
  }

  /**
   * Icon of a timeline step.
   * @param step - Step to draw.
   * @returns A check for past steps, an empty circle for pending ones and, for the current step, an icon that
   *   reflects its status.
   */
  protected stepIcon(step: TrackingStep): string {
    switch (step.state) {
      case 'done':
        return 'check_circle';
      case 'pending':
        return 'radio_button_unchecked';
      case 'current':
        return LoadTracking.CURRENT_STEP_ICONS[step.status] ?? 'radio_button_checked';
    }
  }

  /**
   * Parses the route identifier.
   * @param id - Raw route parameter.
   * @returns The numeric identifier, or null when absent or invalid.
   */
  private parseId(id: string | null): number | null {
    const parsed = Number(id);
    return id !== null && Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }
}
