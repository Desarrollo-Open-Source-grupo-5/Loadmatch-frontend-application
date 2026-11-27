import {computed, inject, Injectable, signal} from '@angular/core';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {catchError, EMPTY, exhaustMap, finalize, merge, Observable, Subject, switchMap, tap, timer} from 'rxjs';
import {SessionStore} from '../../../../../iam/application/session.store';
import {AppNotification} from '../domain/notification';
import {NotificationsApi} from '../infrastructure/notifications-api';

const POLL_INTERVAL_MS = 30_000;

interface NotificationBellState {
  notifications: readonly AppNotification[];
  unreadCount: number;
  loading: boolean;
  error: 'list' | 'mark-read' | null;
}

const EMPTY_STATE: NotificationBellState = {
  notifications: [], unreadCount: 0, loading: false, error: null
};

@Injectable()
export class NotificationBellStore {
  private readonly session = inject(SessionStore);
  private readonly api = inject(NotificationsApi);
  private readonly userId = computed(() => {
    const user = this.session.currentUser();
    return user?.token ? user.id : null;
  });

  private readonly stateOwner = signal<string | null>(null);
  private readonly notificationState = signal(EMPTY_STATE);
  private readonly listRequests = new Subject<void>();
  private readonly countRefreshes = new Subject<void>();

  readonly available = computed(() => this.userId() !== null);
  readonly state = computed(() =>
    this.stateOwner() === this.userId() ? this.notificationState() : EMPTY_STATE
  );

  constructor() {
    toObservable(this.userId).pipe(
      switchMap(userId => {
        this.notificationState.set(EMPTY_STATE);
        this.stateOwner.set(userId);
        return userId ? this.watchNotifications(userId) : EMPTY;
      }),
      takeUntilDestroyed()
    ).subscribe();
  }

  load(): void {
    this.listRequests.next();
  }

  private watchNotifications(userId: string): Observable<unknown> {
    return merge(
      this.listRequests.pipe(exhaustMap(() => this.loadNotifications(userId))),
      merge(timer(0, POLL_INTERVAL_MS), this.countRefreshes).pipe(
        switchMap(() => this.api.getUnreadCount(userId).pipe(
          tap(unreadCount => this.update({unreadCount})),
          catchError(() => EMPTY)
        ))
      )
    );
  }

  private loadNotifications(userId: string): Observable<unknown> {
    this.update({loading: true, error: null});
    return this.api.list(userId).pipe(
      catchError(() => {
        this.update({error: 'list'});
        return EMPTY;
      }),
      switchMap(notifications => {
        this.update({notifications});
        if (!notifications.some(notification => !notification.read)) {
          this.update({unreadCount: 0});
          this.countRefreshes.next();
          return EMPTY;
        }

        return this.api.markAllAsRead(userId).pipe(
          tap(() => {
            this.update({
              unreadCount: 0,
              notifications: notifications.map(notification => ({...notification, read: true}))
            });
            this.countRefreshes.next();
          }),
          catchError(() => {
            this.update({error: 'mark-read'});
            return EMPTY;
          })
        );
      }),
      finalize(() => this.update({loading: false}))
    );
  }

  private update(changes: Partial<NotificationBellState>): void {
    this.notificationState.update(state => ({...state, ...changes}));
  }
}
