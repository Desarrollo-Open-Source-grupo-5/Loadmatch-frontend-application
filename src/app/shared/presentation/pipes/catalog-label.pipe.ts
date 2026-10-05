import {inject, Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

/**
 * Translates the code of a system catalog (e.g. `document-type.SOAT`) and falls back to the description stored with
 * the data when the key has no translation.
 */
@Pipe({
  name: 'catalogLabel',
  pure: false
})
export class CatalogLabelPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  /**
   * Translates the given key.
   * @param key - Translation key built from the code, e.g. `document-rejection.ILLEGIBLE_FILE`.
   * @param fallback - Stored description shown when the key has no translation.
   * @returns The translation, or the fallback (the key itself when there is no fallback).
   */
  transform(key: string, fallback?: string | null): string {
    const translation: unknown = this.translate.instant(key);
    return typeof translation === 'string' && translation !== key ? translation : fallback || key;
  }
}
