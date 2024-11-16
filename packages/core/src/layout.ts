import { Coordinate } from './coordinate.js';
import { Equatable } from './equatable.js';
import { Transform2D } from './transform.js';

/**
 * Combination of position and size.
 */
export class Layout implements Equatable {
  /**
   * Return the current layout of a DOM element.
   */
  static fromElement(element: HTMLElement): Layout {
    const rect = element.getBoundingClientRect();
    return new Layout(
      rect.top,
      rect.left,
      rect.right,
      rect.bottom,
      rect.width,
      rect.height,
    );
  }

  /**
   * Return the layout constructed from midpoint and size.
   */
  static fromMidpoint(config: {
    midpoint: Coordinate;
    width: number;
    height: number;
  }): Layout {
    const { midpoint, width, height } = config;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    return new Layout(
      midpoint.y - halfHeight,
      midpoint.x - halfWidth,
      midpoint.x + halfWidth,
      midpoint.y + halfHeight,
      width,
      height,
      midpoint,
    );
  }

  /**
   * Return the layout constructed from top-left coordinate and size.
   */
  static fromTopLeft(config: {
    topLeft: Coordinate;
    width: number;
    height: number;
  }): Layout {
    const { topLeft, width, height } = config;
    return new Layout(
      topLeft.y,
      topLeft.x,
      topLeft.x + width,
      topLeft.y + height,
      width,
      height,
    );
  }

  /**
   * Return the layout constructed from four edges.
   * @param config
   * @returns
   */
  static fromEdges(config: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  }): Layout {
    const { top, left, right, bottom } = config;
    return new Layout(left, top, right, bottom, right - left, bottom - top);
  }

  // eslint-disable-next-line max-params -- private
  private constructor(
    readonly top: number,
    readonly left: number,
    readonly right: number,
    readonly bottom: number,
    readonly width: number,
    readonly height: number,
    midpoint?: Coordinate,
  ) {
    this.#midpoint = midpoint;
  }

  #midpoint?: Coordinate;
  get midpoint(): Coordinate {
    this.#midpoint ??= new Coordinate(
      (this.left + this.right) / 2,
      (this.top + this.bottom) / 2,
    );
    return this.#midpoint;
  }

  equals(other: this): boolean {
    return (
      this.top === other.top &&
      this.left === other.left &&
      this.right === other.right &&
      this.bottom === other.bottom
    );
  }

  /**
   * Apply a transform to this layout.
   * @param transform transform to be applied
   * @param origin origin to use for this transform
   * @returns a transformed layout
   */
  transform(transform: Transform2D, origin = this.midpoint): Layout {
    return Layout.fromEdges({
      top: transform.y.apply(origin.y, this.top),
      left: transform.x.apply(origin.x, this.left),
      right: transform.x.apply(origin.x, this.right),
      bottom: transform.y.apply(origin.y, this.bottom),
    });
  }

  /**
   * Compute the 2D transform required to transform this layout to another layout.
   * Scale is set to 1 if the width or height of this layout is 0.
   * @param other the destination layout
   * @returns 2D transform
   */
  transformFor(other: Layout): Transform2D {
    return Transform2D.config({
      x: {
        translate: other.midpoint.x - this.midpoint.x,
        scale: this.width ? other.width / this.width : 1,
      },
      y: {
        translate: other.midpoint.y - this.midpoint.y,
        scale: this.height ? other.height / this.height : 1,
      },
    });
  }
}
