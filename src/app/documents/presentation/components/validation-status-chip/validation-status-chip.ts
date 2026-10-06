import {Component, computed, input} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {DocumentDisplayStatus} from '../../../domain/model/validation-status';

/**
 * Badge with the validation status of a document.
 */
@Component({
  imports: [MatIcon, TranslatePipe],
  selector: 'app-validation-status-chip',
  styleUrl: './validation-status-chip.css',
  templateUrl: './validation-status-chip.html',
})
export class ValidationStatusChip {
  private static readonly ICONS: Record<DocumentDisplayStatus, string> = {
    NOT_UPLOADED: 'upload_file',
    PENDING: 'hourglass_empty',
    IN_REVIEW: 'manage_search',
    APPROVED: 'verified',
    REJECTED: 'block',
    EXPIRED: 'event_busy'
  };

  /**
   * Semantic tone of each status: neutral while nothing was reviewed, info while in review, success when approved,
   * warning when it must be renewed and error when it was rejected.
   */
  private static readonly TONES: Record<DocumentDisplayStatus, string> = {
    NOT_UPLOADED: 'neutral',
    PENDING: 'neutral',
    IN_REVIEW: 'info',
    APPROVED: 'success',
    REJECTED: 'error',
    EXPIRED: 'warning'
  };

  /**
   * Status to display.
   */
  readonly status = input.required<DocumentDisplayStatus>();

  /**
   * Icon that accompanies the status label.
   */
  protected readonly icon = computed(() => ValidationStatusChip.ICONS[this.status()]);

  /**
   * CSS modifier class with the semantic color of the status.
   */
  protected readonly modifier = computed(() => `status-chip--${ValidationStatusChip.TONES[this.status()]}`);
}
