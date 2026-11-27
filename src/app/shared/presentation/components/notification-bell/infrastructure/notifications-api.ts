import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, map, Observable} from 'rxjs';
import {environment} from '../../../../../../environments/environment';
import {BaseApi} from '../../../../infrastructure/base-api';
import {BaseApiEndpoint} from '../../../../infrastructure/base-api-endpoint';
import {AppNotification} from '../domain/notification';
import {NotificationAssembler, NotificationResource, NotificationsResponse} from './notification-assembler';

class NotificationsApiEndpoint extends BaseApiEndpoint<
  AppNotification, NotificationResource, NotificationsResponse, NotificationAssembler
> {
  constructor(http: HttpClient) {
    super(http, `${environment.platformApiBaseUrl}/notifications`, new NotificationAssembler());
  }

  getUnreadCount(userId: string): Observable<number> {
    return this.http.get<{unreadCount: number}>(`${this.endpointUrl}/unread-count`, {params: {userId}}).pipe(
      map(response => response.unreadCount),
      catchError(this.handleError('Failed to get the unread notification count'))
    );
  }

  markAllAsRead(userId: string): Observable<void> {
    return this.http.post<void>(`${this.endpointUrl}/read`, null, {params: {userId}}).pipe(
      catchError(this.handleError('Failed to mark notifications as read'))
    );
  }
}

@Injectable({providedIn: 'root'})
export class NotificationsApi extends BaseApi {
  private readonly endpoint = new NotificationsApiEndpoint(inject(HttpClient));

  list(userId: string): Observable<AppNotification[]> {
    return this.endpoint.getAll({userId});
  }

  getUnreadCount(userId: string): Observable<number> {
    return this.endpoint.getUnreadCount(userId);
  }

  markAllAsRead(userId: string): Observable<void> {
    return this.endpoint.markAllAsRead(userId);
  }
}
