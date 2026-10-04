import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatError, MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {TranslatePipe} from '@ngx-translate/core';
import {LoadRequest} from '../../../domain/model/load-request.entity';

/**
 * Data received by {@link CancelLoadRequestDialog}.
 */
export interface CancelLoadRequestDialogData {
  /**
   * Load request the shipper wants to cancel.
   */
  loadRequest: LoadRequest;
}

/**
 * Confirmation dialog that asks for the cancellation reason.
 */
@Component({
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatError,
    MatFormField,
    MatHint,
    MatLabel,
    MatIcon,
    MatInput,
    TranslatePipe
  ],
  selector: 'app-cancel-load-request-dialog',
  styleUrl: './cancel-load-request-dialog.css',
  templateUrl: './cancel-load-request-dialog.html',
})
export class CancelLoadRequestDialog {
  private readonly dialogRef = inject<MatDialogRef<CancelLoadRequestDialog, string>>(MatDialogRef);

  /**
   * Minimum length of the cancellation reason.
   */
  protected readonly minReasonLength = 5;

  /**
   * Dialog data with the load request to cancel.
   */
  protected readonly data = inject<CancelLoadRequestDialogData>(MAT_DIALOG_DATA);

  /**
   * Form with the cancellation reason.
   */
  protected readonly form = new FormGroup({
    reason: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(this.minReasonLength), Validators.maxLength(200)]
    })
  });

  /**
   * Confirms the cancellation when a valid reason was given.
   */
  protected confirm(): void {
    const reason = this.form.controls.reason;
    if (reason.invalid || !reason.value.trim()) {
      reason.markAsTouched();
      return;
    }
    this.dialogRef.close(reason.value.trim());
  }
}
