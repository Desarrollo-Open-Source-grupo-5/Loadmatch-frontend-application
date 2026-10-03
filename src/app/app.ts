import {Component, DOCUMENT, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatIconRegistry} from '@angular/material/icon';
import {TranslateService} from '@ngx-translate/core';
import {Layout} from './shared/presentation/components/layout/layout';

/**
 * Root component.
 */
@Component({
  imports: [Layout],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly iconRegistry = inject(MatIconRegistry);

  /**
   * Creates the root component and initializes i18n and icons.
   */
  constructor() {
    this.translate.addLangs(['en', 'es']);
    this.translate.use('en');
    this.iconRegistry.setDefaultFontSetClass('material-symbols-outlined');
    this.translate.onLangChange
      .pipe(takeUntilDestroyed())
      .subscribe(event => (this.document.documentElement.lang = event.lang));
  }
}
