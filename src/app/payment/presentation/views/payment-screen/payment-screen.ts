import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatProgressBar} from '@angular/material/progress-bar';
import {MatSelect, MatOption} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {PaymentMethod} from '../../../domain/model/payment.entity';
import {PaymentApi} from '../../../infrastructure/payment-api';

/**
 * Shipper payment view for a completed trip, redirecting to rating after payment succeeds.
 */
@Component({
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatFormField,
    MatLabel,
    MatError,
    MatIcon,
    MatInput,
    MatProgressBar,
    MatSelect,
    MatOption,
    TranslatePipe
  ],
  selector: 'app-payment-screen',
  styleUrl: './payment-screen.css',
  templateUrl: './payment-screen.html',
})
export class PaymentScreen implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly paymentApi = inject(PaymentApi);

  protected readonly tripId = signal('');
  protected readonly submitting = signal(false);
  protected readonly paid = signal(false);
  protected readonly errorKey = signal<string | null>(null);

  protected readonly form = new FormGroup({
    totalAmount: new FormControl<number>(100, {nonNullable: true, validators: [Validators.required, Validators.min(1)]}),
    method: new FormControl<PaymentMethod>('PAYPAL', {nonNullable: true, validators: [Validators.required]}),
    paymentToken: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('tripId') ?? '';
    this.tripId.set(id);
    if (!id) return;

    this.paymentApi.getPaymentsByTripId(id).subscribe({
      next: payments => {
        if (payments.some(p => p.status === 'COMPLETED')) {
          this.paid.set(true);
        }
      }
    });
  }

  protected goToRating(): void {
    void this.router.navigate(['/shipper/ratings', this.tripId()]);
  }

}