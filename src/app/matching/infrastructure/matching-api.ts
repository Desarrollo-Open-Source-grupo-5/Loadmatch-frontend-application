import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {forkJoin, map, Observable} from 'rxjs';
import {Coordinates} from '../../shared/domain/model/coordinates';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {AvailableLoad} from '../domain/model/available-load';
import {CarrierVehicle} from '../domain/model/carrier-vehicle';
import {LoadDetail} from '../domain/model/load-detail';
import {VehicleTypeReference} from '../domain/model/vehicle-type-reference';
import {AvailableLoadsApiEndpoint} from './available-loads-api-endpoint';
import {CarrierVehiclesApiEndpoint} from './carrier-vehicles-api-endpoint';
import {ShipperReferencesApiEndpoint} from './shipper-references-api-endpoint';
import {VehicleTypeReferencesApiEndpoint} from './vehicle-type-references-api-endpoint';

/**
 * Infrastructure facade for the Matching context.
 */
@Injectable({providedIn: 'root'})
export class MatchingApi extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly availableLoadsEndpoint = new AvailableLoadsApiEndpoint(this.http);
  private readonly carrierVehiclesEndpoint = new CarrierVehiclesApiEndpoint(this.http);
  private readonly vehicleTypeReferencesEndpoint = new VehicleTypeReferencesApiEndpoint(this.http);
  private readonly shipperReferencesEndpoint = new ShipperReferencesApiEndpoint(this.http);

  /**
   * Retrieves the published load requests as available loads.
   * @returns Stream with the available loads.
   */
  getAvailableLoads = (): Observable<AvailableLoad[]> =>
    this.availableLoadsEndpoint.getPublished();

  /**
   * Retrieves the vehicles of a carrier.
   * @param carrierId - Carrier identifier.
   * @returns Stream with the carrier's vehicles.
   */
  getCarrierVehicles = (carrierId: number): Observable<CarrierVehicle[]> =>
    this.carrierVehiclesEndpoint.getAll({carrierId});

  /**
   * Retrieves the vehicle type catalog.
   * @returns Stream with the vehicle type references.
   */
  getVehicleTypes = (): Observable<VehicleTypeReference[]> =>
    this.vehicleTypeReferencesEndpoint.getAll();

  /**
   * Retrieves a load request fresh from the API, whatever its status, so the caller can check it is still available.
   * @param id - Load request identifier.
   * @returns Stream with the load.
   */
  getLoadById = (id: number): Observable<AvailableLoad> =>
    this.availableLoadsEndpoint.getById(id);

  /**
   * Composes the detail of a load with its shipper (`/shippers`) and the name of the required vehicle type
   * (`/vehicle-types`).
   * @param load - Load read with {@link getLoadById}.
   * @param carrierLocation - Location selected by the carrier, or null when unknown.
   * @returns Stream with the load detail.
   */
  getLoadDetail = (load: AvailableLoad, carrierLocation: Coordinates | null): Observable<LoadDetail> =>
    forkJoin({
      shipper: this.shipperReferencesEndpoint.getById(load.shipperId),
      vehicleType: this.vehicleTypeReferencesEndpoint.getById(load.vehicleTypeId)
    }).pipe(
      map(({shipper, vehicleType}) => LoadDetail.from(load, shipper, vehicleType.name, carrierLocation))
    );
}
