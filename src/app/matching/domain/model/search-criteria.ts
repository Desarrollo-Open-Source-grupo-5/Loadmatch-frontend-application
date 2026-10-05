import {Coordinates} from '../../../shared/domain/model/coordinates';
import {PeruLocation} from '../../../shared/domain/model/peru-locations';
import {SortCriteria} from './sort-criteria';

/**
 * Search radius options in kilometres; `null` means any distance.
 */
export const SEARCH_RADIUS_OPTIONS_KM: readonly (number | null)[] = [50, 100, 200, 500, null];

/**
 * Maximum trip distance options in kilometres; `null` means any distance.
 */
export const MAX_TRIP_DISTANCE_OPTIONS_KM: readonly (number | null)[] = [150, 300, 500, 750, null];

/**
 * Minimum cargo weight options in kilograms; `null` means any weight.
 */
export const MIN_WEIGHT_OPTIONS_KG: readonly (number | null)[] = [1000, 5000, 10000, 20000, null];

/**
 * Attributes that can be changed in a {@link SearchCriteria}.
 */
export interface SearchCriteriaChanges {
  /**
   * Catalog location used as the carrier position.
   */
  originLocation?: PeruLocation;
  /**
   * Maximum distance from the carrier to the load origin, or null for any distance.
   */
  radiusKm?: number | null;
  /**
   * Whether only loads compatible with the carrier's vehicle are shown.
   */
  compatibleWithVehicleOnly?: boolean;
  /**
   * Ordering of the results.
   */
  sortBy?: SortCriteria;
  /**
   * Maximum trip distance between origin and destination, or null for any distance.
   */
  maxTripDistanceKm?: number | null;
  /**
   * Required vehicle type, or null for any type.
   */
  vehicleTypeId?: number | null;
  /**
   * Minimum cargo weight in kilograms, or null for any weight.
   */
  minWeightKg?: number | null;
  /**
   * Minimum offered rate in soles, or null for any rate.
   */
  minRateAmount?: number | null;
}

/**
 * Criteria of the available loads search (value object `SearchCriteria` of the Matching context).
 */
export class SearchCriteria {
  /**
   * Default search radius in kilometres.
   */
  static readonly DEFAULT_RADIUS_KM = 100;

  readonly #originLocation: PeruLocation;
  readonly #radiusKm: number | null;
  readonly #compatibleWithVehicleOnly: boolean;
  readonly #sortBy: SortCriteria;
  readonly #maxTripDistanceKm: number | null;
  readonly #vehicleTypeId: number | null;
  readonly #minWeightKg: number | null;
  readonly #minRateAmount: number | null;

  /**
   * Creates search criteria.
   * @param props - Carrier location, radius, compatibility flag, ordering and the optional advanced filters.
   */
  constructor(props: {
    originLocation: PeruLocation;
    radiusKm: number | null;
    compatibleWithVehicleOnly: boolean;
    sortBy: SortCriteria;
    maxTripDistanceKm?: number | null;
    vehicleTypeId?: number | null;
    minWeightKg?: number | null;
    minRateAmount?: number | null;
  }) {
    this.#originLocation = props.originLocation;
    this.#radiusKm = props.radiusKm;
    this.#compatibleWithVehicleOnly = props.compatibleWithVehicleOnly;
    this.#sortBy = props.sortBy;
    this.#maxTripDistanceKm = props.maxTripDistanceKm ?? null;
    this.#vehicleTypeId = props.vehicleTypeId ?? null;
    this.#minWeightKg = props.minWeightKg ?? null;
    this.#minRateAmount = props.minRateAmount ?? null;
  }

  /**
   * Default criteria for a carrier location: 100 km, compatible loads only, most recent first and no advanced
   * filters.
   * @param originLocation - Carrier location.
   * @returns The default criteria.
   */
  static defaultFor(originLocation: PeruLocation): SearchCriteria {
    return new SearchCriteria({
      originLocation,
      radiusKm: SearchCriteria.DEFAULT_RADIUS_KM,
      compatibleWithVehicleOnly: true,
      sortBy: 'MOST_RECENT'
    });
  }

  /**
   * Catalog location used as the carrier position.
   */
  get originLocation(): PeruLocation {
    return this.#originLocation;
  }

  /**
   * Coordinates the search is centred on.
   */
  get origin(): Coordinates {
    return this.#originLocation.coordinates;
  }

  /**
   * Maximum distance to the load origin in kilometres, or null for any distance.
   */
  get radiusKm(): number | null {
    return this.#radiusKm;
  }

  /**
   * Whether only loads compatible with the carrier's vehicle are shown.
   */
  get compatibleWithVehicleOnly(): boolean {
    return this.#compatibleWithVehicleOnly;
  }

  /**
   * Ordering of the results.
   */
  get sortBy(): SortCriteria {
    return this.#sortBy;
  }

  /**
   * Maximum trip distance (origin to destination) in kilometres, or null for any distance.
   */
  get maxTripDistanceKm(): number | null {
    return this.#maxTripDistanceKm;
  }

  /**
   * Required vehicle type, or null for any type.
   */
  get vehicleTypeId(): number | null {
    return this.#vehicleTypeId;
  }

  /**
   * Minimum cargo weight in kilograms, or null for any weight.
   */
  get minWeightKg(): number | null {
    return this.#minWeightKg;
  }

  /**
   * Minimum offered rate in soles, or null for any rate.
   */
  get minRateAmount(): number | null {
    return this.#minRateAmount;
  }

  /**
   * Indicates whether every published load is shown: any radius, compatibility off and no advanced filter.
   * @returns True when no criterion restricts the results.
   */
  showsAllLoads(): boolean {
    return this.#radiusKm === null
      && !this.#compatibleWithVehicleOnly
      && this.#maxTripDistanceKm === null
      && this.#vehicleTypeId === null
      && this.#minWeightKg === null
      && this.#minRateAmount === null;
  }

  /**
   * Returns a copy of these criteria with the given changes applied.
   * @param changes - Attributes to change.
   * @returns New search criteria.
   */
  with(changes: SearchCriteriaChanges): SearchCriteria {
    return new SearchCriteria({
      originLocation: changes.originLocation ?? this.#originLocation,
      radiusKm: changes.radiusKm === undefined ? this.#radiusKm : changes.radiusKm,
      compatibleWithVehicleOnly: changes.compatibleWithVehicleOnly ?? this.#compatibleWithVehicleOnly,
      sortBy: changes.sortBy ?? this.#sortBy,
      maxTripDistanceKm: changes.maxTripDistanceKm === undefined ? this.#maxTripDistanceKm : changes.maxTripDistanceKm,
      vehicleTypeId: changes.vehicleTypeId === undefined ? this.#vehicleTypeId : changes.vehicleTypeId,
      minWeightKg: changes.minWeightKg === undefined ? this.#minWeightKg : changes.minWeightKg,
      minRateAmount: changes.minRateAmount === undefined ? this.#minRateAmount : changes.minRateAmount
    });
  }

  /**
   * Returns a copy that shows every published load again: clears the four advanced filters, widens the radius to any
   * distance and turns the compatibility filter off, keeping the carrier location and the ordering.
   * @returns New search criteria.
   */
  clearFilters(): SearchCriteria {
    return this.with({
      radiusKm: null,
      compatibleWithVehicleOnly: false,
      maxTripDistanceKm: null,
      vehicleTypeId: null,
      minWeightKg: null,
      minRateAmount: null
    });
  }
}
