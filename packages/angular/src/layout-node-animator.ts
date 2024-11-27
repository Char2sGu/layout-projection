import {
  afterRender,
  computed,
  DestroyRef,
  Directive,
  inject,
  input,
  numberAttribute,
  output,
  Signal,
} from '@angular/core';
import {
  AnimationResult,
  createSnapshot,
  EasingFunction,
  ProjectionAnimator,
} from '@layout-projection/animation';
import { ProjectionNode } from '@layout-projection/core';

import { EasingStringParser } from './easing-string-parser';
import { SnapshotStorage } from './snapshot-storage';

/**
 * Directive that automatically animate layout changes of the {@link ProjectionNode}
 * provided at the current node injector.
 */
@Directive({
  standalone: true,
  selector: '[layout]',
})
export class LayoutNodeAnimator {
  readonly #node = inject(ProjectionNode, { self: true });
  readonly #destroyRef = inject(DestroyRef);
  readonly #animator = inject(ProjectionAnimator);
  readonly #easingParser = inject(EasingStringParser);
  readonly #snapshots = inject(SnapshotStorage);
  readonly #parent = inject(LayoutNodeAnimator, {
    skipSelf: true,
    optional: true,
  });

  /**
   * The duration of the animation in milliseconds.
   *
   * When not supplied, use the nearest parent directive's duration.1
   * If no parent directive has a duration, an error will be thrown.
   */
  readonly durationInput = input(undefined, {
    alias: 'duration',
    transform: numberAttribute,
  });

  /**
   * The easing of the animation.
   *
   * Accepts a {@link EasingFunction} or a string easing representation.
   * When a string is supplied, it will be parsed by the {@link EasingStringParser}
   * instance from the current injector.
   *
   * When not supplied, use the nearest parent directive's duration.
   * If no parent directive has a duration, an error will be thrown.
   */
  readonly easingInput = input(undefined, {
    alias: 'easing',
    transform: (v: string | EasingFunction) =>
      typeof v === 'string' ? this.#easingParser.parse(v) : v,
  });

  /**
   * Emits when a layout animation starts at this node.
   */
  readonly animationStart = output();

  /**
   * Emits when a layout animation at this node completes or is stopped.
   * The emitted value is the result of the animation.
   */
  readonly animationSettle = output<AnimationResult>();

  protected readonly duration: Signal<number> = computed(() => {
    const value = this.durationInput() ?? this.#parent?.duration();
    if (value === undefined) throw new Error('duration is not defined');
    return value;
  });

  protected readonly easing: Signal<EasingFunction> = computed(() => {
    const value = this.easingInput() ?? this.#parent?.easing();
    if (value === undefined) throw new Error('easing is not defined');
    return value;
  });

  constructor() {
    // TODO: start from the last frame of the previous animation
    afterRender({
      earlyRead: () => {
        this.#node.traverse((n) => n.reset());
        this.#node.traverse((n) => n.measure());
        return createSnapshot(this.#node);
      },
      write: async (current) => {
        const previous = this.#snapshots.get(this.#node.identity());
        this.#snapshots.set(this.#node.identity(), current);
        if (!previous) return;
        if (previous.equals(current)) return;
        this.animationStart.emit();
        const result = await this.#animator.animate({
          node: this.#node,
          from: previous,
          to: current,
          duration: this.duration(),
          easing: this.easing(),
        });
        this.animationSettle.emit(result);
      },
    });
    this.#destroyRef.onDestroy(() => {
      const snapshot = this.#snapshots.get(this.#node.identity());
      if (!snapshot) return;
      // delete the snapshot after the next tick
      // in case there is a shared element animation
      setTimeout(() => {
        if (this.#snapshots.get(this.#node.identity()) !== snapshot) return;
        this.#snapshots.delete(this.#node.identity());
      });
    });
  }
}
