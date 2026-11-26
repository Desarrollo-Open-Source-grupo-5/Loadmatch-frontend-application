import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {Shipper} from '../domain/model/shipper.entity';
import {Carrier} from '../domain/model/carrier.entity';
import {ShippersApiEndpoint} from './shippers-api-endpoint';
import {CarriersApiEndpoint} from './carriers-api-endpoint';
import {ProfileReferencesApiEndpoint} from './profile-references-api-endpoint';
import {ProfileReference} from '../domain/model/profile-reference';
import {RegisterShipperRequest} from './register-shipper-request';
import {RegisterCarrierRequest} from './register-carrier-request';
import {RegisterVehicleRequest} from './register-vehicle-request';
import {ShipperResource} from './shippers-response';
import {CarrierResource} from './carriers-response';

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

  /**
   * Registers a new shipper account and business profile.
   * @param request - Shipper registration payload.
   * @returns Stream with the created shipper resource.
   */
  registerShipper = (request: RegisterShipperRequest): Observable<ShipperResource> =>
    this.http.post<ShipperResource>(
      `${environment.platformApiBaseUrl}${environment.platformProviderShippersEndpointPath}`,
      request
    );

  /**
   * Registers a new carrier account and driver profile.
   * @param request - Carrier registration payload.
   * @returns Stream with the created carrier resource.
   */
  registerCarrier = (request: RegisterCarrierRequest): Observable<CarrierResource> =>
    this.http.post<CarrierResource>(
      `${environment.platformApiBaseUrl}${environment.platformProviderCarriersEndpointPath}`,
      request
    );

  /**
   * Registers a vehicle for a carrier.
   * @param request - Vehicle registration payload.
   * @returns Stream with the created vehicle response.
   */
  registerVehicle = (request: RegisterVehicleRequest): Observable<unknown> =>
    this.http.post(
      `${environment.platformApiBaseUrl}${environment.platformProviderVehiclesEndpointPath}`,
      request
    );
}
