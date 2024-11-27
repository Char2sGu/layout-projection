import { ProjectionNode } from '@layout-projection/core';

import { ProjectionNodeSnapshot } from './projection-node-snapshot.js';

/**
 * Handler of a single animation frame for a projection node.
 * It is expected to mutate the projection node based on the given context.
 */
export abstract class ProjectionAnimationHandler {
  abstract handleFrame(context: ProjectionAnimationFrameContext): void;
}

/**
 * Essential information about an animation frame of a projection node
 * for {@link ProjectionAnimationHandler} to handle.
 */
export interface ProjectionAnimationFrameContext {
  /**
   * The projection node that is being animated.
   */
  readonly node: ProjectionNode;
  /**
   * The snapshot of the projection node at the beginning of the animation.
   */
  readonly from: ProjectionNodeSnapshot;
  /**
   * The snapshot of the projection node at the end of the animation.
   */
  readonly to: ProjectionNodeSnapshot;
  /**
   * The progress of the animation in the range [0, 1].
   */
  readonly progress: number;
}
