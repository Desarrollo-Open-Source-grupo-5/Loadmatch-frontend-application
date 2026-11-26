import {Component, effect, inject, signal, untracked} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatTab, MatTabGroup, MatTabLabel} from '@angular/material/tabs';
import {TranslatePipe} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {ProfileRequired} from '../../../../shared/presentation/components/profile-required/profile-required';
import {LocalizedDatePipe} from '../../../../shared/presentation/pipes/localized-date.pipe';
import {TripExecutionStore} from '../../../application/trip-execution.store';
import {TRIP_GROUPS} from '../../../domain/model/trip-status';
import {isPlatformId} from '../../../domain/model/platform-id';
import {canReportIncident} from '../../../domain/model/trip-incident';
import {TripIncidents} from '../../components/trip-incidents/trip-incidents';
import {TripStatusChip} from '../../components/trip-status-chip/trip-status-chip';

/**
 * "My trips": the active carrier's trips grouped in Upcoming, In progress and Completed, each with its count, load
 * request code, date, route, shipper, status and vehicle plate.
 */
@Component({
  imports: [
    RouterLink,
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatProgressBar,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    TranslatePipe,
    LocalizedDatePipe,
    TripStatusChip,
    TripIncidents,
    ProfileRequired
  ],
  selector: 'app-carrier-trips',
  styleUrl: './carrier-trips.css',
  templateUrl: './carrier-trips.html',
})
export class CarrierTrips {
  protected readonly isPlatformId = isPlatformId;
  protected readonly canReportIncident = canReportIncident;
  private readonly activeProfileStore = inject(ActiveProfileStore);

  /**
   * Trip Execution store.
   */
  protected readonly store = inject(TripExecutionStore);

  /**
   * True when a carrier profile is active.
   */
  protected readonly isCarrier = this.activeProfileStore.isCarrier;

  /**
   * Groups shown as tabs, in display order.
   */
  protected readonly groups = TRIP_GROUPS;

  /**
   * Index of the selected tab (Upcoming by default).
   */
  protected readonly selectedTab = signal(0);

  /**
   * Creates the view and loads the trips of the active carrier every time it changes.
   */
  constructor() {
    effect(() => {
      const carrierId = this.activeProfileStore.carrierId();
      untracked(() => {
        if (carrierId) {
          this.store.loadCarrierTrips(carrierId);
        }
      });
    });
  }

  protected refreshTrips(): void {
    const carrierId = this.activeProfileStore.carrierId();
    if (carrierId) {
      this.store.loadCarrierTrips(carrierId);
    }
  }
}
