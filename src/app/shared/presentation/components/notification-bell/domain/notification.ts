import {BaseEntity} from '../../../../domain/model/base-entity';

export interface AppNotification extends BaseEntity {
  userId: string;
  type: string;
  title: string;
  message: string;
  urgent: boolean;
  read: boolean;
  createdAt: Date;
  readAt: Date | null;
}
