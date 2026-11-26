import {inject, Injectable} from '@angular/core';
import {map, Observable, switchMap} from 'rxjs';
import {IncidentType, TripIncident} from '../domain/model/trip-incident';
import {TripIncidentsApi} from '../infrastructure/trip-incidents-api';

export const MAX_INCIDENT_EVIDENCE_BYTES = 5 * 1024 * 1024;
export const INCIDENT_EVIDENCE_TYPES = ['image/jpeg', 'image/png'];

@Injectable({providedIn: 'root'})
export class TripIncidentsService {
  private readonly api = inject(TripIncidentsApi);

  list(tripId: string): Observable<TripIncident[]> {
    return this.api.getIncidents(tripId).pipe(
      map(incidents => [...incidents].sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime()))
    );
  }

  report(tripId: string, type: IncidentType, description: string, evidence: File): Observable<TripIncident> {
    return this.readEvidence(evidence).pipe(
      switchMap(fileBase64 => this.api.report(tripId, {
        type,
        description: description.trim(),
        fileName: evidence.name,
        contentType: evidence.type,
        fileBase64
      }))
    );
  }

  downloadEvidence(tripId: string, incidentId: string): Observable<Blob> {
    return this.api.downloadEvidence(tripId, incidentId);
  }

  private readEvidence(file: File): Observable<string> {
    return new Observable(subscriber => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        subscriber.next(dataUrl.slice(dataUrl.indexOf(',') + 1));
        subscriber.complete();
      };
      reader.onerror = () => subscriber.error(reader.error);
      reader.readAsDataURL(file);
      return () => {
        if (reader.readyState === FileReader.LOADING) {
          reader.abort();
        }
      };
    });
  }
}
