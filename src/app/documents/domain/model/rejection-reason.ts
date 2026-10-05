/**
 * Why a document was rejected (value object `RejectionReason` of the Document Validation context).
 */
export class RejectionReason {
  readonly #code: string;
  readonly #description: string;

  /**
   * Creates a rejection reason.
   * @param props - Reason code (e.g. `ILLEGIBLE_FILE`) and description.
   */
  constructor(props: { code: string; description: string }) {
    this.#code = props.code;
    this.#description = props.description;
  }

  /**
   * Reason code, e.g. `ILLEGIBLE_FILE`.
   */
  get code(): string {
    return this.#code;
  }

  /**
   * Description stored with the rejection.
   */
  get description(): string {
    return this.#description;
  }
}
