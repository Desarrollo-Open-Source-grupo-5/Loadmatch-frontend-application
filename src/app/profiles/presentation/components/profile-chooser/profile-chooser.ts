import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatCard, MatCardAvatar, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatProgressBar} from '@angular/material/progress-bar';
import {TranslatePipe} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../../shared/application/active-profile.store';
import {LocalizedNumberPipe} from '../../../../shared/presentation/pipes/localized-number.pipe';
import {ProfilesStore} from '../../../application/profiles.store';
import {Shipper} from '../../../domain/model/shipper.entity';
import {Carrier} from '../../../domain/model/carrier.entity';

/**
 * Two cards ("Enter as Shipper" / "Enter as Carrier") listing the demo profiles stored in the API.
 */
@Component({
  imports: [
    MatCard,
    MatCardHeader,
    MatCardAvatar,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatIcon,
    MatProgressBar,
    TranslatePipe,
    LocalizedNumberPipe
  ],
  selector: 'app-profile-chooser',
  styleUrl: './profile-chooser.css',
  templateUrl: './profile-chooser.html',
})
export class ProfileChooser {
  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly router = inject(Router);

  /**
   * Profiles store with the demo shippers and carriers.
   */
  protected readonly store = inject(ProfilesStore);

  /**
   * Enters the application as a shipper and opens the dashboard.
   * @param shipper - Chosen shipper.
   */
  protected enterAsShipper(shipper: Shipper): void {
    this.activeProfileStore.select({role: 'SHIPPER', profileId: shipper.id, displayName: shipper.businessName});
    this.router.navigate(['/shipper/dashboard']).then();
  }

  /**
   * Enters the application as a carrier and opens "Find Loads".
   * @param carrier - Chosen carrier.
   */
  protected enterAsCarrier(carrier: Carrier): void {
    this.activeProfileStore.select({role: 'CARRIER', profileId: carrier.id, displayName: carrier.fullName()});
    this.router.navigate(['/carrier/available-loads']).then();
  }
}
