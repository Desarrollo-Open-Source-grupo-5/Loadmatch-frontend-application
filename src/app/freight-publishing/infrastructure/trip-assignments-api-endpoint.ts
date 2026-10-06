import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApiEndpoint} from '../../shared/infrastructure/base-api-endpoint';
import {environment} from '../../../environments/environment';
import {TripAssignment} from '../domain/model/trip-assignment';
import {TripAssignmentResource, TripAssignmentsResponse} from './trip-assignments-response';
import {TripAssignmentAssembler} from './trip-assignment-assembler';

/**
 * Read-only endpoint client for the trips (`/trips`) owned by Trip Execution.
 */
export class TripAssignmentsApiEndpoint extends BaseApiEndpoint<TripAssignment, TripAssignmentResource, TripAssignmentsResponse, TripAssignmentAssembler> {

  /**
   * Creates an instance of TripAssignmentsApiEndpoint
   * @param http - The HttpClient to be used for making API requests
   */
  constructor(http: HttpClient) {
    super(http, `${environment.platformProviderApiBaseUrl}${environment.platformProviderTripsEndpointPath}`,
      new TripAssignmentAssembler());
  }

  /**
   * Fetches the trips that originate from a load request (at most one while it is not cancelled).
   * @param loadRequestId - Load request identifier.
   * @returns Stream with the matching trip assignments.
   */
  getByLoadRequestId(loadRequestId: number): Observable<TripAssignment[]> {
    return this.getAll({loadRequestId});
  }
}
