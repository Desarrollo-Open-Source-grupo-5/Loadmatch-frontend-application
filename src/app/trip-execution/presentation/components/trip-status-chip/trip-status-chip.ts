import {Component, computed, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {TripStatus} from '../../../domain/model/trip-status';

/**
 * Badge with the status of a trip.
 */
@Component({
  imports: [MatIcon, TranslatePipe],
  selector: 'app-trip-status-chip',
  styleUrl: './trip-status-chip.css',
  templateUrl: './trip-status-chip.html',
})
export class TripStatusChip {
  private static readonly ICONS: Record<TripStatus, string> = {
    ASSIGNED: 'assignment_ind',
    EN_ROUTE_TO_PICKUP: 'directions',
    AT_PICKUP_POINT: 'directions',
    CARGO_PICKED_UP: 'directions',
    IN_TRANSIT: 'local_shipping',
    DELAYED: 'schedule',
    DELIVERED: 'check_circle',
    DISPUTED: 'report',
    COMPLETED: 'task_alt',
    CANCELLED: 'cancel'
  };

  /**
   * Semantic tone of each status: warning for statuses that need attention, info while the trip moves, success once
   * it is delivered and error for disputed or cancelled trips.
   */
  private static readonly TONES: Record<TripStatus, string> = {
    ASSIGNED: 'warning',
    EN_ROUTE_TO_PICKUP: 'info',
    AT_PICKUP_POINT: 'info',
    CARGO_PICKED_UP: 'info',
    IN_TRANSIT: 'info',
    DELAYED: 'warning',
    DELIVERED: 'success',
    DISPUTED: 'error',
    COMPLETED: 'success',
    CANCELLED: 'error'
  };

  /**
   * Status to display.
   */
  readonly status = input.required<TripStatus>();

  /**
   * Icon that accompanies the status label.
   */
  protected readonly icon = computed(() => TripStatusChip.ICONS[this.status()]);

  /**
   * CSS modifier class with the semantic color of the status.
   */
  protected readonly modifier = computed(() => `status-chip--${TripStatusChip.TONES[this.status()]}`);
}
