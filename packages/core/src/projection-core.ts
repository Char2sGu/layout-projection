import { mix } from 'popmotion';

export class BoundingBox {
  static from(element: HTMLElement): BoundingBox {
    return new BoundingBox(element.getBoundingClientRect());
  }

  top: number;
  left: number;
  right: number;
  bottom: number;

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

  midpoint(): { x: number; y: number } {
    return {
      x: mix(this.left, this.right, 0.5),
      y: mix(this.top, this.bottom, 0.5),
    };
  }
}

export type BorderName = 'top' | 'left' | 'right' | 'bottom';

export interface TransformConfig {
  x: TransformAxisConfig;
  y: TransformAxisConfig;
}

export class TransformAxisConfig {
  origin: number;
  scale: number;
  translate: number;

  constructor(data: Omit<TransformAxisConfig, 'apply'>) {
    this.origin = data.origin;
    this.scale = data.scale;
    this.translate = data.translate;
  }

  apply(value: number): number {
    const distanceFromOrigin = value - this.origin;
    const scaled = this.origin + distanceFromOrigin * this.scale;
    const translated = scaled + this.translate;
    return translated;
  }
}
