import {Component, DestroyRef, inject, input, output, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {TranslatePipe} from '@ngx-translate/core';
import {LocalizedDatePipe} from '../../../../shared/presentation/pipes/localized-date.pipe';
import {
  INCIDENT_EVIDENCE_TYPES,
  MAX_INCIDENT_EVIDENCE_BYTES,
  TripIncidentsService
} from '../../../application/trip-incidents.service';
import {INCIDENT_TYPES, IncidentType, TripIncident} from '../../../domain/model/trip-incident';

@Component({
  selector: 'app-trip-incidents',
  imports: [
    LocalizedDatePipe, MatButtonModule, MatExpansionModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatSelectModule, ReactiveFormsModule, TranslatePipe
  ],
  templateUrl: './trip-incidents.html',
  styleUrl: './trip-incidents.css'
})
export class TripIncidents {
  private readonly service = inject(TripIncidentsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly tripId = input.required<string>();
  readonly canReport = input(false);
  readonly incidentReported = output<void>();

  protected readonly incidentTypes = INCIDENT_TYPES;
  protected readonly acceptedTypes = INCIDENT_EVIDENCE_TYPES.join(',');
  protected readonly form = new FormGroup({
    type: new FormControl<IncidentType | null>(null, Validators.required),
    description: new FormControl('', {nonNullable: true, validators: Validators.maxLength(500)})
  });
  protected readonly evidence = signal<File | null>(null);
  protected readonly evidenceError = signal<string | null>(null);
  protected readonly incidents = signal<TripIncident[]>([]);
  protected readonly loading = signal(false);
  protected readonly listFailed = signal(false);
  protected readonly formOpen = signal(false);
  protected readonly submitting = signal(false);
  protected readonly reportFailed = signal(false);
  protected readonly reported = signal(false);
  protected readonly downloadingId = signal<string | null>(null);
  protected readonly downloadFailed = signal(false);

  protected load(): void {
    if (this.loading() || this.submitting()) {
      return;
    }
    this.loading.set(true);
    this.listFailed.set(false);
    this.service.list(this.tripId()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: incidents => {
        this.incidents.set(incidents);
        this.loading.set(false);
      },
      error: () => {
        this.listFailed.set(true);
        this.loading.set(false);
      }
    });
  }

  protected selectEvidence(inputElement: HTMLInputElement): void {
    const file = inputElement.files?.[0] ?? null;
    this.evidence.set(null);
    this.evidenceError.set(null);

    if (!file) {
      return;
    }
    if (!INCIDENT_EVIDENCE_TYPES.includes(file.type)) {
      this.evidenceError.set('trip-incidents.evidence-type-error');
    } else if (file.size === 0 || file.size > MAX_INCIDENT_EVIDENCE_BYTES) {
      this.evidenceError.set('trip-incidents.evidence-size-error');
    } else {
      this.evidence.set(file);
    }
    if (this.evidenceError()) {
      inputElement.value = '';
    }
  }

  protected cancelReport(): void {
    this.form.reset();
    this.evidence.set(null);
    this.evidenceError.set(null);
    this.reportFailed.set(false);
    this.formOpen.set(false);
  }

  protected submit(): void {
    const {type, description} = this.form.getRawValue();
    const evidence = this.evidence();
    if (!this.canReport() || this.reported() || this.loading() || this.submitting()
      || this.form.invalid || !type || !evidence) {
      return;
    }

    this.submitting.set(true);
    this.reportFailed.set(false);
    this.service.report(this.tripId(), type, description, evidence).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: incident => {
        this.incidents.update(incidents => [incident, ...incidents.filter(item => item.id !== incident.id)]);
        this.submitting.set(false);
        this.reported.set(true);
        this.cancelReport();
        this.incidentReported.emit();
      },
      error: () => {
        this.reportFailed.set(true);
        this.submitting.set(false);
      }
    });
  }

  protected download(incident: TripIncident): void {
    if (this.downloadingId()) {
      return;
    }
    this.downloadingId.set(incident.id);
    this.downloadFailed.set(false);
    this.service.downloadEvidence(this.tripId(), incident.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: file => {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = `incident-${incident.id}.${file.type === 'image/png' ? 'png' : 'jpg'}`;
        link.click();
        setTimeout(() => URL.revokeObjectURL(url), 0);
        this.downloadingId.set(null);
      },
      error: () => {
        this.downloadFailed.set(true);
        this.downloadingId.set(null);
      }
    });
  }
}
