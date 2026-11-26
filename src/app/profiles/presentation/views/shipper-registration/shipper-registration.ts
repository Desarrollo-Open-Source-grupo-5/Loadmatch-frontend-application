import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {Router, RouterLink} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatProgressBar} from '@angular/material/progress-bar';
import {TranslatePipe} from '@ngx-translate/core';
import {ProfilesApi} from '../../../infrastructure/profiles-api';

/**
 * Shipper registration view: creates a business account and shipper profile.
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
    MatProgressBar,
    TranslatePipe
  ],
  selector: 'app-shipper-registration',
  styleUrl: './shipper-registration.css',
  templateUrl: './shipper-registration.html',
})
export class ShipperRegistration {
  private readonly router = inject(Router);
  private readonly profilesApi = inject(ProfilesApi);

  protected readonly submitting = signal(false);
  protected readonly passwordVisible = signal(false);
  protected readonly errorKey = signal<string | null>(null);
  protected readonly registered = signal(false);

  protected readonly form = new FormGroup({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(6)]}),
    ruc: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.pattern(/^\d{11}$/)]}),
    businessName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    contactName: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    phoneNumber: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    street: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    district: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    province: new FormControl('', {nonNullable: true}),
    department: new FormControl('', {nonNullable: true}),
  });

  protected togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorKey.set(null);

    this.profilesApi.registerShipper(this.form.getRawValue()).subscribe({
      next: () => {
        this.submitting.set(false);
        this.registered.set(true);
        setTimeout(() => void this.router.navigate(['/sign-in']), 1200);
      },
      error: (err: unknown) => {
        this.submitting.set(false);
        if (err instanceof HttpErrorResponse && err.status === 409) {
          this.errorKey.set('shipper-register.error.duplicate');
        } else if (err instanceof HttpErrorResponse && (err.status === 400 || err.status === 422)) {
          this.errorKey.set('shipper-register.error.invalid');
        } else {
          this.errorKey.set('shipper-register.error.unavailable');
        }
      }
    });
  }
}
