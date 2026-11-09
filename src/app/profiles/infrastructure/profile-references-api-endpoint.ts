import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ProfileReference} from '../domain/model/profile-reference';

/**
 * Shipper resource, limited to the fields needed for a profile reference.
 */
interface ShipperResource {
  id: string;
  businessName: string;
}

/**
 * Carrier resource, limited to the fields needed for a profile reference.
 */
interface CarrierResource {
  id: string;
  firstNames: string;
  lastNames: string;
}

/**
 * Endpoint client that finds the profile of a signed-in user (`GET /shippers?userId=` and `GET /carriers?userId=`).
 * Profiles are served by the simulated API (json-server) until the profiles bounded context exists in the
 * LoadMatch Platform, which only provides the IAM users. When it exists, point these URLs to `platformApiBaseUrl`.
 */
export class ProfileReferencesApiEndpoint {
  private readonly shippersUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderShippersEndpointPath}`;
  private readonly carriersUrl = `${environment.platformProviderApiBaseUrl}${environment.platformProviderCarriersEndpointPath}`;

  /**
   * Creates an instance of ProfileReferencesApiEndpoint.
   * @param http - The HttpClient to be used for making API requests.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Finds the shipper profile of a user.
   * @param userId - Identifier of the IAM user.
   * @returns Stream with the profile reference.
   */
  getShipperByUserId(userId: string): Observable<ProfileReference> {
    return this.http.get<ShipperResource[]>(this.shippersUrl, {params: {userId}})
      .pipe(map(shippers => {
        const shipper = ProfileReferencesApiEndpoint.firstOrFail(shippers);
        return {profileId: shipper.id, displayName: shipper.businessName};
      }));
  }

  /**
   * Finds the carrier profile of a user.
   * @param userId - Identifier of the IAM user.
   * @returns Stream with the profile reference.
   */
  getCarrierByUserId(userId: string): Observable<ProfileReference> {
    return this.http.get<CarrierResource[]>(this.carriersUrl, {params: {userId}})
      .pipe(map(carriers => {
        const carrier = ProfileReferencesApiEndpoint.firstOrFail(carriers);
        return {profileId: carrier.id, displayName: `${carrier.firstNames} ${carrier.lastNames}`};
      }));
  }

  /**
   * Takes the profile of a filtered collection.
   * @param profiles - Profiles whose userId matches the signed-in user.
   * @returns The first profile.
   * @throws Error when the user has no profile, so the caller can fall back to the email address.
   */
  private static firstOrFail<T>(profiles: T[]): T {
    if (!profiles.length) {
      throw new Error('The user has no profile');
    }
    return profiles[0];
  }
}
