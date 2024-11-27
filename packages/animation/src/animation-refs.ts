import { AnimationRef } from './animation-ref.js';
import { AnimationResult } from './animation-result.js';

/**
 * {@link AnimationRef} implementation that delegates all logic to
 * objects accepted from the constructor.
 */
export class DelegationAnimationRef<Config> implements AnimationRef<Config> {
  readonly #promise: PromiseLike<AnimationResult>;
  readonly #config: Config;
  readonly #stopper: () => void;
  readonly #progressReporter: () => number;

  #resolved = false;

  constructor(config: {
    readonly promise: PromiseLike<AnimationResult>;
    readonly config: Config;
    readonly stopper: () => void;
    readonly progressReporter: () => number;
  }) {
    this.#promise = config.promise;
    this.#config = config.config;
    this.#stopper = config.stopper;
    this.#progressReporter = config.progressReporter;

    config.promise.then(() => {
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
    return this.#promise.then(onfulfilled, onrejected);
  }

  config(): Config {
    return this.#config;
  }

  resolved(): boolean {
    return this.#resolved;
  }

  progress(): number {
    return this.#progressReporter();
  }

  stop(): void {
    this.#stopper();
  }
}
