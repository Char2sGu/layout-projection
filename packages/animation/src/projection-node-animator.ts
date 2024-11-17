import { ProjectionNode } from '@layout-projection/core';

import { AnimationConfig } from './animation-config.js';
import { AnimationRef } from './animation-ref.js';
import { ProjectionNodeSnapshot } from './projection-node-snapshot.js';

/**
 * Animator of a single projection node.
 */
export abstract class ProjectionNodeAnimator {
  /**
   * Animate the projection node from one snapshot to another.
   * @param config
   */
  abstract animate(config: ProjectionNodeAnimationConfig): AnimationRef;
}

export interface ProjectionNodeAnimationConfig extends AnimationConfig {
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
