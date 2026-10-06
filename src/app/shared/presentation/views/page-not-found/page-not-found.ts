import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton} from '@angular/material/button';

/**
 * View shown for unknown routes.
 */
@Component({
  imports: [
    TranslatePipe,
    MatButton
  ],
  selector: 'app-page-not-found',
  styleUrl: './page-not-found.css',
  templateUrl: './page-not-found.html',
})
export class PageNotFound implements OnInit {

  /**
   * Path that could not be matched.
   */
  protected invalidPath = '';

  private route: ActivatedRoute = inject(ActivatedRoute);

  private router: Router = inject(Router);

  /**
   * Captures the invalid path from the activated route.
   */
  ngOnInit() {
    this.invalidPath = this.route.snapshot.url.map(url => url.path).join('/');
  }

  /**
   * Navigates back to the home view.
   */
  protected navigateToHome() {
    this.router.navigate(['/home']).then();
  }
}
