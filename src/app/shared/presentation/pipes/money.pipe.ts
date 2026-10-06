import {inject, Pipe, PipeTransform} from '@angular/core';
import {formatNumber} from '@angular/common';
import {TranslateService} from '@ngx-translate/core';
import {Money} from '../../domain/model/money';
import {toLocaleId} from './app-locale';

/**
 * Formats a {@link Money} value as `S/ 3,600.00`.
 */
@Pipe({
  name: 'money',
  pure: false
})
export class MoneyPipe implements PipeTransform {
  private static readonly SYMBOLS: Record<Money['currency'], string> = {PEN: 'S/'};

  private readonly translate = inject(TranslateService);

  /**
   * Formats the given amount with its currency symbol.
   * @param value - Money to format.
   * @returns The formatted amount, or an empty string for null values.
   */
  transform(value: Money | null | undefined): string {
    if (!value) {
      return '';
    }
    const amount = formatNumber(value.amount, toLocaleId(this.translate.getCurrentLang()), '1.2-2');
    return `${MoneyPipe.SYMBOLS[value.currency]} ${amount}`;
  }
}
