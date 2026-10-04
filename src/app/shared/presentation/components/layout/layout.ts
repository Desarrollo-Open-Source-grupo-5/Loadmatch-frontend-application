import {Component, computed, inject, viewChild} from '@angular/core';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {BreakpointObserver} from '@angular/cdk/layout';
import {NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {filter, map} from 'rxjs';
import {MatToolbar} from '@angular/material/toolbar';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from '@angular/material/sidenav';
import {MatTooltip} from '@angular/material/tooltip';
import {TranslatePipe} from '@ngx-translate/core';
import {ActiveProfileStore} from '../../../application/active-profile.store';
import {LanguageSwitcher} from '../language-switcher/language-switcher';
import {FooterContent} from '../footer-content/footer-content';

/**
 * Entry of the side navigation.
 */
export interface NavigationOption {
  /**
   * Router link of the entry.
   */
  link: string;
  /**
   * Translation key of the label.
   */
  label: string;
  /**
   * Material Symbols icon name.
   */
  icon: string;
}

/**
 * Application shell: toolbar (brand, active profile, "Switch profile", language switcher), side navigation for the
 * active profile, routed content and footer.
 */
@Component({
  imports: [
    MatToolbar,
    MatButton,
    MatIconButton,
    MatIcon,
    MatSidenav,
    MatSidenavContainer,
    MatSidenavContent,
    MatTooltip,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    TranslatePipe,
    LanguageSwitcher,
    FooterContent
  ],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout {
  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly router = inject(Router);
  private readonly breakpointObserver = inject(BreakpointObserver);

  /**
   * Active demo profile.
   */
  protected readonly activeProfile = this.activeProfileStore.activeProfile;

  /**
   * True on narrow screens, where the side navigation becomes an overlay.
   */
  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe('(max-width: 959.98px)').pipe(map(state => state.matches)),
    {initialValue: false}
  );

  /**
   * Navigation entries for the active profile.
   */
  protected readonly options = computed<NavigationOption[]>(() => {
    switch (this.activeProfile()?.role) {
      case 'SHIPPER':
        return [
          {link: '/shipper/load-requests', label: 'nav.my-loads', icon: 'inventory_2'},
          {link: '/shipper/load-requests/new', label: 'nav.publish-load', icon: 'add_box'}
        ];
      case 'CARRIER':
        return [{link: '/carrier/available-loads', label: 'nav.find-loads', icon: 'travel_explore'}];
      default:
        return [];
    }
  });

  /**
   * Translation key of the active role label.
   */
  protected readonly roleLabel = computed(() =>
    this.activeProfileStore.isShipper() ? 'nav.shipper-role' : 'nav.carrier-role'
  );

  private readonly sidenavContent = viewChild(MatSidenavContent);

  /**
   * Creates the layout and scrolls the content back to the top after every navigation (the scrolling element is the
   * side navigation content, not the window).
   */
  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(() => this.sidenavContent()?.scrollTo({top: 0}));
  }

  /**
   * Clears the active profile and returns to the profile chooser.
   */
  protected switchProfile(): void {
    this.activeProfileStore.clear();
    this.router.navigate(['/home']).then();
  }
}
