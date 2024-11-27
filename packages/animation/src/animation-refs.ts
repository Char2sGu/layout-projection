import { AnimationRef } from './animation-ref.js';
import { AnimationResult } from './animation-result.js';

/**
 * {@link AnimationRef} implementation that delegates all logic to
 * objects accepted from the constructor.
 */
export class DelegationAnimationRef implements AnimationRef {
  #resolved = false;

  /**
   * @param promise a promise that resolves when the animation completes or is stopped
   * @param stopper a function to stop the animation
   * @param progressReporter a function that return the current progress of the animation
   */
  constructor(
    private promise: Promise<AnimationResult>,
    private stopper: () => void,
    private progressReporter: () => number,
  ) {
    promise.then(() => {
      this.#resolved = true;
    });
  }

  then<TResult1 = AnimationResult, TResult2 = never>(
    onfulfilled?:
      | ((value: AnimationResult) => TResult1 | PromiseLike<TResult1>)
      | null
      | undefined,
    onrejected?:
      | ((reason: any) => TResult2 | PromiseLike<TResult2>)
      | null
      | undefined,
  ): PromiseLike<TResult1 | TResult2> {
    return this.promise.then(onfulfilled, onrejected);
  }

  resolved(): boolean {
    return this.#resolved;
  }

  progress(): number {
    return this.progressReporter();
  }

  stop(): void {
    this.stopper();
  }
}
