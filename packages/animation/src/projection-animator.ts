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
   * This method does not keep track of the animation state, so it is up to the caller
   * to stop a previously started animation if needed.
   *
   * @returns a reference to the animation
   */
  abstract animate(config: ProjectionAnimationConfig): AnimationRef;
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
