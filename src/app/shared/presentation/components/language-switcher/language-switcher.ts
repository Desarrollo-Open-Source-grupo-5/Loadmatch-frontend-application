import {Component, inject} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';

/**
 * Toggle group that switches the interface language (English / Spanish) without reloading the page.
 */
@Component({
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,
    TranslatePipe
  ],
  selector: 'app-language-switcher',
  styleUrl: './language-switcher.css',
  templateUrl: './language-switcher.html',
})
export class LanguageSwitcher {
  private readonly translate = inject(TranslateService);

  /**
   * Language currently in use (reactive).
   */
  protected readonly currentLang = this.translate.currentLang;

  /**
   * Languages registered in the root component.
   */
  protected readonly languages: readonly string[] = this.translate.getLangs();

  /**
   * Switches the interface language.
   * @param language - Language code (`en` or `es`).
   */
  useLanguage = (language: string): void => {
    this.translate.use(language);
  };
}
