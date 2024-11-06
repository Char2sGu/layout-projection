/**
 * Transform configuration for both axises in 2D space.
 */
export interface TransformConfig {
  readonly x: TransformAxisConfig;
  readonly y: TransformAxisConfig;
}

/**
 * Transform configuration for a single 2D axis.
 */
export class TransformAxisConfig {
  /**
   * Create a new identity transform.
   */
  static identity(): TransformAxisConfig {
    return new TransformAxisConfig({
      origin: 0,
      translate: 0,
      scale: 1,
    });
  }

  origin: number;

  /**
   * The translate value to apply before scaling.
   */
  translate: number;

  /**
   * The scale factor to apply after translating.
   */
  scale: number;

  constructor(data: Omit<TransformAxisConfig, 'apply'>) {
    this.origin = data.origin;
    this.translate = data.translate;
    this.scale = data.scale;
  }

  /**
   * Apply the transform to a value on the same axis.
   */
  apply(value: number): number {
    return this.origin + (value - this.origin + this.translate) * this.scale;
  }
}
