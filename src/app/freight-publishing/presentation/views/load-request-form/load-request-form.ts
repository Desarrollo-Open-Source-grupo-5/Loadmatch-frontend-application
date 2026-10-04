import {Component, computed, effect, inject, signal, untracked, viewChild} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {DateAdapter, provideNativeDateAdapter} from '@angular/material/core';
import {MatButton} from '@angular/material/button';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatError, MatFormField, MatHint, MatLabel, MatPrefix, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {Dimensions} from '../../../../shared/domain/model/dimensions';
import {Money} from '../../../../shared/domain/model/money';
import {findLocationByCode, findLocationByDistrict, PERU_LOCATIONS} from '../../../../shared/domain/model/peru-locations';
import {ProfileRequired} from '../../../../shared/presentation/components/profile-required/profile-required';
import {toLocaleId} from '../../../../shared/presentation/pipes/app-locale';
import {LocalizedNumberPipe} from '../../../../shared/presentation/pipes/localized-number.pipe';
import {FreightPublishingStore} from '../../../application/freight-publishing.store';
import {LoadRequest, LoadRequestDetails} from '../../../domain/model/load-request.entity';
import {Location} from '../../../domain/model/location';
import {Route} from '../../../domain/model/route';
import {LoadRequestPublishedDialog} from '../../components/load-request-published-dialog/load-request-published-dialog';
import {CrossFieldErrorStateMatcher, LoadRequestValidators} from './load-request-validators';

/**
 * Publish load request form.
 */
@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatError,
    MatFormField,
    MatHint,
    MatLabel,
    MatPrefix,
    MatSuffix,
    MatIcon,
    MatInput,
    MatOption,
    MatSelect,
    MatProgressBar,
    TranslatePipe,
    LocalizedNumberPipe,
    ProfileRequired
  ],
  providers: [provideNativeDateAdapter()],
  selector: 'app-load-request-form',
  styleUrl: './load-request-form.css',
  templateUrl: './load-request-form.html',
})
export class LoadRequestForm {
  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly translate = inject(TranslateService);
  private readonly dateAdapter = inject(DateAdapter<Date>);
  private readonly formDirective = viewChild(FormGroupDirective);

  /**
   * Freight Publishing store.
   */
  protected readonly store = inject(FreightPublishingStore);

  /**
   * Peruvian locations available as origin and destination.
   */
  protected readonly locations = PERU_LOCATIONS;

  /**
   * True when a shipper profile is active.
   */
  protected readonly isShipper = this.activeProfileStore.isShipper;

  /**
   * Earliest selectable pickup day (today).
   */
  protected readonly today = new Date(new Date().setHours(0, 0, 0, 0));

  /**
   * Identifier of the edited load request, or null when publishing a new one.
   */
  protected readonly editedId: number | null = this.parseId(this.route.snapshot.paramMap.get('id'));

  /**
   * Load request being edited, once the store has loaded it.
   */
  protected readonly editedLoadRequest = computed(() =>
    this.editedId === null ? undefined : this.store.loadRequests().find(loadRequest => loadRequest.id === this.editedId)
  );

  /**
   * True after the user tried to submit, to show the summary of pending fields.
   */
  protected readonly submitAttempted = signal(false);

  /**
   * True when a domain rule rejected the data on submit (e.g. the pickup time just passed).
   */
  protected readonly domainRuleRejected = signal(false);

  /**
   * Shows destination errors when origin and destination are the same.
   */
  protected readonly sameLocationMatcher = new CrossFieldErrorStateMatcher('sameLocation');

  /**
   * Shows weight errors when the weight exceeds the vehicle capacity.
   */
  protected readonly weightMatcher = new CrossFieldErrorStateMatcher('weightExceedsCapacity');

  /**
   * Shows pickup errors when the pickup is not in the future.
   */
  protected readonly pickupMatcher = new CrossFieldErrorStateMatcher('pickupInPast');

