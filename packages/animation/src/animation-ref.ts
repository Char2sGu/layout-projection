import { AnimationResult } from './animation-result.js';

/**
 * Represents a reference to an performing animation.
 * A promise-like object that resolves when the animation completes or is stopped.
 * Exposes an additional `stop` method to stop the animation.
 */
export abstract class AnimationRef implements PromiseLike<AnimationResult> {
  abstract then<TResult1 = AnimationResult, TResult2 = never>(
    onfulfilled?:
      | ((value: AnimationResult) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): PromiseLike<TResult1 | TResult2>;

  /**
   * Returns whether if the animation is resolved.
   * An animation is resolved when it completes or is stopped.
   */
  abstract resolved(): boolean;

  /**
   * Stops the animation.
   * Noop if the animation is already completed or stopped.
   */
  abstract stop(): void;
}
