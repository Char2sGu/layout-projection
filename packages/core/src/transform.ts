/**
 * Transform configuration for both axises in 2D space.
 */
export interface TransformConfig {
  x: TransformAxisConfig;
  y: TransformAxisConfig;
}

/**
 * Transform configuration for a single 2D axis.
 */
export class TransformAxisConfig {
  origin: number;
  scale: number;
  translate: number;

  constructor(data: Omit<TransformAxisConfig, 'apply'>) {
    this.origin = data.origin;
    this.scale = data.scale;
    this.translate = data.translate;
  }

  /**
   * Apply the transform to a value on the same axis.
   */
  apply(value: number): number {
    const distanceFromOrigin = value - this.origin;
    const scaled = this.origin + distanceFromOrigin * this.scale;
    const translated = scaled + this.translate;
    return translated;
  }
}
