import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {VehicleTypeOption} from '../domain/model/vehicle-type-option';
import {VehicleTypeOptionResource, VehicleTypeOptionsResponse} from './vehicle-type-options-response';
import {VehicleTypeOptionAssembler} from './vehicle-type-option-assembler';

/**
 * Read-only endpoint client for the vehicle type catalog (`/vehicle-types`) owned by Fleet.
 */
export class VehicleTypeOptionsApiEndpoint extends BaseApiEndpoint<VehicleTypeOption, VehicleTypeOptionResource, VehicleTypeOptionsResponse, VehicleTypeOptionAssembler> {

  /**
   * Creates an instance of VehicleTypeOptionsApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehicleTypesEndpointPath}`,
      new VehicleTypeOptionAssembler());
  }
}
