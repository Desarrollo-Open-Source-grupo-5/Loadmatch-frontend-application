import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ProfileReference} from '../domain/model/profile-reference';

/**
 * Shipper resource of the LoadMatch Platform, limited to the fields needed for a profile reference.
 */
interface PlatformShipperResource {
  id: string;
  businessName: string;
}

/**
 * Carrier resource of the LoadMatch Platform, limited to the fields needed for a profile reference.
 */
interface PlatformCarrierResource {
  id: string;
  fullName: string;
}

/**
 * Endpoint client that finds the profile of a signed-in user in the LoadMatch Platform
 * (`GET /shippers?userId=` and `GET /carriers?userId=`).
 */
export class ProfileReferencesApiEndpoint {
  private readonly shippersUrl = `${environment.platformApiBaseUrl}${environment.platformProviderShippersEndpointPath}`;
  private readonly carriersUrl = `${environment.platformApiBaseUrl}${environment.platformProviderCarriersEndpointPath}`;

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
    return this.http.get<PlatformShipperResource>(this.shippersUrl, {params: {userId}})
      .pipe(map(shipper => ({profileId: shipper.id, displayName: shipper.businessName})));
  }

  /**
   * Finds the carrier profile of a user.
   * @param userId - Identifier of the IAM user.
   * @returns Stream with the profile reference.
   */
  getCarrierByUserId(userId: string): Observable<ProfileReference> {
    return this.http.get<PlatformCarrierResource>(this.carriersUrl, {params: {userId}})
      .pipe(map(carrier => ({profileId: carrier.id, displayName: carrier.fullName})));
  }
}
