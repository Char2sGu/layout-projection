import { Layout } from '@layout-projection/core';
import { mix } from 'popmotion';

import { MetadataManager, MetadataToken } from './metadata.js';
import {
  ProjectionAnimationFrameContext,
  ProjectionAnimationHandler,
} from './projection-animation-handler.js';

/**
 * When applied to a projection node,
 * decides whether to skip the position animation of the layout.
 * @see LayoutProjectionAnimationHandler
 */
export const SKIP_POSITION = new MetadataToken<boolean>('SKIP_POSITION');

/**
 * When applied to a projection node,
 * decides whether to skip the size animation of the layout.
 * @see LayoutProjectionAnimationHandler
 */
export const SKIP_SIZE = new MetadataToken<boolean>('SKIP_SIZE');

/**
 * Animation handler of the layout of a projection node.
 * Projects the node to different layouts as the animation progresses.
 * {@link SKIP_POSITION} and {@link SKIP_SIZE} metadata controls the animation.
 */
export class LayoutProjectionAnimationHandler
  implements ProjectionAnimationHandler
{
  constructor(
    private readonly framer: LayoutAnimationFramer,
    private readonly metadata: MetadataManager,
  ) {}

  handleFrame(context: ProjectionAnimationFrameContext): void {
    const { node, from, to, progress } = context;
    const skipPosition = this.metadata.resolve(node, SKIP_POSITION);
    const skipSize = this.metadata.resolve(node, SKIP_SIZE);
    const animatePosition = !skipPosition;
    const animateSize = !skipSize;
    if (!from.measurement || !to.measurement) return;
    const layout = this.framer.frame({
      from: from.measurement.layout,
      to: to.measurement.layout,
      progress,
      animatePosition,
      animateSize,
    });
    node.project(layout);
  }
}

export interface LayoutAnimationFrameConfig {
  readonly from: Layout;
  readonly to: Layout;
  readonly progress: number;
  /**
   * Whether to animate the position of the layout.
   */
  readonly animatePosition: boolean;
  /**
   * Whether to animate the size of the layout.
   */
  readonly animateSize: boolean;
}

/**
 * Internal service of {@link LayoutProjectionAnimationHandler} that
 * generates a {@link Layout} object for a specific animation frame.
 */
export class LayoutAnimationFramer {
  frame(config: LayoutAnimationFrameConfig): Layout {
    const { from, to, progress, animatePosition, animateSize } = config;
    if (animatePosition && animateSize) {
      return Layout.fromEdges({
        top: mix(from.top, to.top, progress),
        left: mix(from.left, to.left, progress),
        right: mix(from.right, to.right, progress),
        bottom: mix(from.bottom, to.bottom, progress),
      });
    } else if (animatePosition) {
      const top = mix(from.top, to.top, progress);
      const left = mix(from.left, to.left, progress);
      return Layout.fromEdges({
        top,
        left,
        right: left + to.width,
        bottom: top + to.height,
      });
    } else if (animateSize) {
      return Layout.fromEdges({
        top: to.top,
        left: to.left,
        right: to.left + mix(from.width, to.width, progress),
        bottom: to.top + mix(from.height, to.height, progress),
      });
    }
    return to;
  }
}
