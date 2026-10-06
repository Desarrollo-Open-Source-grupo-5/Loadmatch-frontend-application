import {inject, Injectable, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Shipper} from '../domain/model/shipper.entity';
import {Carrier} from '../domain/model/carrier.entity';
import {ProfilesApi} from '../infrastructure/profiles-api';

/**
 * Holds the shipper and carrier profiles available as demo profiles.
 */
@Injectable({
  providedIn: 'root'
})
export class ProfilesStore {
  private readonly profilesApi = inject(ProfilesApi);

  private readonly shippersSignal = signal<Shipper[]>([]);

  /**
   * Readonly signal for the list of shippers.
   */
  readonly shippers = this.shippersSignal.asReadonly();

  private readonly carriersSignal = signal<Carrier[]>([]);

  /**
   * Readonly signal for the list of carriers.
   */
  readonly carriers = this.carriersSignal.asReadonly();

  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Readonly signal indicating if data is loading.
   */
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);

  /**
   * Readonly signal for the current error message.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Creates an instance of ProfilesStore and loads initial data.
   */
  constructor() {
    this.loadShippers();
    this.loadCarriers();
  }

  /**
   * Loads all shippers from the API.
   */
  private loadShippers = (): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.profilesApi.getShippers().pipe(takeUntilDestroyed()).subscribe({
      next: shippers => {
        this.shippersSignal.set(shippers);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load shippers'));
        this.loadingSignal.set(false);
      }
    });
  };

  /**
   * Loads all carriers from the API.
   */
  private loadCarriers = (): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.profilesApi.getCarriers().pipe(takeUntilDestroyed()).subscribe({
      next: carriers => {
        this.carriersSignal.set(carriers);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load carriers'));
        this.loadingSignal.set(false);
      }
    });
  };

  /**
   * Normalizes unknown errors into a display-friendly message.
   * @param error - Source error.
   * @param fallback - Default message when details are unavailable.
   * @returns Normalized message.
   */
  private formatError = (error: unknown, fallback: string): string => {
    if (error instanceof Error) {
      return error.message.includes('Resource not found') ? `${fallback}: Not found` : error.message;
    }
    return fallback;
  };
}
