import {computed, effect, inject, Injectable, signal, untracked} from '@angular/core';
import {of, switchMap} from 'rxjs';
import {ActiveProfileStore} from '../../shared/application/active-profile.store';
import {DEFAULT_LOCATION_CODE, findLocationByCode, PERU_LOCATIONS} from '../../shared/domain/model/peru-locations';
import {AvailableLoad} from '../domain/model/available-load';
import {CarrierVehicle} from '../domain/model/carrier-vehicle';
import {LoadDetail} from '../domain/model/load-detail';
import {SearchCriteria, SearchCriteriaChanges} from '../domain/model/search-criteria';
import {VehicleTypeReference} from '../domain/model/vehicle-type-reference';
import {MatchingService} from '../domain/services/matching-service';
import {MatchingApi} from '../infrastructure/matching-api';

/**
 * Holds the state of the available loads search: published loads, the active carrier's vehicle, the search criteria
 * with its advanced filters and the resulting ordered list; and the detail of the load the carrier is consulting.
 */
@Injectable({
  providedIn: 'root'
})
export class MatchingStore {
  private readonly matchingApi = inject(MatchingApi);
  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly matchingService = new MatchingService();

  private readonly availableLoadsSignal = signal<AvailableLoad[]>([]);

  /**
   * Readonly signal with every published load, before applying the search criteria.
   */
  readonly availableLoads = this.availableLoadsSignal.asReadonly();

  private readonly carrierVehiclesSignal = signal<CarrierVehicle[]>([]);

  /**
   * Readonly signal with the vehicles of the active carrier.
   */
  readonly carrierVehicles = this.carrierVehiclesSignal.asReadonly();

  private readonly vehicleTypesSignal = signal<VehicleTypeReference[]>([]);

  /**
   * Readonly signal with the vehicle type catalog.
   */
  readonly vehicleTypes = this.vehicleTypesSignal.asReadonly();

  private readonly criteriaSignal = signal<SearchCriteria>(
    SearchCriteria.defaultFor(findLocationByCode(DEFAULT_LOCATION_CODE) ?? PERU_LOCATIONS[0])
  );

  /**
   * Readonly signal with the current search criteria.
   */
  readonly criteria = this.criteriaSignal.asReadonly();

  /**
   * Computed signal with the active vehicle of the carrier, or null when it has none.
   */
  readonly activeVehicle = computed(() => this.carrierVehicles().find(vehicle => vehicle.active) ?? null);

  /**
   * Computed signal that is true while the compatibility filter applies: the vehicle type is then fixed to the type
   * of the carrier's vehicle and the vehicle type filter is not used.
   */
  readonly vehicleTypeFixed = computed(() => this.criteria().compatibleWithVehicleOnly && this.activeVehicle() !== null);

  /**
   * Computed signal with the loads that match the criteria, ordered.
   */
  readonly results = computed(() =>
    this.matchingService.findNearbyLoads(this.availableLoads(), this.criteria(), this.activeVehicle())
  );

  /**
   * Computed signal for the number of results.
   */
  readonly resultCount = computed(() => this.results().length);

  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Readonly signal indicating if the available loads are loading.
   */
  readonly loading = this.loadingSignal.asReadonly();

  private readonly errorSignal = signal<string | null>(null);

  /**
   * Readonly signal for the current error message.
   */
  readonly error = this.errorSignal.asReadonly();

  private readonly loadDetailSignal = signal<LoadDetail | null>(null);

  /**
   * Readonly signal with the detail of the consulted load, or null while it loads or when it is no longer available.
   */
  readonly loadDetail = this.loadDetailSignal.asReadonly();

  private readonly detailUnavailableSignal = signal<boolean>(false);

  /**
   * Readonly signal that is true when the consulted load was already taken by another carrier or no longer exists.
   */
  readonly detailUnavailable = this.detailUnavailableSignal.asReadonly();

  private readonly detailLoadingSignal = signal<boolean>(false);

  /**
   * Readonly signal indicating if the consulted load is loading.
   */
  readonly detailLoading = this.detailLoadingSignal.asReadonly();

  /**
   * Identifier of the load whose detail was last requested, used to ignore late responses.
   */
  private detailRequestId: number | null = null;

