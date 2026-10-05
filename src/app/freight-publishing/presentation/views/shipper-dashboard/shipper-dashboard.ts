import { Component } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-shipper-dashboard',
  styleUrl: './shipper-dashboard.css',
  templateUrl: './shipper-dashboard.html',
})
export class ShipperDashboard {
  /**
   * Number of operations listed in the dashboard.
   */
  private static readonly LATEST_OPERATIONS = 5;

  private readonly activeProfileStore = inject(ActiveProfileStore);
  private readonly breakpointObserver = inject(BreakpointObserver);

  /**
   * Freight Publishing store.
   */
  protected readonly store = inject(FreightPublishingStore);

  /**
   * True when a shipper profile is active.
   */
  protected readonly isShipper = this.activeProfileStore.isShipper;

  /**
   * Active shipper profile (business name shown in the greeting).
   */
  protected readonly activeProfile = this.activeProfileStore.activeProfile;

  /**
   * The five most recently created load requests of the shipper.
   */
  protected readonly latestLoadRequests = this.store.latestLoadRequests(ShipperDashboard.LATEST_OPERATIONS);

  /**
   * True on narrow content areas (phones, tablets, small laptops with the side navigation), where cards replace the
   * table.
   */
  protected readonly isHandset = toSignal(
    this.breakpointObserver.observe('(max-width: 1199.98px)').pipe(map(state => state.matches)),
    {initialValue: false}
  );

  /**
   * Columns of the desktop table.
   */
  protected readonly displayedColumns = ['code', 'route', 'pickupAt', 'status', 'actions'];

}
