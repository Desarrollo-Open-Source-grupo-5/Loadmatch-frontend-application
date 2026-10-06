import {Component, effect, inject, untracked} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {BreakpointObserver} from '@angular/cdk/layout';
import {RouterLink} from '@angular/router';
import {map} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {TranslatePipe} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {ProfileRequired} from '../../../../shared/presentation/components/profile-required/profile-required';
import {LocalizedDatePipe} from '../../../../shared/presentation/pipes/localized-date.pipe';
import {LocalizedNumberPipe} from '../../../../shared/presentation/pipes/localized-number.pipe';
import {MoneyPipe} from '../../../../shared/presentation/pipes/money.pipe';
import {TripExecutionStore} from '../../../application/trip-execution.store';
import {TripStatusChip} from '../../components/trip-status-chip/trip-status-chip';


@Component({
  imports: [
    RouterLink,
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatProgressBar,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    TranslatePipe,
    LocalizedDatePipe,
    LocalizedNumberPipe,
    MoneyPipe,
    TripStatusChip,
    ProfileRequired
  ],
  selector: 'app-service-history',
  styleUrl: './service-history.css',
  templateUrl: './service-history.html',
})
export class ServiceHistory {
  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly breakpointObserver = inject(BreakpointObserver);

  /**
   * Trip Execution store.
   */
  protected readonly store = inject(TripExecutionStore);

  /**
   * True when a carrier profile is active.
   */
  protected readonly isCarrier = this.activeProfileStore.isCarrier;

  /**
   * True on narrow content areas (phones, tablets, small laptops with the side navigation), where cards replace the
   * table.
   */
  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe('(max-width: 1199.98px)').pipe(map(state => state.matches)),
    {initialValue: false}
  );

  /**
   * Columns of the desktop table.
   */
  protected readonly displayedColumns = ['completedAt', 'route', 'shipper', 'distance', 'rate', 'status'];

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
}
