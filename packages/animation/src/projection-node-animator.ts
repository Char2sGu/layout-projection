import { ProjectionNode } from '@layout-projection/core';

import { AnimationConfig } from './animation-config.js';
import { AnimationRef } from './animation-ref.js';
import { ProjectionNodeSnapshot } from './projection-node-snapshot.js';

/**
 * Animator of a single projection node.
 */
export interface ProjectionNodeAnimator {
  /**
   * Animate the projection node from one snapshot to another.
   * @param config
   */
  animate(config: ProjectionNodeAnimationConfig): AnimationRef;
}

export interface ProjectionNodeAnimationConfig extends AnimationConfig {
  /**
   * The target node to animate.
   */
  node: ProjectionNode;
  /**
   * The snapshot of the target node to begin the animation.
   */
  from: ProjectionNodeSnapshot;
  /**
   * The snapshot of the target node to end the animation.
   */
  to: ProjectionNodeSnapshot;
}
