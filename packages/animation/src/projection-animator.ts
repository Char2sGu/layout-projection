import { ProjectionNode } from '@layout-projection/core';

import { AnimationConfig } from './animation-config.js';
import { AnimationRef } from './animation-ref.js';
import { ProjectionNodeSnapshot } from './projection-node-snapshot.js';

/**
 * Animator of projection nodes.
 */
export abstract class ProjectionAnimator {
  /**
   * Animate the projection nodes from one snapshot to another.
   *
   * Animating a parent projection node will not affect the layout of its child
   * projection nodes, enabling nested parallel animations.  Note that child elements
   * that are not projection nodes WILL be affected by the animation.
   *
   * This method should keep track of all animations and appropriately
   * process the previous pending animation before starting a new one
   * on the same node.
   *
   * @returns a reference to the animation
   */
  abstract animate(
    config: ProjectionAnimationConfig,
  ): AnimationRef<ProjectionAnimationConfig>;
}

export interface ProjectionAnimationConfig extends AnimationConfig {
  /**
   * The target node to animate.
   */
  readonly node: ProjectionNode;
  /**
   * The snapshot of the target node to begin the animation.
   */
  readonly from: ProjectionNodeSnapshot;
  /**
   * The snapshot of the target node to end the animation.
   */
  readonly to: ProjectionNodeSnapshot;
}
