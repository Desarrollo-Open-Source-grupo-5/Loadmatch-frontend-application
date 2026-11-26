import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, forkJoin, map, Observable, of, switchMap, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {isPlatformId} from '../domain/model/platform-id';
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
  private readonly provider = this.endpoints(environment.platformProviderApiBaseUrl);
  private readonly platform = this.endpoints(environment.platformApiBaseUrl);

  /**
   * Retrieves the trips of a carrier with their route, rate, shipper and vehicle.
   * @param carrierId - Carrier identifier.
   * @returns Stream with the carrier's trips; a trip whose load request is missing is left out.
   */
  getCarrierTrips = (carrierId: string): Observable<TripOverview[]> => {
    const usesPlatform = isPlatformId(carrierId);
    const source = usesPlatform ? this.platform : this.provider;
    return source.trips.getByCarrierId(carrierId).pipe(
      switchMap(trips => {
        if (!trips.length) {
          return of([]);
        }
        const loadRequestIds = [...new Set(trips.map(trip => trip.loadRequestId))];
        const shipperIds = [...new Set(trips.map(trip => trip.shipperId))];

        return forkJoin({
          loadRequests: usesPlatform
            ? forkJoin(loadRequestIds.map(id => this.ignoreMissing(source.loadRequests.getById(id))))
            : source.loadRequests.getAll({id: loadRequestIds}),
          shippers: usesPlatform
            ? forkJoin(shipperIds.map(id => this.ignoreMissing(source.shippers.getById(id))))
            : source.shippers.getAll({id: shipperIds}),
          vehicles: source.vehicles.getAll({carrierId}),
          vehicleTypes: source.vehicleTypes.getAll()
        }).pipe(
          map(({loadRequests, shippers, vehicles, vehicleTypes}) => trips.flatMap(trip => {
            const loadRequest = loadRequests.find(candidate => candidate?.id === trip.loadRequestId);
            if (!loadRequest) {
              return [];
            }
            const vehicle = vehicles.find(candidate => candidate.id === trip.vehicleId);
            return [TripOverview.from(trip, loadRequest, {
              shipper: shippers.find(candidate => candidate?.id === trip.shipperId) ?? undefined,
              vehicle,
              vehicleTypeName: vehicleTypes.find(vehicleType => vehicleType.id === vehicle?.vehicleTypeId)?.name
            })];
          }))
        );
      })
    );
  };

  /**
   * Retrieves a load request, whatever its status, so the caller can check who owns it.
   * @param id - Load request identifier.
   * @returns Stream with the load request projection.
   */
  getLoadRequest = (id: string): Observable<TripLoadRequest> =>
    (isPlatformId(id) ? this.platform : this.provider).loadRequests.getById(id);

  /**
   * Retrieves the current (not cancelled) trip of a load request with its carrier and vehicle.
   * @param loadRequest - Load request read with {@link getLoadRequest}.
   * @returns Stream with the trip overview, or null when no carrier accepted the load request yet.
   */
  getActiveTripOfLoadRequest = (loadRequest: TripLoadRequest): Observable<TripOverview | null> => {
    const usesPlatform = isPlatformId(loadRequest.id);
    const source = usesPlatform ? this.platform : this.provider;
    const trips = usesPlatform
      ? source.trips.getAll({shipperId: loadRequest.shipperId})
      : source.trips.getByLoadRequestId(loadRequest.id);

    return trips.pipe(
      switchMap(trips => {
        const trip = trips.find(candidate => candidate.loadRequestId === loadRequest.id && !candidate.isCancelled());
        if (!trip) {
          return of(null);
        }
        return forkJoin({
          carrier: this.ignoreMissing(source.carriers.getById(trip.carrierId)),
          vehicle: this.ignoreMissing(source.vehicles.getById(trip.vehicleId)),
          vehicleTypes: source.vehicleTypes.getAll()
        }).pipe(
          map(({carrier, vehicle, vehicleTypes}) => TripOverview.from(trip, loadRequest, {
            carrier: carrier ?? undefined,
            vehicle: vehicle ?? undefined,
            vehicleTypeName: vehicleTypes.find(vehicleType => vehicleType.id === vehicle?.vehicleTypeId)?.name
          }))
        );
      })
    );
  };

  private endpoints(baseUrl: string) {
    return {
      trips: new TripsApiEndpoint(this.http, baseUrl),
      loadRequests: new TripLoadRequestsApiEndpoint(this.http, baseUrl),
      shippers: new TripShippersApiEndpoint(this.http, baseUrl),
      carriers: new TripCarriersApiEndpoint(this.http, baseUrl),
      vehicles: new TripVehiclesApiEndpoint(this.http, baseUrl),
      vehicleTypes: new TripVehicleTypesApiEndpoint(this.http, baseUrl)
    };
  }

  private ignoreMissing<T>(request: Observable<T>): Observable<T | null> {
    return request.pipe(
      catchError((error: unknown) =>
        error instanceof Error && error.message.endsWith('Resource not found')
          ? of(null)
          : throwError(() => error))
    );
  }
}
