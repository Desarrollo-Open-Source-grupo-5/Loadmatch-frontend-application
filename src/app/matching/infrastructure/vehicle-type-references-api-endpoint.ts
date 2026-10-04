import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {VehicleTypeReference} from '../domain/model/vehicle-type-reference';
import {VehicleTypeReferenceResource, VehicleTypeReferencesResponse} from './vehicle-type-references-response';
import {VehicleTypeReferenceAssembler} from './vehicle-type-reference-assembler';

/**
 * Read-only endpoint client for the vehicle type catalog (`/vehicle-types`, owned by Fleet).
 */
export class VehicleTypeReferencesApiEndpoint extends BaseApiEndpoint<VehicleTypeReference, VehicleTypeReferenceResource, VehicleTypeReferencesResponse, VehicleTypeReferenceAssembler> {

  /**
   * Creates an instance of VehicleTypeReferencesApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderVehicleTypesEndpointPath}`,
      new VehicleTypeReferenceAssembler());
  }
}
