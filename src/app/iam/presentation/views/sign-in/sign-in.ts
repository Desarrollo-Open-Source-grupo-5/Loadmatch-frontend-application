import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatInput} from '@angular/material/input';
import {MatProgressBar} from '@angular/material/progress-bar';
import {TranslatePipe} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {ProfilesApi} from '../../../../profiles/infrastructure/profiles-api';
import {SessionStore} from '../../../application/session.store';
import {AuthenticatedUser} from '../../../domain/model/authenticated-user.entity';
import {SignInCredentials} from '../../../domain/model/sign-in-credentials';

/**
 * Sign-in view: authenticates shippers and carriers against the LoadMatch Platform and redirects them to the home
 * view of their role.
 */
@Component({
  imports: [
    ReactiveFormsModule,
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
  selector: 'app-sign-in',
  styleUrl: './sign-in.css',
  templateUrl: './sign-in.html',
})
export class SignIn {
  private readonly router = inject(Router);
  private readonly profilesApi = inject(ProfilesApi);
  private readonly activeProfileStore = inject(ActiveProfileStore);

  /**
   * Session store.
   */
  protected readonly store = inject(SessionStore);

  /**
   * Sign-in form.
   */
  protected readonly form = new FormGroup({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  /**
   * Whether the password is shown in plain text.
   */
  protected readonly passwordVisible = signal(false);

  /**
   * Sends the credentials when the form is valid.
   */
  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const credentials = new SignInCredentials(this.form.getRawValue());
    this.store.signIn(credentials, user => this.onSignedIn(user));
  }

  /**
   * Shows or hides the password.
   */
  protected togglePasswordVisibility(): void {
    this.passwordVisible.update(visible => !visible);
  }

  /**
   * Links the user with its shipper or carrier profile and redirects it to the home view of its role.
   * When the profile cannot be found, the email address is shown in the toolbar instead of the profile name.
   * @param user - Authenticated user.
   */
  private onSignedIn(user: AuthenticatedUser): void {
    this.profilesApi.getProfileReferenceByUserId(user.id, user.role).subscribe({
      next: profile => this.enter(user, profile.profileId, profile.displayName),
      error: () => this.enter(user, '', user.email)
    });
  }

  /**
   * Activates the profile of the user and opens the home view of its role.
   * @param user - Authenticated user.
   * @param profileId - Identifier of the shipper or carrier profile.
   * @param displayName - Name shown in the toolbar.
   */
  private enter(user: AuthenticatedUser, profileId: string, displayName: string): void {
    this.activeProfileStore.select({role: user.role, profileId, displayName});
    this.router.navigate([user.isShipper() ? '/shipper/dashboard' : '/carrier/available-loads']).then();
  }
}
