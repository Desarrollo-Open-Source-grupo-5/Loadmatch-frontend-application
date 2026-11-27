import {Component, effect, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatProgressBar} from '@angular/material/progress-bar';
import {TranslatePipe} from '@ngx-translate/core';
import {LocalizedDatePipe} from '../../pipes/localized-date.pipe';
import {NotificationBellStore} from './application/notification-bell.store';

@Component({
  imports: [
    LocalizedDatePipe, MatButton, MatDialogActions, MatDialogClose, MatDialogContent,
    MatDialogTitle, MatProgressBar, TranslatePipe
  ],
  templateUrl: './notification-panel.html',
  styleUrl: './notification-panel.css'
})
export class NotificationPanel {
  protected readonly store = inject(NotificationBellStore);
  private readonly dialogRef = inject(MatDialogRef<NotificationPanel>);

  constructor() {
    effect(() => {
      if (!this.store.available()) {
        this.dialogRef.close();
      }
    });
    this.store.load();
  }
}
