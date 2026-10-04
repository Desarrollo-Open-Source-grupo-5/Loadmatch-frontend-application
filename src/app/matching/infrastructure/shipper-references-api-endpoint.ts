import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {ShipperReference} from '../domain/model/shipper-reference';
import {ShipperReferenceResource, ShipperReferencesResponse} from './shipper-references-response';
import {ShipperReferenceAssembler} from './shipper-reference-assembler';

/**
 * Read-only endpoint client for the shippers (`/shippers`, owned by Profiles).
 */
export class ShipperReferencesApiEndpoint extends BaseApiEndpoint<ShipperReference, ShipperReferenceResource, ShipperReferencesResponse, ShipperReferenceAssembler> {

  /**
   * Creates an instance of ShipperReferencesApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderShippersEndpointPath}`,
      new ShipperReferenceAssembler());
  }
}
