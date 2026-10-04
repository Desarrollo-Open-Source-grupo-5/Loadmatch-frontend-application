import {Component, computed, effect, inject, untracked} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {ProfileRequired} from '../../../../shared/presentation/components/profile-required/profile-required';
import {LocalizedDatePipe} from '../../../../shared/presentation/pipes/localized-date.pipe';
import {LocalizedNumberPipe} from '../../../../shared/presentation/pipes/localized-number.pipe';
import {MoneyPipe} from '../../../../shared/presentation/pipes/money.pipe';
import {FreightPublishingStore} from '../../../application/freight-publishing.store';
import {LoadRequest} from '../../../domain/model/load-request.entity';
import {LoadRequestStatusChip} from '../../components/load-request-status-chip/load-request-status-chip';
import {
  CancelLoadRequestDialog,
  CancelLoadRequestDialogData
} from '../../components/cancel-load-request-dialog/cancel-load-request-dialog';

/**
 * Detail of one of the active shipper's load requests: route, cargo and, once a carrier accepted it, the assigned
 * carrier and vehicle.
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
    MoneyPipe,
    LoadRequestStatusChip,
    ProfileRequired
  ],
  selector: 'app-load-request-detail',
  styleUrl: './load-request-detail.css',
  templateUrl: './load-request-detail.html',
})
export class LoadRequestDetail {
  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);

  /**
   * Freight Publishing store.
   */
  protected readonly store = inject(FreightPublishingStore);

  /**
   * True when a shipper profile is active.
   */
  protected readonly isShipper = this.activeProfileStore.isShipper;

  /**
   * Identifier taken from the route, or null when it is not a valid identifier.
   */
  protected readonly loadRequestId: number | null = this.parseId(this.route.snapshot.paramMap.get('id'));

  /**
   * Consulted load request, once the store has loaded the shipper's load requests.
   */
  protected readonly loadRequest = computed(() =>
    this.loadRequestId === null
      ? undefined
      : this.store.loadRequests().find(loadRequest => loadRequest.id === this.loadRequestId)
  );

  /**
   * Name of the vehicle type required by the request.
   */
  protected readonly vehicleTypeName = computed(() => {
    const loadRequest = this.loadRequest();
    return loadRequest ? this.store.vehicleTypes().find(vehicleType => vehicleType.id === loadRequest.vehicleTypeId)?.name ?? '' : '';
  });

  /**
   * Creates the view and loads the assigned carrier every time the consulted request (or its status) changes, e.g.
   * after it is cancelled from this view.
   */
  constructor() {
    effect(() => {
      const loadRequest = this.loadRequest();
      const status = loadRequest?.status;
      untracked(() => {
        if (loadRequest && status) {
          this.store.loadAssignedCarrier(loadRequest.id);
        }
      });
    });
  }

  /**
   * True when the request does not exist or does not belong to the active shipper.
   * @returns Whether the not-found message is shown.
   */
  protected isNotFound(): boolean {
    return !this.store.loading() && !this.loadRequest();
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
              this.translate.instant('load-request-detail.cancelled', {code: cancelled.code}),
              this.translate.instant('common.close'),
              {duration: 4000}
            )
          );
        }
      });
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
