import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {AssignedVehicle} from '../domain/model/assigned-vehicle';
import {AssignedVehicleResource, AssignedVehiclesResponse} from './assigned-vehicles-response';
import {AssignedVehicleAssembler} from './assigned-vehicle-assembler';

/**
 * Read-only endpoint client for the carriers' vehicles (`/vehicles`) owned by Fleet.
 */
export class AssignedVehiclesApiEndpoint extends BaseApiEndpoint<AssignedVehicle, AssignedVehicleResource, AssignedVehiclesResponse, AssignedVehicleAssembler> {

  /**
   * Creates an instance of AssignedVehiclesApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehiclesEndpointPath}`,
      new AssignedVehicleAssembler());
  }
}
