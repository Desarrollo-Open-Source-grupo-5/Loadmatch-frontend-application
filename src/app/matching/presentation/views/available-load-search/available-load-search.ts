import {Component, inject} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {TranslatePipe} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {findLocationByCode, PERU_LOCATIONS} from '../../../../shared/domain/model/peru-locations';
import {ProfileRequired} from '../../../../shared/presentation/components/profile-required/profile-required';
import {LocalizedNumberPipe} from '../../../../shared/presentation/pipes/localized-number.pipe';
import {MatchingStore} from '../../../application/matching.store';
import {SEARCH_RADIUS_OPTIONS_KM} from '../../../domain/model/search-criteria';
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
    MatSuffix,
    MatIcon,
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
  protected static readonly ANY_DISTANCE = 0;

  private readonly activeProfileStore = inject(ActiveProfileStore);

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
  protected readonly radiusOptions = SEARCH_RADIUS_OPTIONS_KM.map(radius => radius ?? AvailableLoadSearch.ANY_DISTANCE);

  /**
   * Ordering options.
   */
  protected readonly sortOptions = SORT_CRITERIA;

  /**
   * Value of the "any distance" option, exposed to the template.
   */
  protected readonly anyDistance = AvailableLoadSearch.ANY_DISTANCE;

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
    this.store.updateCriteria({radiusKm: radius === AvailableLoadSearch.ANY_DISTANCE ? null : radius});
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
   * Removes the distance limit.
   */
  protected searchAnyDistance(): void {
    this.store.updateCriteria({radiusKm: null});
  }
}
