import {Coordinates} from '../../../shared/domain/model/coordinates';
import {PeruLocation} from '../../../shared/domain/model/peru-locations';
import {SortCriteria} from './sort-criteria';

/**
 * Search radius options in kilometres; `null` means any distance.
 */
export const SEARCH_RADIUS_OPTIONS_KM: readonly (number | null)[] = [50, 100, 200, 500, null];

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

  /**
   * Creates search criteria.
   * @param props - Carrier location, radius, compatibility flag and ordering.
   */
  constructor(props: {
    originLocation: PeruLocation;
    radiusKm: number | null;
    compatibleWithVehicleOnly: boolean;
    sortBy: SortCriteria;
  }) {
    this.#originLocation = props.originLocation;
    this.#radiusKm = props.radiusKm;
    this.#compatibleWithVehicleOnly = props.compatibleWithVehicleOnly;
    this.#sortBy = props.sortBy;
  }

  /**
   * Default criteria for a carrier location: 100 km, compatible loads only, most recent first.
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
   * Returns a copy of these criteria with the given changes applied.
   * @param changes - Attributes to change.
   * @returns New search criteria.
   */
  with(changes: SearchCriteriaChanges): SearchCriteria {
    return new SearchCriteria({
      originLocation: changes.originLocation ?? this.#originLocation,
      radiusKm: changes.radiusKm === undefined ? this.#radiusKm : changes.radiusKm,
      compatibleWithVehicleOnly: changes.compatibleWithVehicleOnly ?? this.#compatibleWithVehicleOnly,
      sortBy: changes.sortBy ?? this.#sortBy
    });
  }
}
