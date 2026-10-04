import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {AvailableLoad} from '../domain/model/available-load';
import {AvailableLoadResource, AvailableLoadsResponse} from './available-loads-response';
import {AvailableLoadAssembler} from './available-load-assembler';

/**
 * Read-only endpoint client that queries published load requests (`/load-requests`).
 */
export class AvailableLoadsApiEndpoint extends BaseApiEndpoint<AvailableLoad, AvailableLoadResource, AvailableLoadsResponse, AvailableLoadAssembler> {

  /**
   * Creates an instance of AvailableLoadsApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderLoadRequestsEndpointPath}`,
      new AvailableLoadAssembler());
  }

  /**
   * Fetches the load requests that are published (searching for a vehicle).
   * @returns Stream with the available loads.
   */
  getPublished(): Observable<AvailableLoad[]> {
    return this.getAll({status: 'PUBLISHED'});
  }
}
