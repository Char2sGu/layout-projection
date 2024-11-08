import { AnimationRef } from './animation-ref.js';
import { AnimationResult } from './animation-result.js';

/**
 * Animation reference that delegates all logic to a promise and a stopper
 * function.
 */
export class DelegationAnimationRef implements AnimationRef {
  /**
   *
   * @param promise a promise that resolves when the animation completes or is stopped
   * @param stopper a function to stop the animation
   */
  constructor(
    private promise: Promise<AnimationResult>,
    private stopper: () => void,
  ) {}

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

  stop(): void {
    this.stopper();
  }
}

/**
 * Animation reference aggregated from multiple other references.
 * Resolves once all animations are completed or one is stopped.
 * Calling `stop` stops all pending animations.
 */
export class AggregationAnimationRef
  extends DelegationAnimationRef
  implements AnimationRef
{
  /**
   * @param refs the target animation refs to aggregate
   */
  constructor(refs: AnimationRef[]) {
    const promise = Promise.all(refs).then((results) =>
      results.every((result) => result === AnimationResult.Completed)
        ? AnimationResult.Completed
        : AnimationResult.Stopped,
    );
    const stopper = () => refs.forEach((ref) => ref.stop());
    super(promise, stopper);
  }
}
