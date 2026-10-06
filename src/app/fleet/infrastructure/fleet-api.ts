import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseApi} from '../../shared/infrastructure/base-api';
import {VehicleType} from '../domain/model/vehicle-type.entity';
import {Vehicle} from '../domain/model/vehicle.entity';
import {VehicleTypesApiEndpoint} from './vehicle-types-api-endpoint';
import {VehiclesApiEndpoint} from './vehicles-api-endpoint';

/**
 * Infrastructure facade for the Fleet context (vehicle type catalog and carrier vehicles).
 */
@Injectable({providedIn: 'root'})
export class FleetApi extends BaseApi {
  private readonly http = inject(HttpClient);
  private readonly vehicleTypesEndpoint = new VehicleTypesApiEndpoint(this.http);
  private readonly vehiclesEndpoint = new VehiclesApiEndpoint(this.http);

  /**
   * Retrieves the vehicle type catalog.
   * @returns Stream with the vehicle type collection.
   */
  getVehicleTypes = (): Observable<VehicleType[]> =>
    this.vehicleTypesEndpoint.getAll();

  /**
   * Retrieves the vehicles registered by a carrier.
   * @param carrierId - Carrier identifier.
   * @returns Stream with the carrier's vehicles.
   */
  getVehiclesByCarrier = (carrierId: number): Observable<Vehicle[]> =>
    this.vehiclesEndpoint.getAll({carrierId});
}
