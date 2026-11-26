import {BaseEntity} from '../../../shared/domain/model/base-entity';
import {TripStatus} from './trip-status';

export const INCIDENT_TYPES = ['ROAD_BLOCKAGE', 'MECHANICAL_FAILURE', 'ACCIDENT'] as const;

export type IncidentType = (typeof INCIDENT_TYPES)[number];

export interface TripIncident extends BaseEntity {
  type: IncidentType;
  description: string | null;
  evidenceUrl: string;
  reportedAt: Date;
}

export const canReportIncident = (status: TripStatus): boolean =>
  status === 'EN_ROUTE_TO_PICKUP' || status === 'IN_TRANSIT';
