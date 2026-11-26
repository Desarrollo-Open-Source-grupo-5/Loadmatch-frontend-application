import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {firstValueFrom, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {TripIncidentsService} from './trip-incidents.service';

describe('TripIncidentsService', () => {
  const tripId = '15bd5773-3397-4c73-a6a5-4f5c59b591cc';
  const incidentId = '42ad8ba1-e590-40fa-b597-85c42f804aae';
  const endpoint = `${environment.platformApiBaseUrl}/trips/${tripId}/incidents`;
  const incident = {
    id: incidentId,
    type: 'ACCIDENT',
    description: 'Road closed',
    evidenceUrl: `/api/v1/trips/${tripId}/incidents/${incidentId}/evidence`,
    reportedAt: '2026-11-27T09:00:00'
  };

  let service: TripIncidentsService;
  let http: HttpTestingController;
  let posting: Subject<void>;

  beforeEach(() => {
    posting = new Subject<void>();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([(request, next) => {
          if (request.method === 'POST') {
            posting.next();
          }
          return next(request);
        }])),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(TripIncidentsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('lists incidents from the platform and sorts them newest first', async () => {
    const result = firstValueFrom(service.list(tripId));
    http.expectOne({method: 'GET', url: endpoint}).flush([
      incident,
      {...incident, id: 'newer-incident', reportedAt: '2026-11-27T10:00:00'}
    ]);

    expect((await result).map(item => item.id)).toEqual(['newer-incident', incidentId]);
    expect((await result)[0].reportedAt).toEqual(new Date('2026-11-27T10:00:00'));
  });

  it('reports the incident with the photo bytes encoded as raw Base64', async () => {
    const photo = new File([Uint8Array.of(0xff, 0xd8, 0xff)], 'photo.jpg', {type: 'image/jpeg'});
    const sent = firstValueFrom(posting);
    const result = firstValueFrom(service.report(tripId, 'ACCIDENT', ' Road closed ', photo));
    await sent;

    const request = http.expectOne({method: 'POST', url: endpoint});
    expect(request.request.body).toEqual({
      type: 'ACCIDENT',
      description: 'Road closed',
      fileName: 'photo.jpg',
      contentType: 'image/jpeg',
      fileBase64: '/9j/'
    });
    request.flush(incident, {status: 201, statusText: 'Created'});
    expect((await result).id).toBe(incidentId);
  });

  it('fetches the selected evidence as a blob through HttpClient', async () => {
    const result = firstValueFrom(service.downloadEvidence(tripId, incidentId));
    const request = http.expectOne({method: 'GET', url: `${endpoint}/${incidentId}/evidence`});
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob([Uint8Array.of(0xff, 0xd8, 0xff)], {type: 'image/jpeg'}));
    expect((await result).type).toBe('image/jpeg');
  });
});
