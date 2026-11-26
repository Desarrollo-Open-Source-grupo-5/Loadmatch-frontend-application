import {HttpClient} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {TripIncident} from '../domain/model/trip-incident';
import {TripIncidentsApiEndpoint} from './trip-incidents-api-endpoint';
import {ReportIncidentResource} from './trip-incidents-response';

@Injectable({providedIn: 'root'})
export class TripIncidentsApi extends BaseApi {
  private readonly http = inject(HttpClient);

  getIncidents(tripId: string): Observable<TripIncident[]> {
    return new TripIncidentsApiEndpoint(this.http, tripId).getAll();
  }

  report(tripId: string, resource: ReportIncidentResource): Observable<TripIncident> {
    return new TripIncidentsApiEndpoint(this.http, tripId).report(resource);
  }

  downloadEvidence(tripId: string, incidentId: string): Observable<Blob> {
    return new TripIncidentsApiEndpoint(this.http, tripId).downloadEvidence(incidentId);
  }
}
