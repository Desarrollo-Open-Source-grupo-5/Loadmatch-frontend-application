import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {AvailableLoad} from '../domain/model/available-load';
import {CarrierVehicle} from '../domain/model/carrier-vehicle';
import {VehicleTypeReference} from '../domain/model/vehicle-type-reference';
import {AvailableLoadsApiEndpoint} from './available-loads-api-endpoint';
import {CarrierVehiclesApiEndpoint} from './carrier-vehicles-api-endpoint';
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
}
