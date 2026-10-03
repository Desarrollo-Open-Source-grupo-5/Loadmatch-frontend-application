import {computed, effect, inject, Injectable, Signal, signal, untracked} from '@angular/core';
import {retry} from 'rxjs';
import {ActiveProfileStore} from '../../shared/application/active-profile.store';
import {LoadRequest} from '../domain/model/load-request.entity';
import {VehicleTypeOption} from '../domain/model/vehicle-type-option';
import {FreightPublishingApi} from '../infrastructure/freight-publishing-api';

/**
 * Holds Freight Publishing state: the active shipper's load requests and the vehicle type catalog, and coordinates
 * publishing, editing and cancelling load requests.
 */
@Injectable({
  providedIn: 'root'
})
export class FreightPublishingStore {
  private readonly freightPublishingApi = inject(FreightPublishingApi);
  private readonly activeProfileStore = inject(ActiveProfileStore);

  private readonly loadRequestsSignal = signal<LoadRequest[]>([]);

  /**
   * Readonly signal for the active shipper's load requests, newest first.
   */
  readonly loadRequests = this.loadRequestsSignal.asReadonly();

  /**
   * Computed signal for the count of load requests.
   */
  readonly loadRequestCount = computed(() => this.loadRequests().length);

  private readonly vehicleTypesSignal = signal<VehicleTypeOption[]>([]);

  /**
   * Readonly signal for the vehicle type catalog.
   */
  readonly vehicleTypes = this.vehicleTypesSignal.asReadonly();

  /**
   * Computed signal with the vehicle types that can be chosen for new load requests.
   */
  readonly activeVehicleTypes = computed(() => this.vehicleTypes().filter(vehicleType => vehicleType.active));

  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Readonly signal indicating if data is loading or being saved.
   */
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);

  /**
   * Readonly signal for the current error message.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Creates an instance of FreightPublishingStore, loads the vehicle type catalog and reloads the load requests every
   * time the active shipper changes.
   */
  constructor() {
    this.loadVehicleTypes();
    effect(() => {
      const shipperId = this.activeProfileStore.shipperId();
      untracked(() => {
        if (shipperId) {
          this.loadLoadRequests(shipperId);
        } else {
          this.loadRequestsSignal.set([]);
        }
      });
    });
  }

  /**
   * Selects a load request of the active shipper by identifier.
   * @param id - Load request identifier.
   * @returns Reactive selection for the requested load request.
   */
  getLoadRequestById = (id: number): Signal<LoadRequest | undefined> =>
    computed(() => this.loadRequests().find(loadRequest => loadRequest.id === id));

  /**
   * Selects a vehicle type by identifier.
   * @param id - Vehicle type identifier.
   * @returns Reactive selection for the requested vehicle type.
   */
  getVehicleTypeById = (id: number): Signal<VehicleTypeOption | undefined> =>
    computed(() => this.vehicleTypes().find(vehicleType => vehicleType.id === id));

  /**
   * Publishes a new load request.
   * @param loadRequest - The published load request to persist.
   * @param onSuccess - Callback invoked with the created request (e.g. to show the success dialog).
   */
  publishLoadRequest = (loadRequest: LoadRequest, onSuccess?: (created: LoadRequest) => void): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.freightPublishingApi.createLoadRequest(loadRequest).subscribe({
      next: created => {
        this.loadRequestsSignal.update(loadRequests => this.sortNewestFirst([...loadRequests, created]));
        this.loadingSignal.set(false);
        onSuccess?.(created);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to publish load request'));
        this.loadingSignal.set(false);
      }
    });
  };

  /**
   * Saves the changes made to a published load request.
   * @param loadRequest - Edited copy of the load request.
   * @param onSuccess - Callback invoked with the updated request.
   */
  updateLoadRequest = (loadRequest: LoadRequest, onSuccess?: (updated: LoadRequest) => void): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.freightPublishingApi.updateLoadRequest(loadRequest).pipe(retry(2)).subscribe({
      next: updated => {
        this.replaceLoadRequest(updated);
        this.loadingSignal.set(false);
        onSuccess?.(updated);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to update load request'));
        this.loadingSignal.set(false);
      }
    });
  };

  /**
   * Cancels a published load request with a reason.
   * @param id - Identifier of the load request to cancel.
   * @param reason - Cancellation reason given by the shipper.
   * @param onSuccess - Callback invoked with the cancelled request.
   */
  cancelLoadRequest = (id: number, reason: string, onSuccess?: (cancelled: LoadRequest) => void): void => {
    const current = this.loadRequests().find(loadRequest => loadRequest.id === id);
    if (!current) {
      this.errorSignal.set(`Failed to cancel load request: ${id} not found`);
      return;
    }
    const cancelled = current.clone();
    try {
      cancelled.cancel(reason);
    } catch (error) {
      this.errorSignal.set(this.formatError(error, 'Failed to cancel load request'));
      return;
    }
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.freightPublishingApi.updateLoadRequest(cancelled).pipe(retry(2)).subscribe({
      next: updated => {
        this.replaceLoadRequest(updated);
        this.loadingSignal.set(false);
        onSuccess?.(updated);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to cancel load request'));
        this.loadingSignal.set(false);
      }
    });
  };

  /**
   * Loads the load requests of a shipper from the API.
   * @param shipperId - Shipper identifier.
   */
  private loadLoadRequests = (shipperId: number): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.freightPublishingApi.getLoadRequestsByShipper(shipperId).subscribe({
      next: loadRequests => {
        // Ignore late responses that belong to a previously active shipper.
        if (this.activeProfileStore.shipperId() === shipperId) {
          this.loadRequestsSignal.set(this.sortNewestFirst(loadRequests));
        }
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load load requests'));
        this.loadingSignal.set(false);
      }
    });
  };

  /**
   * Loads the vehicle type catalog from the API.
   */
  private loadVehicleTypes = (): void => {
    this.freightPublishingApi.getVehicleTypes().subscribe({
      next: vehicleTypes => this.vehicleTypesSignal.set(vehicleTypes),
      error: err => this.errorSignal.set(this.formatError(err, 'Failed to load vehicle types'))
    });
  };

  /**
   * Replaces a load request in the state with its updated version.
   * @param updated - Updated load request returned by the API.
   */
  private replaceLoadRequest = (updated: LoadRequest): void => {
    this.loadRequestsSignal.update(loadRequests =>
      loadRequests.map(loadRequest => (loadRequest.id === updated.id ? updated : loadRequest))
    );
  };

  /**
   * Orders load requests from the most recently created to the oldest.
   * @param loadRequests - Load requests to order.
   * @returns A new ordered array.
   */
  private sortNewestFirst = (loadRequests: LoadRequest[]): LoadRequest[] =>
    [...loadRequests].sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));

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
