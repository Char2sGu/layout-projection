import { ProjectionNode } from '@layout-projection/core';

import { AnimationRef } from './animation-ref.js';
import { AggregationAnimationRef } from './animation-refs.js';
import { ProjectionNodeAnimator } from './projection-node-animator.js';
import {
  ProjectioNTreeAnimationConfig,
  ProjectionTreeAnimator,
} from './projection-tree-animator.js';

/**
 * Animator of a projection tree.
 * Performs the tree animation by animating each node of the tree using
 * a given {@link ProjectionNodeAnimator} and aggregate their animation refs.
 */
export class AggregationProjectionTreeAnimator
  implements ProjectionTreeAnimator
{
  constructor(private readonly nodeAnimator: ProjectionNodeAnimator) {}

  animate(config: ProjectioNTreeAnimationConfig): AnimationRef {
    const { root, from, to, duration, easing } = config;

    const refs: AnimationRef[] = [];
    root.traverse((node) => {
      const snapshotFrom = from.get(node.identity());
      const snapshotTo = to.get(node.identity());
      if (!snapshotFrom || !snapshotTo) return;
      const ref = this.nodeAnimator.animate({
        node,
        from: snapshotFrom,
        to: snapshotTo,
        duration,
        easing,
      });
      refs.push(ref);
    });

    return new AggregationAnimationRef(refs);
  }
}

/**
 * Decorator of a {@link ProjectionTreeAnimator} that
 * stops the previous animation of the same root node before starting a new one.
 */
export class PreventDuplicateProjectionTreeAnimatorBehavior
  implements ProjectionTreeAnimator
{
  private readonly refs = new WeakMap<ProjectionNode, AnimationRef>();

  constructor(private readonly kernel: ProjectionTreeAnimator) {}

  animate(config: ProjectioNTreeAnimationConfig): AnimationRef {
    this.refs.get(config.root)?.stop();
    const ref = this.kernel.animate(config);
    this.refs.set(config.root, ref);
    return ref;
  }
}

/**
 * Decorator of a {@link ProjectionTreeAnimator} that
 * create the missing snapshot of a node with an estimated layout
 * if only one snapshot is found in the animation configuration.
 *
 * This is useful for animating layout changes where some new nodes are added and
 * some existing nodes are removed.
 */
export class EstimateLayoutProjectionTreeAnimatorBehavior
  implements ProjectionTreeAnimator
{
  constructor(private readonly kernel: ProjectionTreeAnimator) {}

  animate(config: ProjectioNTreeAnimationConfig): AnimationRef {
    // TODO: Implement the behavior.
    return this.kernel.animate(config);
  }
}
