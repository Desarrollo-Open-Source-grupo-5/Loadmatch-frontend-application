import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {Shipper} from '../domain/model/shipper.entity';
import {ShipperResource, ShippersResponse} from './shippers-response';
import {ShipperAssembler} from './shipper-assembler';

/**
 * Endpoint client for shipper operations (`/shippers`).
 */
export class ShippersApiEndpoint extends BaseApiEndpoint<Shipper, ShipperResource, ShippersResponse, ShipperAssembler> {

  /**
   * Creates an instance of ShippersApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderShippersEndpointPath}`,
      new ShipperAssembler());
  }
}
