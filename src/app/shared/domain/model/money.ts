/**
 * ISO 4217 currency codes supported by LoadMatch.
 */
export type CurrencyCode = 'PEN';

/**
 * Monetary amount in a given currency.
 */
export class Money {
  readonly #amount: number;
  readonly #currency: CurrencyCode;

  /**
   * Creates a money value object.
   * @param props - Amount and currency code.
   */
  constructor(props: { amount: number; currency: CurrencyCode }) {
    this.#amount = props.amount;
    this.#currency = props.currency;
  }

  /**
   * Creates an amount expressed in Peruvian soles (PEN).
   * @param amount - Amount in soles.
   * @returns The money value object.
   */
  static ofSoles(amount: number): Money {
    return new Money({amount, currency: 'PEN'});
  }

  /**
   * Numeric amount.
   */
  get amount(): number {
    return this.#amount;
  }

  /**
   * Currency code of the amount.
   */
  get currency(): CurrencyCode {
    return this.#currency;
  }

  /**
   * Indicates whether the amount is strictly greater than zero.
   * @returns True for positive amounts.
   */
  isPositive(): boolean {
    return this.#amount > 0;
  }
}
