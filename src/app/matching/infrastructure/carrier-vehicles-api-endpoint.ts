import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {CarrierVehicle} from '../domain/model/carrier-vehicle';
import {CarrierVehicleResource, CarrierVehiclesResponse} from './carrier-vehicles-response';
import {CarrierVehicleAssembler} from './carrier-vehicle-assembler';

/**
 * Read-only endpoint client for the carriers' vehicles (`/vehicles`, owned by Fleet).
 */
export class CarrierVehiclesApiEndpoint extends BaseApiEndpoint<CarrierVehicle, CarrierVehicleResource, CarrierVehiclesResponse, CarrierVehicleAssembler> {

  /**
   * Creates an instance of CarrierVehiclesApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehiclesEndpointPath}`,
      new CarrierVehicleAssembler());
  }
}
