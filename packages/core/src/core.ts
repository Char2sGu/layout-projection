import { mix } from 'popmotion';

export class BoundingBox {
  top: number;
  left: number;
  right: number;
  bottom: number;

  constructor(data: Omit<BoundingBox, 'width' | 'height' | 'midpoint'>) {
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

export interface BorderRadiusConfig {
  topLeft: BorderRadiusCornerConfig;
  topRight: BorderRadiusCornerConfig;
  bottomLeft: BorderRadiusCornerConfig;
  bottomRight: BorderRadiusCornerConfig;
}

export interface BorderRadiusCornerConfig {
  x: number;
  y: number;
}
