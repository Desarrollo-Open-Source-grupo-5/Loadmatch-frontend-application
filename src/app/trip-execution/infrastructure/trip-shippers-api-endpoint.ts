import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {TripShipper} from '../domain/model/trip-shipper';
import {TripShipperResource, TripShippersResponse} from './trip-shippers-response';
import {TripShipperAssembler} from './trip-shipper-assembler';

/**
 * Read-only endpoint client for the shippers (`/shippers`, owned by Profiles).
 */
export class TripShippersApiEndpoint extends BaseApiEndpoint<TripShipper, TripShipperResource, TripShippersResponse, TripShipperAssembler> {

  /**
   * Creates an instance of TripShippersApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderShippersEndpointPath}`,
      new TripShipperAssembler());
  }
}
