import {Component, computed, effect, inject, untracked} from '@angular/core';
import {MatButton} from '@angular/material/button';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {TranslatePipe} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {ProfileRequired} from '../../../../shared/presentation/components/profile-required/profile-required';
import {CatalogLabelPipe} from '../../../../shared/presentation/pipes/catalog-label.pipe';
import {LocalizedDatePipe} from '../../../../shared/presentation/pipes/localized-date.pipe';
import {DocumentsStore} from '../../../application/documents.store';
import {ValidationStatusChip} from '../../components/validation-status-chip/validation-status-chip';

/**
 * "Documents": validation status of each mandatory document of the active carrier, with expiration and upload dates,
 * the rejection reason and what to do next, a warning for an approved document that expires in 15 days or fewer and
 * how many are approved.
 */
@Component({
  imports: [
    MatButton,
    MatCard,
    MatCardContent,
    MatIcon,
    MatProgressBar,
    TranslatePipe,
    CatalogLabelPipe,
    LocalizedDatePipe,
    ValidationStatusChip,
    ProfileRequired
  ],
  selector: 'app-document-validation-status',
  styleUrl: './document-validation-status.css',
  templateUrl: './document-validation-status.html',
})
export class DocumentValidationStatus {
  private readonly activeProfileStore = inject(ActiveProfileStore);

  /**
   * Document Validation store.
   */
  protected readonly store = inject(DocumentsStore);

  /**
   * True when a carrier profile is active.
   */
  protected readonly isCarrier = this.activeProfileStore.isCarrier;

  /**
   * Date the view was opened, passed to the date-dependent domain methods.
   */
  protected readonly today = new Date();

  /**
   * Number of mandatory documents shown as approved (an approved document past its expiration date counts as
   * expired).
   */
  protected readonly approvedCount = computed(() =>
    this.store.requiredDocuments().filter(item => item.displayStatus(this.today) === 'APPROVED').length
  );

  /**
   * Creates the view and loads the documents of the active carrier every time it changes.
   */
  constructor() {
    effect(() => {
      const carrierId = this.activeProfileStore.carrierId();
      untracked(() => {
        if (carrierId) {
          this.store.loadCarrierDocuments(carrierId);
        }
      });
    });
  }
}
