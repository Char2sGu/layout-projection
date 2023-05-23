import { Easing } from 'popmotion';

export class AnimationRef implements PromiseLike<AnimationResult> {
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

export class AggregationAnimationRef extends AnimationRef {
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

export enum AnimationResult {
  Completed = 'completed',
  Stopped = 'stopped',
}

export interface AnimationConfig {
  duration: number;
  easing: Easing;
}

export interface AnimationRoute {
  [style: string]: AnimationStyleRoute<unknown>;
}
export interface AnimationStyleRoute<Style> {
  from: Style;
  to: Style;
}
