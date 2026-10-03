/**
 * Accumulated rating of a shipper or carrier.
 */
export class Reputation {
  readonly #average: number;
  readonly #totalRatings: number;

  /**
   * Creates a reputation value object.
   * @param props - Average score (0-5) and number of ratings received.
   */
  constructor(props: { average: number; totalRatings: number }) {
    this.#average = props.average;
    this.#totalRatings = props.totalRatings;
  }

  /**
   * Average score between 0 and 5.
   */
  get average(): number {
    return this.#average;
  }

  /**
   * Number of ratings received.
   */
  get totalRatings(): number {
    return this.#totalRatings;
  }

  /**
   * Indicates whether the profile has received at least one rating.
   * @returns True when there are ratings.
   */
  hasRatings(): boolean {
    return this.#totalRatings > 0;
  }
}
