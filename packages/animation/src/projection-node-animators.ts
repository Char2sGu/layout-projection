import { ProjectionNode } from '@layout-projection/core';
import { animate } from 'popmotion';

import { AnimationRef } from './animation-ref.js';
import { DelegationAnimationRef } from './animation-refs.js';
import { AnimationResult } from './animation-result.js';
import { ProjectionNodeAnimationHandler } from './projection-node-animation-handler.js';
import {
  ProjectionNodeAnimationConfig,
  ProjectionNodeAnimator,
} from './projection-node-animator.js';

/**
 * Animator of a single projection node.
 * Uses a list of {@link ProjectionNodeAnimationHandler} to handle the animation
 * for each frame.
 */
export class HandlerBasedProjectionNodeAnimator
  implements ProjectionNodeAnimator
{
  constructor(private readonly handlers: ProjectionNodeAnimationHandler[]) {}

  animate(config: ProjectionNodeAnimationConfig): AnimationRef {
    const { node, from, to, duration, easing } = config;

    let stopper: () => void;

    const promise = new Promise<AnimationResult>((resolve) => {
      const handleFrame = (progress: number) => {
        for (const handler of this.handlers)
          handler.handleFrame({ node, from, to, progress });
      };
      handleFrame(0);
      stopper = animate({
        from: 0,
        to: 1,
        duration,
        ease: easing,
        onUpdate: handleFrame,
        onComplete: () => resolve(AnimationResult.Completed),
        onStop: () => resolve(AnimationResult.Stopped),
      }).stop;
    });

    return new DelegationAnimationRef(promise, () => stopper());
  }
}

/**
 * Decorator of a {@link ProjectionNodeAnimator} that stops the previous animation
 * of the same node before starting a new one.
 */
export class PreventDuplicateProjectionNodeAnimatorBehavior
  implements ProjectionNodeAnimator
{
  private readonly refs = new WeakMap<ProjectionNode, AnimationRef>();

  constructor(private readonly kernel: ProjectionNodeAnimator) {}

  animate(config: ProjectionNodeAnimationConfig): AnimationRef {
    this.refs.get(config.node)?.stop();
    const ref = this.kernel.animate(config);
    this.refs.set(config.node, ref);
    return ref;
  }
}
