import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {TripVehicle} from '../domain/model/trip-vehicle';
import {TripVehicleResource, TripVehiclesResponse} from './trip-vehicles-response';
import {TripVehicleAssembler} from './trip-vehicle-assembler';

/**
 * Read-only endpoint client for the vehicles (`/vehicles`, owned by Fleet).
 */
export class TripVehiclesApiEndpoint extends BaseApiEndpoint<TripVehicle, TripVehicleResource, TripVehiclesResponse, TripVehicleAssembler> {

  /**
   * Creates an instance of TripVehiclesApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehiclesEndpointPath}`,
      new TripVehicleAssembler());
  }
}
