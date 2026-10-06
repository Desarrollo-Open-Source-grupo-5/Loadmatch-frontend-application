import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {Carrier} from '../domain/model/carrier.entity';
import {CarrierResource, CarriersResponse} from './carriers-response';
import {CarrierAssembler} from './carrier-assembler';

/**
 * Endpoint client for carrier operations (`/carriers`).
 */
export class CarriersApiEndpoint extends BaseApiEndpoint<Carrier, CarrierResource, CarriersResponse, CarrierAssembler> {

  /**
   * Creates an instance of CarriersApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderCarriersEndpointPath}`,
      new CarrierAssembler());
  }
}
