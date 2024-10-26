import { mix } from 'popmotion';

/**
 * A point in 2D space.
 */
export class Point {
  constructor(readonly x: number, readonly y: number) {}
}

/**
 * Combination of position and size.
 */
export class BoundingBox {
  /**
   * Construct from the current bounding box of a DOM element.
   */
  static from(element: HTMLElement): BoundingBox {
    return new BoundingBox(element.getBoundingClientRect());
  }

  readonly top: number;
  readonly left: number;
  readonly right: number;
  readonly bottom: number;

  constructor(data: Pick<BoundingBox, BorderName>) {
    this.top = data.top;
    this.left = data.left;
    this.right = data.right;
    this.bottom = data.bottom;
  }

  width(): number {
    return this.right - this.left;
  }

  height(): number {
    return this.bottom - this.top;
  }

  midpoint(): Point {
    return new Point(
      mix(this.left, this.right, 0.5),
      mix(this.top, this.bottom, 0.5),
    );
  }
}

export type BorderName = 'top' | 'left' | 'right' | 'bottom';

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
