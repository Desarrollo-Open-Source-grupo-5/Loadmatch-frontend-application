import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {firstValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ProfilesApi} from './profiles-api';

describe('Profile references in ProfilesApi', () => {
  const userId = 'bdf07955-f3af-452b-9a11-1d66c91d4356';
  const profileId = 'e5fef9aa-9e99-46b0-ad8a-713cef85621e';
  const platformUrl = environment.platformApiBaseUrl;

  let profiles: ProfilesApi;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    profiles = TestBed.inject(ProfilesApi);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('uses the shipper UUID and business name returned by the platform', async () => {
    const result = firstValueFrom(profiles.getProfileReferenceByUserId(userId, 'SHIPPER'));
    http.expectOne({method: 'GET', url: `${platformUrl}/shippers?userId=${userId}`})
      .flush({id: profileId, businessName: 'Demo Shipper'});

    expect(await result).toEqual({profileId, displayName: 'Demo Shipper'});
  });

  it('uses the carrier UUID and full name returned by the platform', async () => {
    const result = firstValueFrom(profiles.getProfileReferenceByUserId(userId, 'CARRIER'));
    http.expectOne({method: 'GET', url: `${platformUrl}/carriers?userId=${userId}`})
      .flush({id: profileId, firstNames: 'Demo', lastNames: 'Carrier'});

    expect(await result).toEqual({profileId, displayName: 'Demo Carrier'});
  });

  it('propagates a missing profile so sign-in can use its existing fallback', async () => {
    const result = firstValueFrom(profiles.getProfileReferenceByUserId(userId, 'CARRIER'));
    http.expectOne({method: 'GET', url: `${platformUrl}/carriers?userId=${userId}`})
      .flush(null, {status: 404, statusText: 'Not Found'});

    await expectAsync(result).toBeRejectedWith(jasmine.objectContaining({status: 404}));
  });
});
