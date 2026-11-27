import {Component, inject, ViewContainerRef} from '@angular/core';
import {MatBadge} from '@angular/material/badge';
import {MatIconButton} from '@angular/material/button';
import {MatDialog} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslatePipe} from '@ngx-translate/core';
import {NotificationBellStore} from './application/notification-bell.store';
import {NotificationPanel} from './notification-panel';

@Component({
  selector: 'app-notification-bell',
  imports: [MatBadge, MatIconButton, MatIcon, MatTooltip, TranslatePipe],
  providers: [NotificationBellStore],
  templateUrl: './notification-bell.html',
  styles: [':host { display: contents; }']
})
export class NotificationBell {
  protected readonly store = inject(NotificationBellStore);
  private readonly dialog = inject(MatDialog);
  private readonly viewContainerRef = inject(ViewContainerRef);

  protected open(): void {
    this.dialog.open(NotificationPanel, {
      viewContainerRef: this.viewContainerRef,
      width: '28rem',
      maxWidth: 'calc(100vw - 2rem)',
      maxHeight: 'calc(100dvh - 2rem)',
      autoFocus: 'first-heading'
    });
  }
}
