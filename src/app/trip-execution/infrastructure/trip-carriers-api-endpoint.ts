import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {TripCarrier} from '../domain/model/trip-carrier';
import {TripCarrierResource, TripCarriersResponse} from './trip-carriers-response';
import {TripCarrierAssembler} from './trip-carrier-assembler';

/**
 * Read-only endpoint client for the carriers (`/carriers`, owned by Profiles).
 */
export class TripCarriersApiEndpoint extends BaseApiEndpoint<TripCarrier, TripCarrierResource, TripCarriersResponse, TripCarrierAssembler> {

  /**
   * Creates an instance of TripCarriersApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderCarriersEndpointPath}`,
      new TripCarrierAssembler());
  }
}
