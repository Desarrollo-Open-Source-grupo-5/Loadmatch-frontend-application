import {Component, inject} from '@angular/core';
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
import {FreightPublishingStore} from '../../../application/freight-publishing.store';
import {LoadRequestStatusChip} from '../../components/load-request-status-chip/load-request-status-chip';


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
    LoadRequestStatusChip,
    ProfileRequired
  ],
  selector: 'app-shipper-dashboard',
  styleUrl: './shipper-dashboard.css',
  templateUrl: './shipper-dashboard.html',
})
export class ShipperDashboard {
  /**
   * Number of operations listed in the dashboard.
   */
  private static readonly LATEST_OPERATIONS = 5;

  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly breakpointObserver = inject(BreakpointObserver);

  /**
   * Freight Publishing store.
   */
  protected readonly store = inject(FreightPublishingStore);

  /**
   * True when a shipper profile is active.
   */
  protected readonly isShipper = this.activeProfileStore.isShipper;

  /**
   * Active shipper profile (business name shown in the greeting).
   */
  protected readonly activeProfile = this.activeProfileStore.activeProfile;

  /**
   * The five most recently created load requests of the shipper.
   */
  protected readonly latestLoadRequests = this.store.latestLoadRequests(ShipperDashboard.LATEST_OPERATIONS);

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
   * ok
   */
  protected readonly displayedColumns = ['code', 'route', 'pickupAt', 'status', 'actions'];
}
