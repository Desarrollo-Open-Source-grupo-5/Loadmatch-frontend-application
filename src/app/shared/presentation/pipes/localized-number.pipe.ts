import {inject, Pipe, PipeTransform} from '@angular/core';
import {formatNumber} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {toLocaleId} from './app-locale';

/**
 * Formats a number with the locale of the language selected in the language switcher.
 */
@Pipe({
  name: 'localizedNumber',
  pure: false
})
export class LocalizedNumberPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  /**
   * Formats the given number.
   * @param value - Number to format.
   * @param digitsInfo - Angular digits info (defaults to `1.0-1`).
   * @returns The formatted number, or an empty string for null values.
   */
  transform(value: number | null | undefined, digitsInfo = '1.0-1'): string {
    return value === null || value === undefined
      ? ''
      : formatNumber(value, toLocaleId(this.translate.getCurrentLang()), digitsInfo);
  }
}
