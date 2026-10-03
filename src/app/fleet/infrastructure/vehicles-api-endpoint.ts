import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {Vehicle} from '../domain/model/vehicle.entity';
import {VehicleResource, VehiclesResponse} from './vehicles-response';
import {VehicleAssembler} from './vehicle-assembler';

/**
 * Endpoint client for vehicle operations (`/vehicles`).
 */
export class VehiclesApiEndpoint extends BaseApiEndpoint<Vehicle, VehicleResource, VehiclesResponse, VehicleAssembler> {

  /**
   * Creates an instance of VehiclesApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehiclesEndpointPath}`,
      new VehicleAssembler());
  }
}
