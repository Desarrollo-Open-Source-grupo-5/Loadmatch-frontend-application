import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, map, Observable, of, switchMap} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {TripLoadRequest} from '../domain/model/trip-load-request';
import {TripOverview} from '../domain/model/trip-overview';
import {TripCarriersApiEndpoint} from './trip-carriers-api-endpoint';
import {TripLoadRequestsApiEndpoint} from './trip-load-requests-api-endpoint';
import {TripShippersApiEndpoint} from './trip-shippers-api-endpoint';
import {TripVehiclesApiEndpoint} from './trip-vehicles-api-endpoint';
import {TripVehicleTypesApiEndpoint} from './trip-vehicle-types-api-endpoint';
import {TripsApiEndpoint} from './trips-api-endpoint';

/**
 * Infrastructure facade for the Trip Execution context: the trips of a carrier and the trip of a load request tracked
 * by its shipper.
 */
@Injectable({providedIn: 'root'})
export class TripExecutionApi extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly tripsEndpoint = new TripsApiEndpoint(this.http);
  private readonly loadRequestsEndpoint = new TripLoadRequestsApiEndpoint(this.http);
  private readonly shippersEndpoint = new TripShippersApiEndpoint(this.http);
  private readonly carriersEndpoint = new TripCarriersApiEndpoint(this.http);
  private readonly vehiclesEndpoint = new TripVehiclesApiEndpoint(this.http);
  private readonly vehicleTypesEndpoint = new TripVehicleTypesApiEndpoint(this.http);

  /**
   * Retrieves the trips of a carrier with their route, rate, shipper and vehicle.
   * @param carrierId - Carrier identifier.
   * @returns Stream with the carrier's trips; a trip whose load request is missing is left out.
   */
  getCarrierTrips = (carrierId: number): Observable<TripOverview[]> =>
    this.tripsEndpoint.getByCarrierId(carrierId).pipe(
      switchMap(trips => {
        if (!trips.length) {
          return of([]);
        }
        return forkJoin({
          loadRequests: this.loadRequestsEndpoint.getAll({id: [...new Set(trips.map(trip => trip.loadRequestId))]}),
          shippers: this.shippersEndpoint.getAll({id: [...new Set(trips.map(trip => trip.shipperId))]}),
          vehicles: this.vehiclesEndpoint.getAll({carrierId}),
          vehicleTypes: this.vehicleTypesEndpoint.getAll()
        }).pipe(
          map(({loadRequests, shippers, vehicles, vehicleTypes}) => trips.flatMap(trip => {
            const loadRequest = loadRequests.find(candidate => candidate.id === trip.loadRequestId);
            if (!loadRequest) {
              return [];
            }
            const vehicle = vehicles.find(candidate => candidate.id === trip.vehicleId);
            return [TripOverview.from(trip, loadRequest, {
              shipper: shippers.find(candidate => candidate.id === trip.shipperId),
              vehicle,
              vehicleTypeName: vehicleTypes.find(vehicleType => vehicleType.id === vehicle?.vehicleTypeId)?.name
            })];
          }))
        );
      })
    );

  /**
   * Retrieves a load request, whatever its status, so the caller can check who owns it.
   * @param id - Load request identifier.
   * @returns Stream with the load request projection.
   */
  getLoadRequest = (id: number): Observable<TripLoadRequest> =>
    this.loadRequestsEndpoint.getById(id);

  /**
   * Retrieves the current (not cancelled) trip of a load request with its carrier and vehicle.
   * @param loadRequest - Load request read with {@link getLoadRequest}.
   * @returns Stream with the trip overview, or null when no carrier accepted the load request yet.
   */
  getActiveTripOfLoadRequest = (loadRequest: TripLoadRequest): Observable<TripOverview | null> =>
    this.tripsEndpoint.getByLoadRequestId(loadRequest.id).pipe(
      switchMap(trips => {
        const trip = trips.find(candidate => candidate.loadRequestId === loadRequest.id && !candidate.isCancelled());
        if (!trip) {
          return of(null);
        }
        return forkJoin({
          carrier: this.carriersEndpoint.getById(trip.carrierId),
          vehicle: this.vehiclesEndpoint.getById(trip.vehicleId),
          vehicleTypes: this.vehicleTypesEndpoint.getAll()
        }).pipe(
          map(({carrier, vehicle, vehicleTypes}) => TripOverview.from(trip, loadRequest, {
            carrier,
            vehicle,
            vehicleTypeName: vehicleTypes.find(vehicleType => vehicleType.id === vehicle.vehicleTypeId)?.name
          }))
        );
      })
    );
}
