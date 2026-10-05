import {AvailableLoad} from '../model/available-load';
import {CarrierVehicle} from '../model/carrier-vehicle';
import {SearchCriteria} from '../model/search-criteria';
import {SortCriteria} from '../model/sort-criteria';

/**
 * Domain service that finds the published loads near a carrier.
 */
export class MatchingService {

  /**
   * Computes the distance to the carrier, keeps the loads inside the radius that meet every advanced filter and, when
   * requested, are compatible with the carrier's vehicle, and orders them by the selected criterion.
   * @param loads - Published loads.
   * @param criteria - Search criteria.
   * @param vehicle - Active vehicle of the carrier, or null when the carrier has none.
   * @returns The matching loads, ordered.
   */
  findNearbyLoads(loads: AvailableLoad[], criteria: SearchCriteria, vehicle: CarrierVehicle | null): AvailableLoad[] {
    const radiusKm = criteria.radiusKm;
    const compatibleVehicle = criteria.compatibleWithVehicleOnly ? vehicle : null;
    const nearbyLoads = loads
      .map(load => load.withDistanceTo(criteria.origin))
      .filter(load => radiusKm === null || (load.distanceToCarrierKm ?? 0) <= radiusKm)
      .filter(load => !compatibleVehicle || compatibleVehicle.canTransport(load))
      .filter(load => this.meetsAdvancedFilters(load, criteria, compatibleVehicle !== null));
    return this.sort(nearbyLoads, criteria.sortBy);
  }

  /**
   * Checks that a load meets every advanced filter that is set.
   * @param load - Load to check.
   * @param criteria - Search criteria.
   * @param vehicleTypeFixed - True while the compatibility filter applies; the vehicle type is then the type of the
   *   carrier's vehicle and the vehicle type filter is ignored.
   * @returns True when the load meets the trip distance, vehicle type, weight and rate filters.
   */
  private meetsAdvancedFilters(load: AvailableLoad, criteria: SearchCriteria, vehicleTypeFixed: boolean): boolean {
    const {maxTripDistanceKm, vehicleTypeId, minWeightKg, minRateAmount} = criteria;
    return (maxTripDistanceKm === null || load.distanceKm <= maxTripDistanceKm)
      && (vehicleTypeFixed || vehicleTypeId === null || load.vehicleTypeId === vehicleTypeId)
      && (minWeightKg === null || load.weightKg >= minWeightKg)
      && (minRateAmount === null || load.offeredRate.amount >= minRateAmount);
  }

  /**
   * Orders loads by the given criterion, using the identifier as a stable tie-breaker.
   * @param loads - Loads to order.
   * @param sortBy - Ordering criterion.
   * @returns A new ordered array.
   */
  private sort(loads: AvailableLoad[], sortBy: SortCriteria): AvailableLoad[] {
    const byCriterion = (a: AvailableLoad, b: AvailableLoad): number => {
      switch (sortBy) {
        case 'HIGHEST_RATE':
          return b.offeredRate.amount - a.offeredRate.amount;
        case 'SHORTEST_DISTANCE':
          return (a.distanceToCarrierKm ?? 0) - (b.distanceToCarrierKm ?? 0);
        case 'MOST_RECENT':
          return (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0);
      }
    };
    return [...loads].sort((a, b) => byCriterion(a, b) || a.id - b.id);
  }
}
