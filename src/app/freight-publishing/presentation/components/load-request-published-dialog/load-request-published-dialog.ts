import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {LocalizedDatePipe} from '../../../../shared/presentation/pipes/localized-date.pipe';
import {MoneyPipe} from '../../../../shared/presentation/pipes/money.pipe';
import {LoadRequest} from '../../../domain/model/load-request.entity';

/**
 * Data received by {@link LoadRequestPublishedDialog}.
 */
export interface LoadRequestPublishedDialogData {
  /**
   * Load request just published.
   */
  loadRequest: LoadRequest;
}

/**
 * Result of {@link LoadRequestPublishedDialog}: open "My Loads" or stay on the form.
 */
export type LoadRequestPublishedDialogResult = 'view-list' | 'stay';

/**
 * Success dialog shown after publishing a load request.
 */
@Component({
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButton, MatIcon, TranslatePipe, LocalizedDatePipe, MoneyPipe],
  selector: 'app-load-request-published-dialog',
  styleUrl: './load-request-published-dialog.css',
  templateUrl: './load-request-published-dialog.html',
})
export class LoadRequestPublishedDialog {
  /**
   * Dialog data with the published load request.
   */
  protected readonly data = inject<LoadRequestPublishedDialogData>(MAT_DIALOG_DATA);

  /**
   * Result that opens "My Loads".
   */
  protected readonly viewListResult: LoadRequestPublishedDialogResult = 'view-list';

  /**
   * Result that keeps the user on the form.
   */
  protected readonly stayResult: LoadRequestPublishedDialogResult = 'stay';
}
