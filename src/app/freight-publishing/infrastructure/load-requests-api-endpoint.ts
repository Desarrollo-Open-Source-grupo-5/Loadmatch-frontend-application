import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {LoadRequest} from '../domain/model/load-request.entity';
import {LoadRequestResource, LoadRequestsResponse} from './load-requests-response';
import {LoadRequestAssembler} from './load-request-assembler';

/**
 * Endpoint client for load request CRUD operations (`/load-requests`).
 */
export class LoadRequestsApiEndpoint extends BaseApiEndpoint<LoadRequest, LoadRequestResource, LoadRequestsResponse, LoadRequestAssembler> {

  /**
   * Creates an instance of LoadRequestsApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderLoadRequestsEndpointPath}`,
      new LoadRequestAssembler());
  }
}
