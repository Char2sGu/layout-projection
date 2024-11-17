import { Equatable } from '../../equality.js';

export class BorderRadiusConfig implements Equatable {
  topLeft: BorderRadiusCornerConfig;
  topRight: BorderRadiusCornerConfig;
  bottomLeft: BorderRadiusCornerConfig;
  bottomRight: BorderRadiusCornerConfig;

  constructor(
    config: Pick<
      BorderRadiusConfig,
      'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
    >,
  ) {
    this.topLeft = config.topLeft;
    this.topRight = config.topRight;
    this.bottomLeft = config.bottomLeft;
    this.bottomRight = config.bottomRight;
  }

  equals(other: this): boolean {
    return (
      this.topLeft.equals(other.topLeft) &&
      this.topRight.equals(other.topRight) &&
      this.bottomLeft.equals(other.bottomLeft) &&
      this.bottomRight.equals(other.bottomRight)
    );
  }
}

export class BorderRadiusCornerConfig implements Equatable {
  readonly x: number;
  readonly y: number;

  constructor(config: Pick<BorderRadiusCornerConfig, 'x' | 'y'>) {
    this.x = config.x;
    this.y = config.y;
  }

  equals(other: this): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