  /**
   * Reactive form with every required field of the load request.
   */
  protected readonly form = new FormGroup({
    originLocationCode: new FormControl('', {nonNullable: true, validators: Validators.required}),
    originAddress: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.maxLength(120)]}),
    destinationLocationCode: new FormControl('', {nonNullable: true, validators: Validators.required}),
    destinationAddress: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.maxLength(120)]}),
    vehicleTypeId: new FormControl<number | null>(null, Validators.required),
    cargoType: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.maxLength(60)]}),
    weightKg: new FormControl<number | null>(null, [Validators.required, LoadRequestValidators.positive()]),
    lengthM: new FormControl<number | null>(null, [Validators.required, LoadRequestValidators.positive()]),
    widthM: new FormControl<number | null>(null, [Validators.required, LoadRequestValidators.positive()]),
    heightM: new FormControl<number | null>(null, [Validators.required, LoadRequestValidators.positive()]),
    rateAmount: new FormControl<number | null>(null, [Validators.required, LoadRequestValidators.positive()]),
    pickupDate: new FormControl<Date | null>(null, Validators.required),
    pickupTime: new FormControl('', {nonNullable: true, validators: Validators.required})
  }, {
    validators: [
      LoadRequestValidators.differentLocations('originLocationCode', 'destinationLocationCode'),
      LoadRequestValidators.weightWithinVehicleCapacity('weightKg', 'vehicleTypeId',
        vehicleTypeId => this.store.vehicleTypes().find(vehicleType => vehicleType.id === vehicleTypeId)?.maxWeightKg),
      LoadRequestValidators.pickupInFuture('pickupDate', 'pickupTime')
    ]
  });

  private readonly originCode = toSignal(this.form.controls.originLocationCode.valueChanges, {initialValue: ''});
  private readonly destinationCode = toSignal(this.form.controls.destinationLocationCode.valueChanges, {initialValue: ''});
  private readonly vehicleTypeId = toSignal(this.form.controls.vehicleTypeId.valueChanges, {initialValue: null});

  /**
   * Vehicle type currently selected, used for the capacity hint.
   */
  protected readonly selectedVehicleType = computed(() => {
    const id = this.vehicleTypeId();
    return id === null ? undefined : this.store.vehicleTypes().find(vehicleType => vehicleType.id === id);
  });

  /**
   * Straight-line distance between the selected locations, or null until both are chosen.
   */
  protected readonly estimatedDistanceKm = computed(() => {
    const origin = findLocationByCode(this.originCode());
    const destination = findLocationByCode(this.destinationCode());
    return origin && destination && origin !== destination
      ? Math.round(origin.coordinates.distanceTo(destination.coordinates))
      : null;
  });

  /**
   * Creates the form, keeps the datepicker locale in sync with the language and fills the form when editing.
   */
  constructor() {
    this.dateAdapter.setLocale(toLocaleId(this.translate.getCurrentLang()));
    this.translate.onLangChange
      .pipe(takeUntilDestroyed())
      .subscribe(event => this.dateAdapter.setLocale(toLocaleId(event.lang)));

    // Re-validate the capacity rule when the vehicle type catalog arrives.
    effect(() => {
      this.store.vehicleTypes();
      untracked(() => this.form.updateValueAndValidity());
    });

    let filled = false;
    effect(() => {
      const loadRequest = this.editedLoadRequest();
      if (loadRequest && !filled) {
        filled = true;
        untracked(() => this.fillForm(loadRequest));
      }
    });
  }

  /**
   * True when the form edits an existing load request.
   * @returns Whether the view is in edit mode.
   */
  protected isEditMode(): boolean {
    return this.editedId !== null;
  }

  /**
   * True when the edited request exists but can no longer be edited.
   * @returns Whether editing is blocked.
   */
  protected isEditBlocked(): boolean {
    const loadRequest = this.editedLoadRequest();
    return !!loadRequest && !loadRequest.isEditable();
  }

  /**
   * True when the edited request is not among the shipper's load requests.
   * @returns Whether the edited request was not found.
   */
  protected isEditedNotFound(): boolean {
    return this.isEditMode() && !this.store.loading() && !this.editedLoadRequest();
  }

  /**
   * Translation keys of the fields that still need attention, for the error summary.
   * @returns Label keys of invalid fields.
   */
  protected invalidFieldLabels(): string[] {
    const controls = this.form.controls;
    const labels: string[] = [];
    const check = (invalid: boolean, label: string) => {
      if (invalid) {
        labels.push(label);
      }
    };
    check(controls.originLocationCode.invalid, 'load-request-form.origin-location');
    check(controls.originAddress.invalid, 'load-request-form.origin-address');
    check(controls.destinationLocationCode.invalid || this.form.hasError('sameLocation'), 'load-request-form.destination-location');
    check(controls.destinationAddress.invalid, 'load-request-form.destination-address');
    check(controls.vehicleTypeId.invalid, 'load-request-form.vehicle-type');
    check(controls.cargoType.invalid, 'load-request-form.cargo-type');
    check(controls.weightKg.invalid || this.form.hasError('weightExceedsCapacity'), 'load-request-form.weight');
    check(controls.lengthM.invalid || controls.widthM.invalid || controls.heightM.invalid, 'load-request-form.dimensions');
    check(controls.rateAmount.invalid, 'load-request-form.rate');
    check(controls.pickupDate.invalid || controls.pickupTime.invalid || this.form.hasError('pickupInPast'), 'load-request-form.pickup');
    return labels;
  }

  /**
   * Publishes the load request or saves the changes.
   */
  protected submit(): void {
    this.domainRuleRejected.set(false);
    if (this.form.invalid) {
      this.submitAttempted.set(true);
      this.form.markAllAsTouched();
      return;
    }
    const shipperId = this.activeProfileStore.shipperId();
    if (shipperId === null) {
      return;
    }
    try {
      const existing = this.editedLoadRequest();
      if (existing) {
        const edited = existing.clone();
        edited.edit(this.buildDetails());
        this.store.updateLoadRequest(edited, updated => this.onUpdated(updated));
      } else {
        const loadRequest = new LoadRequest({...this.buildDetails(), id: 0, shipperId});
        loadRequest.publish();
        this.store.publishLoadRequest(loadRequest, created => this.onPublished(created));
      }
    } catch {
      this.domainRuleRejected.set(true);
    }
  }

  /**
   * Fills the form with the data of the edited load request and disables it when not editable.
   * @param loadRequest - Load request being edited.
   */
  private fillForm(loadRequest: LoadRequest): void {
    const pickupAt = loadRequest.pickupAt;
    const pad = (value: number) => String(value).padStart(2, '0');
    this.form.setValue({
      originLocationCode: findLocationByDistrict(loadRequest.route.origin.district)?.code ?? '',
      originAddress: loadRequest.route.origin.address,
      destinationLocationCode: findLocationByDistrict(loadRequest.route.destination.district)?.code ?? '',
      destinationAddress: loadRequest.route.destination.address,
      vehicleTypeId: loadRequest.vehicleTypeId,
      cargoType: loadRequest.cargoType,
      weightKg: loadRequest.weightKg,
      lengthM: loadRequest.dimensions.lengthM,
      widthM: loadRequest.dimensions.widthM,
      heightM: loadRequest.dimensions.heightM,
      rateAmount: loadRequest.offeredRate.amount,
      pickupDate: new Date(pickupAt.getFullYear(), pickupAt.getMonth(), pickupAt.getDate()),
      pickupTime: `${pad(pickupAt.getHours())}:${pad(pickupAt.getMinutes())}`
    });
    if (!loadRequest.isEditable()) {
      this.form.disable();
    }
  }

  /**
   * Builds the domain data from the (valid) form value.
   * @returns Transport and cargo details.
   */
  private buildDetails(): LoadRequestDetails {
    const value = this.form.getRawValue();
    const origin = findLocationByCode(value.originLocationCode) ?? PERU_LOCATIONS[0];
    const destination = findLocationByCode(value.destinationLocationCode) ?? PERU_LOCATIONS[0];
    return {
      vehicleTypeId: Number(value.vehicleTypeId),
      route: Route.between(
        new Location({address: value.originAddress.trim(), district: origin.district, coordinates: origin.coordinates}),
        new Location({address: value.destinationAddress.trim(), district: destination.district, coordinates: destination.coordinates})
      ),
      weightKg: Number(value.weightKg),
      dimensions: new Dimensions({
        lengthM: Number(value.lengthM),
        widthM: Number(value.widthM),
        heightM: Number(value.heightM)
      }),
      cargoType: value.cargoType.trim(),
      offeredRate: Money.ofSoles(Number(value.rateAmount)),
      pickupAt: LoadRequestValidators.combineDateAndTime(value.pickupDate ?? this.today, value.pickupTime)
    };
  }

  /**
   * Shows the success dialog and resets the form or opens "My Loads".
   * @param created - Load request returned by the API.
   */
  private onPublished(created: LoadRequest): void {
    this.dialog
      .open(LoadRequestPublishedDialog, {data: {loadRequest: created}, autoFocus: 'first-tabbable', width: '480px'})
      .afterClosed()
      .subscribe(result => {
        if (result === 'view-list') {
          this.router.navigate(['/shipper/load-requests']).then();
        } else {
          this.submitAttempted.set(false);
          this.formDirective()?.resetForm();
        }
      });
  }

  /**
   * Confirms the update and returns to "My Loads".
   * @param updated - Load request returned by the API.
   */
  private onUpdated(updated: LoadRequest): void {
    this.snackBar.open(
      this.translate.instant('load-request-form.updated', {code: updated.code}),
      this.translate.instant('common.close'),
      {duration: 4000}
    );
    this.router.navigate(['/shipper/load-requests']).then();
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
