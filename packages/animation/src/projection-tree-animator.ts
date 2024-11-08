import { ProjectionNode } from '@layout-projection/core';

import { AnimationConfig } from './animation-config.js';
import { AnimationRef } from './animation-ref.js';
import { ProjectionNodeSnapshot } from './projection-node-snapshot.js';

/**
 * Animator of a tree of projection nodes.
 */
export interface ProjectionTreeAnimator {
  /**
   * Animate a tree of projection nodes starting from a given root.
   * The animation of a node will be skipped if its snapshot is not found
   * in any of the snapshot maps.
   * @param config
   */
  animate(config: ProjectioNTreeAnimationConfig): AnimationRef;
}

export interface ProjectioNTreeAnimationConfig extends AnimationConfig {
  /**
   * The root node of the projection tree to animate.
   */
  root: ProjectionNode;
  /**
   * The map of snapshots of the tree to begin the animation.
   * The keys are node ids.
   */
  from: ReadonlyMap<string, ProjectionNodeSnapshot>;
  /**
   * The map of snapshots of the tree to end the animation.
   * The keys are node ids.
   */
  to: ReadonlyMap<string, ProjectionNodeSnapshot>;
}
