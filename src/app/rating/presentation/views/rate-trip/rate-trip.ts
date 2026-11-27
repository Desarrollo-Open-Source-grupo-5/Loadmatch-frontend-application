import {Component, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpErrorResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatProgressBar} from '@angular/material/progress-bar';
import {TranslatePipe} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {RatingApi} from '../../../infrastructure/rating-api';
import {RaterType} from '../../../domain/model/rating.entity';

/**
 * Trip rating view used by both shippers (US10) and carriers (US51).
 */
@Component({
  imports: [
    ReactiveFormsModule,
    MatButton,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatError,
    MatIcon,
    MatInput,
    MatProgressBar,
    TranslatePipe
  ],
  selector: 'app-rate-trip',
  styleUrl: './rate-trip.css',
  templateUrl: './rate-trip.html',
})
export class RateTrip implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ratingApi = inject(RatingApi);
  private readonly activeProfileStore = inject(ActiveProfileStore);

  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly tripId = signal('');
  protected readonly raterType = signal<RaterType>('SHIPPER');
  protected readonly submitting = signal(false);
  protected readonly submitted = signal(false);
  protected readonly errorKey = signal<string | null>(null);

  protected readonly form = new FormGroup({
    score: new FormControl<number>(5, {nonNullable: true, validators: [Validators.required, Validators.min(1), Validators.max(5)]}),
    comment: new FormControl('', {nonNullable: true, validators: [Validators.maxLength(500)]}),
  });

  ngOnInit(): void {
    this.tripId.set(this.route.snapshot.paramMap.get('tripId') ?? '');
    const role = this.route.snapshot.data['raterType'] as RaterType | undefined;
    if (role === 'CARRIER' || role === 'SHIPPER') {
      this.raterType.set(role);
    }
  }

  protected selectScore(value: number): void {
    this.form.controls.score.setValue(value);
  }
}