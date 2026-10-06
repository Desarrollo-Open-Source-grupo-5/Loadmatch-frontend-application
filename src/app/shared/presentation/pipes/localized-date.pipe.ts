import {inject, Pipe, PipeTransform} from '@angular/core';
import {formatDate} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {toLocaleId} from './app-locale';

/**
 * Formats a date with the locale of the language selected in the language switcher.
 */
@Pipe({
  name: 'localizedDate',
  pure: false
})
export class LocalizedDatePipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  /**
   * Formats the given date.
   * @param value - Date to format.
   * @param format - Angular date format (defaults to `medium`).
   * @returns The formatted date, or an empty string for null values.
   */
  transform(value: Date | null | undefined, format = 'medium'): string {
    return value ? formatDate(value, format, toLocaleId(this.translate.getCurrentLang())) : '';
  }
}
