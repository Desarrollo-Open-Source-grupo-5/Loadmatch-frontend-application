import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {TripLoadRequest} from '../domain/model/trip-load-request';
import {TripLoadRequestResource, TripLoadRequestsResponse} from './trip-load-requests-response';
import {TripLoadRequestAssembler} from './trip-load-request-assembler';

/**
 * Read-only endpoint client for the load requests (`/load-requests`, owned by Freight Publishing).
 */
export class TripLoadRequestsApiEndpoint extends BaseApiEndpoint<TripLoadRequest, TripLoadRequestResource, TripLoadRequestsResponse, TripLoadRequestAssembler> {

  /**
   * Creates an instance of TripLoadRequestsApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderLoadRequestsEndpointPath}`,
      new TripLoadRequestAssembler());
  }
}
