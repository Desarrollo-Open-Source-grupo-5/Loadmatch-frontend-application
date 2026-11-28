import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {firstValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment';
import {RatingApi} from './rating-api';

describe('RatingApi', () => {
  const baseUrl = `${environment.platformApiBaseUrl}/ratings`;

  let ratingApi: RatingApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    ratingApi = TestBed.inject(RatingApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('registers a carrier rating for a completed paid trip', async () => {
    const payload = {
      tripId: 'trip-1',
      raterId: 'carrier-1',
      raterType: 'CARRIER' as const,
      score: 5,
      comment: 'Smooth loading process'
    };

    const result = firstValueFrom(ratingApi.registerRating(payload));
    const req = http.expectOne({method: 'POST', url: baseUrl});
    expect(req.request.body).toEqual(payload);
    req.flush({
      id: 'rating-1',
      tripId: 'trip-1',
      raterId: 'carrier-1',
      rateeId: 'shipper-1',
      raterType: 'CARRIER',
      score: 5,
      comment: 'Smooth loading process',
      createdAt: '2026-11-28T00:00:00Z'
    });

    expect((await result).raterType).toBe('CARRIER');
  });

  it('fetches ratings by rateeId', async () => {
    const result = firstValueFrom(ratingApi.getRatingsByRatee('shipper-1'));
    http.expectOne({method: 'GET', url: `${baseUrl}?rateeId=shipper-1`}).flush([]);

    expect(await result).toEqual([]);
  });
});

