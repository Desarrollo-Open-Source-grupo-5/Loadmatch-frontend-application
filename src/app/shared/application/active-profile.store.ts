import {computed, Injectable, signal} from '@angular/core';

/**
 * Role a demo profile plays in the Web Application.
 */
export type ProfileRole = 'SHIPPER' | 'CARRIER';

/**
 * Snapshot of the demo profile chosen on the home view.
 */
export interface ActiveProfile {
  /**
   * Role of the profile (shipper company or carrier).
   */
  role: ProfileRole;
  /**
   * Identifier of the Shipper or Carrier resource in the API.
   */
  profileId: number;
  /**
   * Name shown in the toolbar (business name or carrier full name).
   */
  displayName: string;
}

/**
 * Holds the demo profile the user entered with ("Enter as Shipper" / "Enter as Carrier").
 */
@Injectable({
  providedIn: 'root'
})
export class ActiveProfileStore {
  private static readonly STORAGE_KEY = 'loadmatch.active-profile';

  private readonly activeProfileSignal = signal<ActiveProfile | null>(ActiveProfileStore.restore());

  /**
   * Readonly signal with the active profile, or null when no profile has been chosen.
   */
  readonly activeProfile = this.activeProfileSignal.asReadonly();

  /**
   * Computed signal that is true when the active profile is a shipper.
   */
  readonly isShipper = computed(() => this.activeProfile()?.role === 'SHIPPER');

  /**
   * Computed signal that is true when the active profile is a carrier.
   */
  readonly isCarrier = computed(() => this.activeProfile()?.role === 'CARRIER');

  /**
   * Computed signal with the active shipper identifier, or null for other roles.
   */
  readonly shipperId = computed(() => (this.isShipper() ? this.activeProfile()?.profileId ?? null : null));

  /**
   * Computed signal with the active carrier identifier, or null for other roles.
   */
  readonly carrierId = computed(() => (this.isCarrier() ? this.activeProfile()?.profileId ?? null : null));

  /**
   * Sets the active profile.
   * @param profile - Profile chosen on the home view.
   */
  select(profile: ActiveProfile): void {
    this.activeProfileSignal.set(profile);
    ActiveProfileStore.persist(profile);
  }

  /**
   * Clears the active profile ("Switch profile").
   */
  clear(): void {
    this.activeProfileSignal.set(null);
    ActiveProfileStore.persist(null);
  }

  /**
   * Reads the persisted profile, tolerating unavailable or corrupted storage.
   * @returns The persisted profile or null.
   */
  private static restore(): ActiveProfile | null {
    try {
      const stored = sessionStorage.getItem(ActiveProfileStore.STORAGE_KEY);
      return stored ? (JSON.parse(stored) as ActiveProfile) : null;
    } catch {
      return null;
    }
  }

  /**
   * Persists the profile, ignoring storage failures (private mode, blocked storage).
   * @param profile - Profile to persist, or null to remove it.
   */
  private static persist(profile: ActiveProfile | null): void {
    try {
      if (profile) {
        sessionStorage.setItem(ActiveProfileStore.STORAGE_KEY, JSON.stringify(profile));
      } else {
        sessionStorage.removeItem(ActiveProfileStore.STORAGE_KEY);
      }
    } catch {
      // Storage is optional: the selection still lives in memory.
    }
  }
}
