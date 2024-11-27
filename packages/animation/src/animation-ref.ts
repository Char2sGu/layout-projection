import { AnimationResult } from './animation-result.js';

/**
 * Promise-like reference to an animation that
 * resolves when the animation completes or is stopped.
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
   * Return whether if the animation is resolved.
   * An animation is resolved when it completes or is stopped.
   */
  abstract resolved(): boolean;

  /**
   * Return the progress of the animation.
   * The progress is a number between 0 and 1.
   */
  abstract progress(): number;

  /**
   * Stop the animation.
   * Noop if the animation is resolved.
   */
  abstract stop(): void;
}
