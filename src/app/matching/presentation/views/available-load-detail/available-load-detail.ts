import {Component, computed, inject} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {TranslatePipe} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {ProfileRequired} from '../../../../shared/presentation/components/profile-required/profile-required';
import {LocalizedDatePipe} from '../../../../shared/presentation/pipes/localized-date.pipe';
import {LocalizedNumberPipe} from '../../../../shared/presentation/pipes/localized-number.pipe';
import {MoneyPipe} from '../../../../shared/presentation/pipes/money.pipe';
import {MatchingStore} from '../../../application/matching.store';

/**
 * Detail of an available load as seen by a carrier before accepting it: route, date, cargo, offered rate and the
 * shipper's rating.
 */
@Component({
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    MatProgressBar,
    TranslatePipe,
    LocalizedDatePipe,
    LocalizedNumberPipe,
    MoneyPipe,
    ProfileRequired
  ],
  selector: 'app-available-load-detail',
  styleUrl: './available-load-detail.css',
  templateUrl: './available-load-detail.html',
})
export class AvailableLoadDetail {
  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly route = inject(ActivatedRoute);

  /**
   * Matching store.
   */
  protected readonly store = inject(MatchingStore);

  /**
   * True when a carrier profile is active.
   */
  protected readonly isCarrier = this.activeProfileStore.isCarrier;

  /**
   * Identifier taken from the route, or null when it is not a valid identifier.
   */
  protected readonly loadRequestId: number | null = this.parseId(this.route.snapshot.paramMap.get('id'));

  /**
   * Detail of the consulted load, only when it matches the route (never a previously opened load).
   */
  protected readonly loadDetail = computed(() => {
    const loadDetail = this.store.loadDetail();
    return loadDetail?.loadRequestId === this.loadRequestId ? loadDetail : null;
  });

  /**
   * Icons of the five rating stars of the shipper (full, half or empty).
   */
  protected readonly shipperStars = computed(() => {
    const average = this.loadDetail()?.shipperReputationAverage ?? 0;
    return [0, 1, 2, 3, 4].map(index => {
      const value = average - index;
      return value >= 0.75 ? 'star' : value >= 0.25 ? 'star_half' : 'star_border';
    });
  });

  /**
   * Creates the view and fetches the load from the API.
   */
  constructor() {
    if (this.loadRequestId !== null && this.isCarrier()) {
      this.store.openLoadDetail(this.loadRequestId);
    }
  }

  /**
   * True when the load cannot be shown: it was taken by another carrier, no longer exists or the route identifier is
   * invalid.
   * @returns Whether the unavailable message is shown.
   */
  protected isUnavailable(): boolean {
    return this.loadRequestId === null || this.store.detailUnavailable();
  }

  /**
   * Parses the route identifier.
   * @param id - Raw route parameter.
   * @returns The numeric identifier, or null when absent or invalid.
   */
  private parseId(id: string | null): number | null {
    const parsed = Number(id);
    return id !== null && Number.isInteger(parsed) && parsed > 0 ? parsed : null;
  }
}
