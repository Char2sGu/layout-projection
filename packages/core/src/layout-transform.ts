import { Layout } from './layout.js';
import { Transform2D } from './transform.js';

/**
 * Apply a 2D transform to a layout.
 * @param origin the origin of the transform;
 * uses the midpoint of the by default
 * @returns a transformed new layout
 */
export function transformLayout(
  layout: Layout,
  transform: Transform2D,
  origin = layout.midpoint,
): Layout {
  return Layout.fromEdges({
    top: transform.y.apply(origin.y, layout.top),
    left: transform.x.apply(origin.x, layout.left),
    right: transform.x.apply(origin.x, layout.right),
    bottom: transform.y.apply(origin.y, layout.bottom),
  });
}

/**
 * Compute the 2D transform required to transform the one layout to another layout.
 * Scale is set to 1 if the width or height of the source layout is 0.
 * @param other the destination layout
 */
export function computeTransformBetween(
  source: Layout,
  target: Layout,
): Transform2D {
  return Transform2D.config({
    x: {
      translate: target.midpoint.x - source.midpoint.x,
      scale: source.width ? target.width / source.width : 1,
    },
    y: {
      translate: target.midpoint.y - source.midpoint.y,
      scale: source.height ? target.height / source.height : 1,
    },
  });
}
