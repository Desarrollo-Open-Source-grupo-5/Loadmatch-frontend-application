import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {Shipper} from '../domain/model/shipper.entity';
import {Carrier} from '../domain/model/carrier.entity';
import {ShippersApiEndpoint} from './shippers-api-endpoint';
import {CarriersApiEndpoint} from './carriers-api-endpoint';
import {ProfileReferencesApiEndpoint} from './profile-references-api-endpoint';
import {ProfileReference} from '../domain/model/profile-reference';

/**
 * Infrastructure facade for shipper and carrier endpoint operations.
 */
@Injectable({providedIn: 'root'})
export class ProfilesApi extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly shippersEndpoint = new ShippersApiEndpoint(this.http);
  private readonly carriersEndpoint = new CarriersApiEndpoint(this.http);
  private readonly profileReferencesEndpoint = new ProfileReferencesApiEndpoint(this.http);

  /**
   * Retrieves all shippers.
   * @returns Stream with the shipper collection.
   */
  getShippers = (): Observable<Shipper[]> =>
    this.shippersEndpoint.getAll();

  /**
   * Retrieves all carriers.
   * @returns Stream with the carrier collection.
   */
  getCarriers = (): Observable<Carrier[]> =>
    this.carriersEndpoint.getAll();

  /**
   * Finds the profile (shipper or carrier) that belongs to a signed-in user in the LoadMatch Platform.
   * @param userId - Identifier of the IAM user.
   * @param role - Role of the user.
   * @returns Stream with the profile reference.
   */
  getProfileReferenceByUserId = (userId: string, role: 'SHIPPER' | 'CARRIER'): Observable<ProfileReference> =>
    role === 'SHIPPER'
      ? this.profileReferencesEndpoint.getShipperByUserId(userId)
      : this.profileReferencesEndpoint.getCarrierByUserId(userId);
}
