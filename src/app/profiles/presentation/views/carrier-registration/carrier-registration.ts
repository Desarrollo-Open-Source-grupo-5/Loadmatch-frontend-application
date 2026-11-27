import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {switchMap} from 'rxjs';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatOption, MatSelect} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {FleetApi} from '../../../../fleet/infrastructure/fleet-api';
import {VehicleType} from '../../../../fleet/domain/model/vehicle-type.entity';
import {ProfilesApi} from '../../../infrastructure/profiles-api';

/**
 * Carrier registration view: creates a carrier account and registers its primary vehicle.
 */
@Component({
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButton,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatError,
    MatSuffix,
    MatIcon,
    MatInput,
    MatSelect,
    MatOption,
    MatProgressBar,
    TranslatePipe
  ],
  selector: 'app-carrier-registration',
  styleUrl: './carrier-registration.css',
  templateUrl: './carrier-registration.html',
})
export class CarrierRegistration implements OnInit {
  private readonly router = inject(Router);
  private readonly profilesApi = inject(ProfilesApi);
  private readonly fleetApi = inject(FleetApi);

  protected readonly submitting = signal(false);
  protected readonly passwordVisible = signal(false);
  protected readonly vehicleTypes = signal<VehicleType[]>([]);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly registered = signal(false);

  protected readonly form = new FormGroup({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(6)]}),
    firstNames: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    lastNames: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    dni: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{8}$/)]}),
    licenseNumber: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    licenseCategory: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    licenseExpirationDate: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    phoneNumber: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    operatingZone: new FormControl('', {nonNullable: true}),
    vehicleTypeId: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    licensePlate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Z0-9]{3}-[A-Z0-9]{3}$/i)]
    }),
    brand: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    model: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    manufactureYear: new FormControl<number>(new Date().getFullYear(), {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1980), Validators.max(new Date().getFullYear() + 1)]
    }),
    payloadKg: new FormControl<number>(1000, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)]
    }),
  });

  ngOnInit(): void {
    this.fleetApi.getVehicleTypes().subscribe({
      next: types => this.vehicleTypes.set(types),
      error: () => this.vehicleTypes.set([])
    });
  }

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.submitting.set(true);
    this.errorKey.set(null);

    this.profilesApi.registerCarrier({
      email: raw.email,
      password: raw.password,
      firstNames: raw.firstNames,
      lastNames: raw.lastNames,
      dni: raw.dni,
      licenseNumber: raw.licenseNumber,
      licenseCategory: raw.licenseCategory,
      licenseExpirationDate: raw.licenseExpirationDate,
      phoneNumber: raw.phoneNumber,
      operatingZone: raw.operatingZone,
    }).pipe(
      switchMap(carrier => this.profilesApi.registerVehicle({
        carrierId: carrier.id,
        vehicleTypeId: raw.vehicleTypeId,
        licensePlate: raw.licensePlate.toUpperCase(),
        brand: raw.brand,
        model: raw.model,
        manufactureYear: Number(raw.manufactureYear),
        payloadKg: Number(raw.payloadKg),
      }))
    ).subscribe({
      next: () => {
        this.submitting.set(false);
        this.registered.set(true);
        setTimeout(() => void this.router.navigate(['/sign-in']), 1200);
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        if (err instanceof HttpErrorResponse && (err.status === 400 || err.status === 422)) {
          this.errorKey.set('carrier-register.error.invalid');
        } else if (err instanceof HttpErrorResponse && err.status === 409) {
          this.errorKey.set('carrier-register.error.duplicate');
        } else {
          this.errorKey.set('carrier-register.error.unavailable');
        }
      }
    });
  }
}