  /**
   * Creates an instance of MatchingStore, loads the vehicle type catalog and reloads the carrier's vehicles every
   * time the active carrier changes.
   */
  constructor() {
    this.loadVehicleTypes();
    effect(() => {
      const carrierId = this.activeProfileStore.carrierId();
      untracked(() => {
        if (carrierId) {
          this.loadCarrierVehicles(carrierId);
        } else {
          this.carrierVehiclesSignal.set([]);
        }
      });
    });
  }

  /**
   * Reloads the published loads, so loads published or cancelled meanwhile are reflected.
   */
  refreshAvailableLoads = (): void => {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.matchingApi.getAvailableLoads().subscribe({
      next: availableLoads => {
        this.availableLoadsSignal.set(availableLoads);
        this.loadingSignal.set(false);
      },
      error: err => {
        this.errorSignal.set(this.formatError(err, 'Failed to load available loads'));
        this.loadingSignal.set(false);
      }
    });
  };

  /**
   * Applies changes to the search criteria.
   * @param changes - Criteria attributes to change.
   */
  updateCriteria = (changes: SearchCriteriaChanges): void => {
    this.criteriaSignal.update(criteria => criteria.with(changes));
  };

  /**
   * Clears the filters so every published load is shown again, keeping the carrier location and the ordering.
   */
  clearFilters = (): void => {
    this.criteriaSignal.update(criteria => criteria.clearFilters());
  };

  /**
   * Opens the detail of a load.
   * @param id - Load request identifier.
   */
  openLoadDetail = (id: number): void => {
    this.detailRequestId = id;
    this.loadDetailSignal.set(null);
    this.detailUnavailableSignal.set(false);
    this.detailLoadingSignal.set(true);
    this.errorSignal.set(null);
    const carrierLocation = this.criteria().origin;
    this.matchingApi.getLoadById(id).pipe(
      switchMap(load => (load.isAvailable() ? this.matchingApi.getLoadDetail(load, carrierLocation) : of(null)))
    ).subscribe({
      next: loadDetail => {
        // Ignore late responses that belong to a previously opened load.
        if (this.detailRequestId !== id) {
          return;
        }
        if (loadDetail) {
          this.loadDetailSignal.set(loadDetail);
        } else {
          this.markDetailUnavailable(id);
        }
        this.detailLoadingSignal.set(false);
      },
      error: err => {
        if (this.detailRequestId !== id) {
          return;
        }
        const message = this.formatError(err, 'Failed to load the load detail');
        if (message.endsWith('Not found')) {
          this.markDetailUnavailable(id);
        } else {
          this.errorSignal.set(message);
        }
        this.detailLoadingSignal.set(false);
      }
    });
  };

  /**
   * Finds the name of a vehicle type.
   * @param id - Vehicle type identifier.
   * @returns The vehicle type name, or an empty string while the catalog is loading.
   */
  vehicleTypeName = (id: number): string =>
    this.vehicleTypes().find(vehicleType => vehicleType.id === id)?.name ?? '';

  /**
   * Reports the consulted load as no longer available and removes it from the available loads.
   * @param id - Load request identifier.
   */
  private markDetailUnavailable = (id: number): void => {
    this.detailUnavailableSignal.set(true);
    this.availableLoadsSignal.update(availableLoads => availableLoads.filter(load => load.id !== id));
  };

  /**
   * Loads the vehicles of a carrier from the API.
   * @param carrierId - Carrier identifier.
   */
  private loadCarrierVehicles = (carrierId: number): void => {
    this.matchingApi.getCarrierVehicles(carrierId).subscribe({
      next: vehicles => {
        // Ignore late responses that belong to a previously active carrier.
        if (this.activeProfileStore.carrierId() === carrierId) {
          this.carrierVehiclesSignal.set(vehicles);
        }
      },
      error: err => this.errorSignal.set(this.formatError(err, 'Failed to load carrier vehicles'))
    });
  };

  /**
   * Loads the vehicle type catalog from the API.
   */
  private loadVehicleTypes = (): void => {
    this.matchingApi.getVehicleTypes().subscribe({
      next: vehicleTypes => this.vehicleTypesSignal.set(vehicleTypes),
      error: err => this.errorSignal.set(this.formatError(err, 'Failed to load vehicle types'))
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
