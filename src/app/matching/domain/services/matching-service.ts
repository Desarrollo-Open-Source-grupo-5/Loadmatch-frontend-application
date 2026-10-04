import {AvailableLoad} from '../model/available-load';
import {CarrierVehicle} from '../model/carrier-vehicle';
import {SearchCriteria} from '../model/search-criteria';
import {SortCriteria} from '../model/sort-criteria';

/**
 * Domain service that finds the published loads near a carrier.
 */
export class MatchingService {

  /**
   * Computes the distance to the carrier, keeps the loads inside the radius (and, when requested, compatible with the
   * carrier's vehicle) and orders them by the selected criterion.
   * @param loads - Published loads.
   * @param criteria - Search criteria.
   * @param vehicle - Active vehicle of the carrier, or null when the carrier has none.
   * @returns The matching loads, ordered.
   */
  findNearbyLoads(loads: AvailableLoad[], criteria: SearchCriteria, vehicle: CarrierVehicle | null): AvailableLoad[] {
    const radiusKm = criteria.radiusKm;
    const nearbyLoads = loads
      .map(load => load.withDistanceTo(criteria.origin))
      .filter(load => radiusKm === null || (load.distanceToCarrierKm ?? 0) <= radiusKm)
      .filter(load => !criteria.compatibleWithVehicleOnly || !vehicle || vehicle.canTransport(load));
    return this.sort(nearbyLoads, criteria.sortBy);
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
