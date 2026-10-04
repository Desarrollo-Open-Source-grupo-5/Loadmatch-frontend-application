import {Component, computed, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {LoadRequestStatus} from '../../../domain/model/load-request-status';

/**
 * Badge with the status of a load request.
 */
@Component({
  imports: [MatIcon, TranslatePipe],
  selector: 'app-load-request-status-chip',
  styleUrl: './load-request-status-chip.css',
  templateUrl: './load-request-status-chip.html',
})
export class LoadRequestStatusChip {
  private static readonly ICONS: Record<LoadRequestStatus, string> = {
    DRAFT: 'edit_note',
    PUBLISHED: 'search',
    ASSIGNED: 'assignment_ind',
    IN_TRANSIT: 'local_shipping',
    DELIVERED: 'check_circle',
    CANCELLED: 'cancel'
  };

  /**
   * Status to display.
   */
  readonly status = input.required<LoadRequestStatus>();

  /**
   * Icon that accompanies the status label.
   */
  protected readonly icon = computed(() => LoadRequestStatusChip.ICONS[this.status()]);

  /**
   * CSS modifier class with the semantic color of the status.
   */
  protected readonly modifier = computed(() => `status-chip--${this.status().toLowerCase().replace('_', '-')}`);
}
