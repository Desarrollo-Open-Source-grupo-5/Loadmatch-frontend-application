import {BaseAssembler} from '../../shared/infrastructure/base-assembler';
import {TripIncident} from '../domain/model/trip-incident';
import {TripIncidentResource, TripIncidentsResponse} from './trip-incidents-response';

export class TripIncidentAssembler implements BaseAssembler<TripIncident, TripIncidentResource, TripIncidentsResponse> {
  toEntityFromResource(resource: TripIncidentResource): TripIncident {
    return {...resource, reportedAt: new Date(resource.reportedAt)};
  }

  toResourceFromEntity(incident: TripIncident): TripIncidentResource {
    return {...incident, reportedAt: incident.reportedAt.toISOString()};
  }

  toEntitiesFromResponse(response: TripIncidentsResponse): TripIncident[] {
    return response.incidents.map(resource => this.toEntityFromResource(resource));
  }
}
