import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {TripIncident} from '../domain/model/trip-incident';
import {TripIncidentAssembler} from './trip-incident-assembler';
import {ReportIncidentResource, TripIncidentResource, TripIncidentsResponse} from './trip-incidents-response';

export class TripIncidentsApiEndpoint extends BaseApiEndpoint<
  TripIncident, TripIncidentResource, TripIncidentsResponse, TripIncidentAssembler
> {
  constructor(http: HttpClient, tripId: string) {
    const {platformApiBaseUrl, platformProviderTripsEndpointPath} = environment;
    super(http, `${platformApiBaseUrl}${platformProviderTripsEndpointPath}/${encodeURIComponent(tripId)}/incidents`,
      new TripIncidentAssembler());
  }

  report(resource: ReportIncidentResource): Observable<TripIncident> {
    return this.http.post<TripIncidentResource>(this.endpointUrl, resource).pipe(
      map(incident => this.assembler.toEntityFromResource(incident)),
      catchError(this.handleError('Failed to report incident'))
    );
  }

  downloadEvidence(incidentId: string): Observable<Blob> {
    return this.http.get(`${this.endpointUrl}/${encodeURIComponent(incidentId)}/evidence`, {responseType: 'blob'}).pipe(
      catchError(this.handleError('Failed to download evidence'))
    );
  }
}
