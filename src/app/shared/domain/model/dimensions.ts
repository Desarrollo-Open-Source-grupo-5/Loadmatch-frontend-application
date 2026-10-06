/**
 * Length, width and height of a load or of a vehicle cargo area, in metres.
 */
export class Dimensions {
  readonly #lengthM: number;
  readonly #widthM: number;
  readonly #heightM: number;

  /**
   * Creates a dimensions value object.
   * @param props - Length, width and height in metres.
   */
  constructor(props: { lengthM: number; widthM: number; heightM: number }) {
    this.#lengthM = props.lengthM;
    this.#widthM = props.widthM;
    this.#heightM = props.heightM;
  }

  /**
   * Length in metres.
   */
  get lengthM(): number {
    return this.#lengthM;
  }

  /**
   * Width in metres.
   */
  get widthM(): number {
    return this.#widthM;
  }

  /**
   * Height in metres.
   */
  get heightM(): number {
    return this.#heightM;
  }

  /**
   * Computes the volume.
   * @returns Volume in cubic metres.
   */
  volumeM3(): number {
    return this.#lengthM * this.#widthM * this.#heightM;
  }

  /**
   * Checks whether these dimensions fit inside other dimensions (no rotation).
   * @param other - Container dimensions.
   * @returns True when every side is less than or equal to the container side.
   */
  fitsIn(other: Dimensions): boolean {
    return (
      this.#lengthM <= other.lengthM && this.#widthM <= other.widthM && this.#heightM <= other.heightM
    );
  }
}
