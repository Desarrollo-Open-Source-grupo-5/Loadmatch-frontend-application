import {Component, computed, inject, signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {TranslatePipe} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {findLocationByCode, PERU_LOCATIONS} from '../../../../shared/domain/model/peru-locations';
import {ProfileRequired} from '../../../../shared/presentation/components/profile-required/profile-required';
import {LocalizedNumberPipe} from '../../../../shared/presentation/pipes/localized-number.pipe';
import {MatchingStore} from '../../../application/matching.store';
import {
  MAX_TRIP_DISTANCE_OPTIONS_KM,
  MIN_WEIGHT_OPTIONS_KG,
  SEARCH_RADIUS_OPTIONS_KM
} from '../../../domain/model/search-criteria';
import {SORT_CRITERIA, SortCriteria} from '../../../domain/model/sort-criteria';
import {AvailableLoadCard} from '../../components/available-load-card/available-load-card';

/**
 * "Find Loads": published loads near the carrier, compatible with the carrier's vehicle and ordered by the selected
 * criterion.
 */
@Component({
  imports: [
    MatButton,
    MatFormField,
    MatLabel,
    MatHint,
    MatPrefix,
    MatSuffix,
    MatIcon,
    MatInput,
    MatOption,
    MatSelect,
    MatProgressBar,
    MatSlideToggle,
    TranslatePipe,
    LocalizedNumberPipe,
    ProfileRequired,
    AvailableLoadCard
  ],
  selector: 'app-available-load-search',
  styleUrl: './available-load-search.css',
  templateUrl: './available-load-search.html',
})
export class AvailableLoadSearch {
  /**
   * Value used by the radius select for "any distance": `mat-select` treats a null option value as a reset option, so
   * the view maps null to 0 (a radius of 0 km is never a real option).
   */
  protected static readonly ANY = 0;

  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly breakpointObserver = inject(BreakpointObserver);

  /**
   * Matching store.
   */
  protected readonly store = inject(MatchingStore);

  /**
   * True when a carrier profile is active.
   */
  protected readonly isCarrier = this.activeProfileStore.isCarrier;

  /**
   * Peruvian locations available as the carrier position.
   */
  protected readonly locations = PERU_LOCATIONS;

  /**
   * Radius options for the select (0 means any distance).
   */
  protected readonly radiusOptions = SEARCH_RADIUS_OPTIONS_KM.map(radius => radius ?? AvailableLoadSearch.ANY);

  /**
   * Maximum trip distance options for the select (0 means any distance).
   */
  protected readonly tripDistanceOptions = MAX_TRIP_DISTANCE_OPTIONS_KM.map(distance => distance ?? AvailableLoadSearch.ANY);

  /**
   * Minimum weight options for the select (0 means any weight).
   */
  protected readonly minWeightOptions = MIN_WEIGHT_OPTIONS_KG.map(weight => weight ?? AvailableLoadSearch.ANY);

  /**
   * Ordering options.
   */
  protected readonly sortOptions = SORT_CRITERIA;

  /**
   * Value of the "any" options, exposed to the template.
   */
  protected readonly anyOption = AvailableLoadSearch.ANY;

  /**
   * True on phones, where the advanced filters panel is collapsible.
   */
  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe('(max-width: 599.98px)').pipe(map(state => state.matches)),
    {initialValue: false}
  );

  /**
   * Whether the advanced filters panel is expanded on phones.
   */
  protected readonly filtersExpanded = signal(false);

  /**
   * Vehicle type shown in the vehicle type filter: the type of the carrier's vehicle while the compatibility filter
   * applies, otherwise the chosen type (0 means any type).
   */
  protected readonly selectedVehicleTypeId = computed(() => {
    const vehicle = this.store.activeVehicle();
    return this.store.vehicleTypeFixed() && vehicle
      ? vehicle.vehicleTypeId
      : this.store.criteria().vehicleTypeId ?? AvailableLoadSearch.ANY;
  });

  /**
   * Number of advanced filters in use, shown next to the panel title.
   */
  protected readonly advancedFilterCount = computed(() => {
    const criteria = this.store.criteria();
    const vehicleTypeId = this.store.vehicleTypeFixed() ? null : criteria.vehicleTypeId;
    return [criteria.maxTripDistanceKm, vehicleTypeId, criteria.minWeightKg, criteria.minRateAmount]
      .filter(filter => filter !== null).length;
  });

  /**
   * Creates the view and reloads the published loads so the list is always current.
   */
  constructor() {
    this.store.refreshAvailableLoads();
  }

  /**
   * Changes the carrier location.
   * @param code - Code of the selected catalog location.
   */
  protected onLocationChange(code: string): void {
    const originLocation = findLocationByCode(code);
    if (originLocation) {
      this.store.updateCriteria({originLocation});
    }
  }

  /**
   * Changes the search radius.
   * @param radius - Selected radius in kilometres, or 0 for any distance.
   */
  protected onRadiusChange(radius: number): void {
    this.store.updateCriteria({radiusKm: this.toFilterValue(radius)});
  }

  /**
   * Turns the vehicle compatibility filter on or off.
   * @param compatibleWithVehicleOnly - New state of the toggle.
   */
  protected onCompatibilityChange(compatibleWithVehicleOnly: boolean): void {
    this.store.updateCriteria({compatibleWithVehicleOnly});
  }

  /**
   * Changes the ordering of the results.
   * @param sortBy - Selected ordering.
   */
  protected onSortChange(sortBy: SortCriteria): void {
    this.store.updateCriteria({sortBy});
  }

  /**
   * Changes the maximum trip distance.
   * @param distance - Selected distance in kilometres, or 0 for any distance.
   */
  protected onTripDistanceChange(distance: number): void {
    this.store.updateCriteria({maxTripDistanceKm: this.toFilterValue(distance)});
  }

  /**
   * Changes the required vehicle type.
   * @param vehicleTypeId - Selected vehicle type, or 0 for any type.
   */
  protected onVehicleTypeChange(vehicleTypeId: number): void {
    this.store.updateCriteria({vehicleTypeId: this.toFilterValue(vehicleTypeId)});
  }

  /**
   * Changes the minimum cargo weight.
   * @param weight - Selected weight in kilograms, or 0 for any weight.
   */
  protected onMinWeightChange(weight: number): void {
    this.store.updateCriteria({minWeightKg: this.toFilterValue(weight)});
  }

  /**
   * Changes the minimum offered rate typed by the carrier.
   * @param value - Text of the rate field.
   */
  protected onMinRateChange(value: string): void {
    const amount = Number(value);
    this.store.updateCriteria({minRateAmount: value.trim() !== '' && Number.isFinite(amount) && amount > 0 ? amount : null});
  }

  /**
   * Clears every filter so all published loads are shown again.
   */
  protected clearFilters(): void {
    this.store.clearFilters();
  }

  /**
   * Removes the distance limit.
   */
  protected searchAnyDistance(): void {
    this.store.updateCriteria({radiusKm: null});
  }

  /**
   * Maps the value of a select to a filter value.
   * @param value - Selected option, 0 for "any".
   * @returns The value, or null for "any".
   */
  private toFilterValue(value: number): number | null {
    return value === AvailableLoadSearch.ANY ? null : value;
  }
}
