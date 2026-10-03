import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {LoadRequest} from '../domain/model/load-request.entity';
import {VehicleTypeOption} from '../domain/model/vehicle-type-option';
import {LoadRequestsApiEndpoint} from './load-requests-api-endpoint';
import {VehicleTypeOptionsApiEndpoint} from './vehicle-type-options-api-endpoint';

/**
 * Infrastructure facade for load request and vehicle type catalog operations.
 */
@Injectable({providedIn: 'root'})
export class FreightPublishingApi extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly loadRequestsEndpoint = new LoadRequestsApiEndpoint(this.http);
  private readonly vehicleTypeOptionsEndpoint = new VehicleTypeOptionsApiEndpoint(this.http);

  /**
   * Retrieves the load requests of a shipper.
   * @param shipperId - Shipper identifier.
   * @returns Stream with the shipper's load requests.
   */
  getLoadRequestsByShipper = (shipperId: number): Observable<LoadRequest[]> =>
    this.loadRequestsEndpoint.getAll({shipperId});

  /**
   * Creates (publishes) a load request.
   * @param loadRequest - The load request to create.
   * @returns An Observable of the created LoadRequest.
   */
  createLoadRequest = (loadRequest: LoadRequest): Observable<LoadRequest> =>
    this.loadRequestsEndpoint.create(loadRequest);

  /**
   * Updates an existing load request (edition or cancellation).
   * @param loadRequest - The load request to update.
   * @returns An Observable of the updated LoadRequest.
   */
  updateLoadRequest = (loadRequest: LoadRequest): Observable<LoadRequest> =>
    this.loadRequestsEndpoint.update(loadRequest, loadRequest.id);

  /**
   * Retrieves the vehicle type catalog.
   * @returns Stream with the vehicle type options.
   */
  getVehicleTypes = (): Observable<VehicleTypeOption[]> =>
    this.vehicleTypeOptionsEndpoint.getAll();
}
