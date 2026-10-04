import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, map, Observable, of, switchMap} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {AssignedCarrier} from '../domain/model/assigned-carrier';
import {LoadRequest} from '../domain/model/load-request.entity';
import {VehicleTypeOption} from '../domain/model/vehicle-type-option';
import {AssignedVehiclesApiEndpoint} from './assigned-vehicles-api-endpoint';
import {CarrierContactsApiEndpoint} from './carrier-contacts-api-endpoint';
import {LoadRequestsApiEndpoint} from './load-requests-api-endpoint';
import {TripAssignmentsApiEndpoint} from './trip-assignments-api-endpoint';
import {VehicleTypeOptionsApiEndpoint} from './vehicle-type-options-api-endpoint';

/**
 * Infrastructure facade for load request and vehicle type catalog operations, and for the read-only queries that
 * compose the carrier assigned to a load request.
 */
@Injectable({providedIn: 'root'})
export class FreightPublishingApi extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly loadRequestsEndpoint = new LoadRequestsApiEndpoint(this.http);
  private readonly vehicleTypeOptionsEndpoint = new VehicleTypeOptionsApiEndpoint(this.http);
  private readonly tripAssignmentsEndpoint = new TripAssignmentsApiEndpoint(this.http);
  private readonly carrierContactsEndpoint = new CarrierContactsApiEndpoint(this.http);
  private readonly assignedVehiclesEndpoint = new AssignedVehiclesApiEndpoint(this.http);

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

  /**
   * Retrieves the carrier and vehicle that accepted a load request.
   * @param loadRequestId - Load request identifier.
   * @returns Stream with the assigned carrier, or null when no trip exists for the request.
   */
  getAssignedCarrier = (loadRequestId: number): Observable<AssignedCarrier | null> =>
    this.tripAssignmentsEndpoint.getByLoadRequestId(loadRequestId).pipe(
      switchMap(trips => {
        const trip = trips.find(candidate => candidate.loadRequestId === loadRequestId);
        if (!trip) {
          return of(null);
        }
        return forkJoin({
          carrier: this.carrierContactsEndpoint.getById(trip.carrierId),
          vehicle: this.assignedVehiclesEndpoint.getById(trip.vehicleId),
          vehicleTypes: this.vehicleTypeOptionsEndpoint.getAll()
        }).pipe(
          map(({carrier, vehicle, vehicleTypes}) => AssignedCarrier.from(
            carrier,
            vehicle,
            vehicleTypes.find(vehicleType => vehicleType.id === vehicle.vehicleTypeId)?.name ?? ''
          ))
        );
      })
    );
}
