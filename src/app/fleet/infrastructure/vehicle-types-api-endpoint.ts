import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {VehicleType} from '../domain/model/vehicle-type.entity';
import {VehicleTypeResource, VehicleTypesResponse} from './vehicle-types-response';
import {VehicleTypeAssembler} from './vehicle-type-assembler';

/**
 * Endpoint client for vehicle type operations (`/vehicle-types`).
 */
export class VehicleTypesApiEndpoint extends BaseApiEndpoint<VehicleType, VehicleTypeResource, VehicleTypesResponse, VehicleTypeAssembler> {

  /**
   * Creates an instance of VehicleTypesApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehicleTypesEndpointPath}`,
      new VehicleTypeAssembler());
  }
}
