import {HttpClient} from '@angular/common/http';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {CarrierContact} from '../domain/model/carrier-contact';
import {CarrierContactResource, CarrierContactsResponse} from './carrier-contacts-response';
import {CarrierContactAssembler} from './carrier-contact-assembler';

/**
 * Read-only endpoint client for the carriers (`/carriers`) owned by Profiles.
 */
export class CarrierContactsApiEndpoint extends BaseApiEndpoint<CarrierContact, CarrierContactResource, CarrierContactsResponse, CarrierContactAssembler> {

  /**
   * Creates an instance of CarrierContactsApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderCarriersEndpointPath}`,
      new CarrierContactAssembler());
  }
}
