import { Coordinate } from './coordinate.js';

/**
 * A linear transform. First translate, and then scale.
 */
export class Transform {
  /**
   * Constructs an identity transform.
   * Applying such transform to any value has no effect.
   */
  static identity(): Transform {
    return new Transform(0, 1);
  }

  /**
   * Construct a transform from a configuration object.
   */
  static config(config: TransformConfig): Transform {
    return new Transform(config.translate, config.scale);
  }

  private constructor(readonly translate: number, readonly scale: number) {
    if (scale === 0) throw new Error('scale cannot be zero');
  }

  /**
   * Apply the transform to a value in the space.
   * @param origin the origin for the transform
   * @param value the value to be transformed
   * @returns the transformed value
   */
  apply(origin: number, value: number): number {
    return origin + this.translate + (value - origin) * this.scale;
  }
}

export interface TransformConfig {
  translate: number;
  scale: number;
}

/**
 * A two-dimensional transform. First translate, and then scale.
 */
export class Transform2D {
  /**
   * Constructs an identity transform.
   * Applying such transform to any coordinate has no effect.
   */
  static identity(): Transform2D {
    return new Transform2D(Transform.identity(), Transform.identity());
  }

  /**
   * Construct a transform from a configuration object.
   */
  static config(config: Transform2DConfig): Transform2D {
    return new Transform2D(
      Transform.config(config.x),
      Transform.config(config.y),
    );
  }

  private constructor(readonly x: Transform, readonly y: Transform) {}

  /**
   * Apply the transform to a coordinate in the space.
   * @param origin the origin coordinate for the transform
   * @param value the coordinate to be transformed
   * @returns the transformed coordinate
   */
  apply(origin: Coordinate, value: Coordinate): Coordinate {
    return new Coordinate(
      this.x.apply(origin.x, value.x),
      this.y.apply(origin.y, value.y),
    );
  }
}

export interface Transform2DConfig {
  x: TransformConfig;
  y: TransformConfig;
}
