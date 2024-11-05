import { mix } from 'popmotion';

import { Point } from './point.js';

/**
 * Combination of position and size.
 */
export class Layout {
  /**
   * Construct from the current bounding box of a DOM element.
   */
  static from(element: HTMLElement): Layout {
    return new Layout(element.getBoundingClientRect());
  }

  readonly top: number;
  readonly left: number;
  readonly right: number;
  readonly bottom: number;

  constructor(data: Pick<Layout, LayoutEdge>) {
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

export type LayoutEdge = 'top' | 'left' | 'right' | 'bottom';
