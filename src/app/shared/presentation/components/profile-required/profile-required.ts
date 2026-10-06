import {Component, input} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';
import {ProfileRole} from '../../../application/active-profile.store';

/**
 * Notice shown by a profile-specific view when no profile of the required role is active.
 */
@Component({
  imports: [RouterLink, MatButton, MatIcon, TranslatePipe],
  selector: 'app-profile-required',
  styleUrl: './profile-required.css',
  templateUrl: './profile-required.html',
})
export class ProfileRequired {
  /**
   * Role required by the view.
   */
  readonly role = input.required<ProfileRole>();
}
