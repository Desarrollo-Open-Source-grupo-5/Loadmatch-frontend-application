import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {Trip} from '../domain/model/trip.entity';
import {TripResource, TripsResponse} from './trips-response';
import {TripAssembler} from './trip-assembler';

/**
 * Endpoint client for the trips (`/trips`) of the Trip Execution context.
 */
export class TripsApiEndpoint extends BaseApiEndpoint<Trip, TripResource, TripsResponse, TripAssembler> {

  /**
   * Creates an instance of TripsApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderTripsEndpointPath}`,
      new TripAssembler());
  }

  /**
   * Fetches the trips of a carrier.
   * @param carrierId - Carrier identifier.
   * @returns Stream with the carrier's trips.
   */
  getByCarrierId(carrierId: number): Observable<Trip[]> {
    return this.getAll({carrierId});
  }

  /**
   * Fetches the trips that originate from a load request (a cancelled one and the current one at most).
   * @param loadRequestId - Load request identifier.
   * @returns Stream with the matching trips.
   */
  getByLoadRequestId(loadRequestId: number): Observable<Trip[]> {
    return this.getAll({loadRequestId});
  }
}
