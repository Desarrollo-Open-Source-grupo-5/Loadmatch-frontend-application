import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {TripVehicleType} from '../domain/model/trip-vehicle-type';
import {TripVehicleTypeResource, TripVehicleTypesResponse} from './trip-vehicle-types-response';
import {TripVehicleTypeAssembler} from './trip-vehicle-type-assembler';

/**
 * Read-only endpoint client for the vehicle type catalog (`/vehicle-types`, owned by Fleet).
 */
export class TripVehicleTypesApiEndpoint extends BaseApiEndpoint<TripVehicleType, TripVehicleTypeResource, TripVehicleTypesResponse, TripVehicleTypeAssembler> {

  /**
   * Creates an instance of TripVehicleTypesApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehicleTypesEndpointPath}`,
      new TripVehicleTypeAssembler());
  }
}
