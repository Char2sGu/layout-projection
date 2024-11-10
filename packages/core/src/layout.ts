import { mix } from 'popmotion';

import { Coordinate } from './coordinate.js';
import { Transform2D } from './transform.js';

/**
 * Combination of position and size.
 */
export class Layout {
  /**
   * Construct from the current bounding box of a DOM element.
   */
  static fromElement(element: HTMLElement): Layout {
    return new Layout(element.getBoundingClientRect());
  }

  /**
   * Construct from midpoint, width, and height.
   */
  static fromMidpoint(
    midpoint: Coordinate,
    width: number,
    height: number,
  ): Layout {
    return new Layout({
      top: midpoint.y - height / 2,
      left: midpoint.x - width / 2,
      right: midpoint.x + width / 2,
      bottom: midpoint.y + height / 2,
    });
  }

  readonly top: number;
  readonly left: number;
  readonly right: number;
  readonly bottom: number;

  constructor(data: Record<LayoutEdge, number>) {
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

  midpoint(): Coordinate {
    return new Coordinate(
      mix(this.left, this.right, 0.5),
      mix(this.top, this.bottom, 0.5),
    );
  }

  /**
   * Apply a transform to this layout.
   * @param transform transform to be applied
   * @param origin origin to use for this transform
   * @returns a transformed layout
   */
  transform(transform: Transform2D, origin = this.midpoint()): Layout {
    return new Layout({
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
        translate: other.midpoint().x - this.midpoint().x,
        scale: this.width() ? other.width() / this.width() : 1,
      },
      y: {
        translate: other.midpoint().y - this.midpoint().y,
        scale: this.height() ? other.height() / this.height() : 1,
      },
    });
  }
}

export type LayoutEdge = 'top' | 'left' | 'right' | 'bottom';
