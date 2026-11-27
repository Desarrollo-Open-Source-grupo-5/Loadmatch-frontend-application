import {BaseAssembler} from '../../../../infrastructure/base-assembler';
import {BaseResponse} from '../../../../infrastructure/base-response';
import {AppNotification} from '../domain/notification';

export type NotificationResource = Omit<AppNotification, 'createdAt' | 'readAt'> & {
  createdAt: string;
  readAt: string | null;
};

export interface NotificationsResponse extends BaseResponse {
  notifications: NotificationResource[];
}

export class NotificationAssembler implements BaseAssembler<
  AppNotification, NotificationResource, NotificationsResponse
> {
  toEntityFromResource(resource: NotificationResource): AppNotification {
    return {
      ...resource,
      createdAt: new Date(resource.createdAt),
      readAt: resource.readAt ? new Date(resource.readAt) : null
    };
  }

  toResourceFromEntity(notification: AppNotification): NotificationResource {
    return {
      ...notification,
      createdAt: notification.createdAt.toISOString(),
      readAt: notification.readAt?.toISOString() ?? null
    };
  }

  toEntitiesFromResponse(response: NotificationsResponse): AppNotification[] {
    return response.notifications.map(resource => this.toEntityFromResource(resource));
  }
}
