import { AnimationResult } from './animation-result.js';

/**
 * Represents a reference to an performing animation.
 * A promise-like object that resolves when the animation completes or is stopped.
 * Exposes an additional `stop` method to stop the animation.
 */
export interface AnimationRef extends PromiseLike<AnimationResult> {
  /**
   * Stops the animation.
   * Noop if the animation is already completed or stopped.
   */
  stop(): void;
}
