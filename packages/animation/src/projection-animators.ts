import { ProjectionNode } from '@layout-projection/core';
import { animate } from 'popmotion';

import { AnimationRef } from './animation-ref.js';
import { DelegationAnimationRef } from './animation-refs.js';
import { AnimationResult } from './animation-result.js';
import { ProjectionAnimationHandler } from './projection-animation-handler.js';
import {
  ProjectionAnimationConfig,
  ProjectionAnimator,
} from './projection-animator.js';

/**
 * Implementation of {@link ProjectionAnimator} that
 * delegates the animation to a list of {@link ProjectionAnimationHandler}s,
 * where each of them is responsible for handling an aspect of the animation
 * in each frame.
 */
export class CompositeProjectionAnimator implements ProjectionAnimator {
  readonly #handlers: ProjectionAnimationHandler[];

  /**
   * Map of animations that haven't resolved.
   */
  readonly #pending = new Map<
    string,
    AnimationRef<ProjectionAnimationConfig>
  >();

  constructor(handlers: ProjectionAnimationHandler[]) {
    this.#handlers = handlers;
  }

  animate(
    config: ProjectionAnimationConfig,
  ): AnimationRef<ProjectionAnimationConfig> {
    const { node, duration, easing } = config;

    const existing = this.#pending.get(node.identity());
    if (existing) {
      existing.stop();
      config = this.#restoreLastAnimationFrame(config, existing);
    }

    let progress: number;
    let stopper: () => void;

    const promise = new Promise<AnimationResult>((resolve) => {
      const handleFrame = (p: number) => {
        progress = p;
        this.#handleFrame(config, p);
      };
      handleFrame(0);
      const result = animate({
        from: 0,
        to: 1,
        duration,
        ease: easing,
        onUpdate: handleFrame,
        onComplete: () => resolve(AnimationResult.Completed),
        onStop: () => resolve(AnimationResult.Stopped),
      });
      stopper = result.stop;
    });

    const ref = new DelegationAnimationRef({
      promise,
      config,
      stopper: () => stopper(),
      progressReporter: () => progress,
    });

    this.#pending.set(node.identity(), ref);
    ref.then(() => {
      if (this.#pending.get(node.identity()) === ref)
        this.#pending.delete(node.identity());
    });

    return ref;
  }

  /**
   * Handle a single frame of an animation.
   * @param progress [0,1]
   */
  #handleFrame(config: ProjectionAnimationConfig, progress: number): void {
    const { node: target, from, to } = config;
    target.traverse((node) => {
      if (node.identity() === target.identity())
        for (const handler of this.#handlers)
          handler.handleFrame({ node, from, to, progress });
      else this.#projectInPlace(node);
    });
  }

  /**
   * Project the given node to its current, maybe projected, layout.
   * This is useful because new projection on ancestors may
   * affect the layout of the given node, and a project-in-place
   * is needed to project the node back to its layout.
   * Noop if the node is neither projected nor measured.
   */
  #projectInPlace(node: ProjectionNode): boolean {
    const projection = node.projection();
    if (projection) {
      node.project(projection.layoutDest);
      return true;
    }
    const measurement = node.measurement();
    if (measurement) {
      node.project(measurement.layout);
      return true;
    }
    return false;
  }

  #restoreLastAnimationFrame(
    currentConfig: ProjectionAnimationConfig,
    lastAnimation: AnimationRef<ProjectionAnimationConfig>,
  ): ProjectionAnimationConfig {
    const config = { ...lastAnimation.config(), node: currentConfig.node };
    this.#handleFrame(config, lastAnimation.progress());
    const projection = currentConfig.node.projection();
    if (!projection) throw new Error('projection not found');
    return {
      ...currentConfig,
      from: {
        ...currentConfig.from,
        measurement: {
          ...projection.measurement,
          layout: projection.layoutDest,
        },
      },
    };
  }
}
