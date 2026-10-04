import {Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {BreakpointObserver} from '@angular/cdk/layout';
import {NgTemplateOutlet} from '@angular/common';
import {RouterLink} from '@angular/router';
import {map} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardActions, MatCardContent} from '@angular/material/card';
import {MatChipListbox, MatChipOption, MatChipSelectionChange} from '@angular/material/chips';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
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
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {ProfileRequired} from '../../../../shared/presentation/components/profile-required/profile-required';
import {LocalizedDatePipe} from '../../../../shared/presentation/pipes/localized-date.pipe';
import {LocalizedNumberPipe} from '../../../../shared/presentation/pipes/localized-number.pipe';
import {MoneyPipe} from '../../../../shared/presentation/pipes/money.pipe';
import {FreightPublishingStore} from '../../../application/freight-publishing.store';
import {
  countLoadRequestsByStatus,
  filterLoadRequestsByStatus,
  LOAD_REQUEST_STATUS_FILTERS,
  LoadRequestStatusFilter
} from '../../../application/load-request-status-filter';
import {LoadRequest} from '../../../domain/model/load-request.entity';
import {LoadRequestStatusChip} from '../../components/load-request-status-chip/load-request-status-chip';
import {
  CancelLoadRequestDialog,
  CancelLoadRequestDialogData
} from '../../components/cancel-load-request-dialog/cancel-load-request-dialog';

/**
 * "My Loads": the active shipper's load requests filtered by status, with the actions allowed by each status.
 */
@Component({
  imports: [
    NgTemplateOutlet,
    RouterLink,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardActions,
    MatChipListbox,
    MatChipOption,
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
    LoadRequestStatusChip,
    ProfileRequired
  ],
  selector: 'app-load-request-list',
  styleUrl: './load-request-list.css',
  templateUrl: './load-request-list.html',
})
export class LoadRequestList {
  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);
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
   * Status filter options (All + the five statuses).
   */
  protected readonly filters = LOAD_REQUEST_STATUS_FILTERS;

  /**
   * Selected status filter.
   */
  protected readonly statusFilter = signal<LoadRequestStatusFilter>('ALL');

  /**
   * Load requests that match the selected filter.
   */
  protected readonly filteredLoadRequests = computed(() =>
    filterLoadRequestsByStatus(this.store.loadRequests(), this.statusFilter())
  );

  /**
   * Number of load requests per filter option.
   */
  protected readonly counts = computed(() => countLoadRequestsByStatus(this.store.loadRequests()));

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
  protected readonly displayedColumns = ['code', 'route', 'pickupAt', 'offeredRate', 'status', 'actions'];

  /**
   * Applies a status filter when its chip gets selected.
   * @param filter - Filter of the chip.
   * @param change - Selection change of the chip.
   */
  protected onFilterSelectionChange(filter: LoadRequestStatusFilter, change: MatChipSelectionChange): void {
    if (change.selected) {
      this.statusFilter.set(filter);
    }
  }

  /**
   * Indicates whether a load request has no available action.
   * @param loadRequest - Load request of the row.
   * @returns True when it can be neither edited, cancelled nor tracked.
   */
  protected hasNoActions(loadRequest: LoadRequest): boolean {
    return !loadRequest.isEditable() && !loadRequest.isCancellable() && !loadRequest.isTrackable();
  }

  /**
   * Asks for the cancellation reason and cancels the load request.
   * @param loadRequest - Load request to cancel.
   */
  protected openCancelDialog(loadRequest: LoadRequest): void {
    this.dialog
      .open<CancelLoadRequestDialog, CancelLoadRequestDialogData, string>(CancelLoadRequestDialog, {
        data: {loadRequest},
        width: '440px'
      })
      .afterClosed()
      .subscribe(reason => {
        if (reason) {
          this.store.cancelLoadRequest(loadRequest.id, reason, cancelled =>
            this.snackBar.open(
              this.translate.instant('load-request-list.cancelled', {code: cancelled.code}),
              this.translate.instant('common.close'),
              {duration: 4000}
            )
          );
        }
      });
  }
}
