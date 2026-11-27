import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {ProfileReference} from '../domain/model/profile-reference';
import {CarrierResource} from './carriers-response';
import {ShipperResource} from './shippers-response';

type ShipperReferenceResource = Pick<ShipperResource, 'id' | 'businessName'>;
type CarrierReferenceResource = Pick<CarrierResource, 'id' | 'firstNames' | 'lastNames'>;

/**
 * Resolves the signed-in user's profile against the LoadMatch Platform by IAM user ID.
 */
export class ProfileReferencesApiEndpoint {
  private readonly shippersUrl = `${environment.platformApiBaseUrl}${environment.platformProviderShippersEndpointPath}`;
  private readonly carriersUrl = `${environment.platformApiBaseUrl}${environment.platformProviderCarriersEndpointPath}`;

  constructor(private readonly http: HttpClient) {}

  getShipperByUserId(userId: string): Observable<ProfileReference> {
    return this.http.get<ShipperReferenceResource>(this.shippersUrl, {params: {userId}}).pipe(
      map(shipper => ({profileId: shipper.id, displayName: shipper.businessName}))
    );
  }

  getCarrierByUserId(userId: string): Observable<ProfileReference> {
    return this.http.get<CarrierReferenceResource>(this.carriersUrl, {params: {userId}}).pipe(
      map(carrier => ({profileId: carrier.id, displayName: `${carrier.firstNames} ${carrier.lastNames}`}))
    );
  }
}
