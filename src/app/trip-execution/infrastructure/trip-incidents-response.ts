import {BaseResponse} from '../../shared/infrastructure/base-response';
import {IncidentType, TripIncident} from '../domain/model/trip-incident';

export type TripIncidentResource = Omit<TripIncident, 'reportedAt'> & { reportedAt: string };

export interface TripIncidentsResponse extends BaseResponse {
  incidents: TripIncidentResource[];
}

export interface ReportIncidentResource {
  type: IncidentType;
  description: string;
  fileName: string;
  contentType: string;
  fileBase64: string;
}
