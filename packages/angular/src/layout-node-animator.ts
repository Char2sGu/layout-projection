import {
  afterRender,
  computed,
  DestroyRef,
  Directive,
  inject,
  InjectionToken,
  input,
  numberAttribute,
  output,
  Signal,
} from '@angular/core';
import {
  AnimationConfig,
  AnimationResult,
  createSnapshot,
  EasingFunction,
  ProjectionAnimator,
} from '@layout-projection/animation';
import { ProjectionNode } from '@layout-projection/core';

import { EasingStringParser } from './easing-string-parser';
import { SnapshotStorage } from './snapshot-storage';

/**
 * Token of a {@link AnimationConfig} that will be used by
 * {@link LayoutNodeAnimator} when no input is supplied.
 */
export const LAYOUT_ANIMATION_CONFIG = new InjectionToken<AnimationConfig>(
  'LAYOUT_ANIMATION_CONFIG',
);

/**
 * Directive that automatically animate layout changes of the {@link ProjectionNode}
 * provided at the current node injector.
 *
 * Requires a {@link ProjectionNode} available in the current node injector.
 * See the {@link LayoutNode} directive for constructing the Projection Tree
 * and providing the {@link ProjectionNode} object.
 *
 * A {@link ProjectionAnimator} is used to animate the layout changes, which might
 * consider additional metadata defined on specific nodes in the animation.
 *
 * @example
 *  ```html
 *  <div layout duration="300" easing="linear">
 *    <div layout duration="500">Inner</div>
 *  </div>
 *  ```
 */
@Directive({
  standalone: true,
  selector: '[layout]',
})
export class LayoutNodeAnimator {
  readonly #node = inject(ProjectionNode, { self: true });
  readonly #destroyRef = inject(DestroyRef);
  readonly #animator = inject(ProjectionAnimator);
  readonly #defaults = inject(LAYOUT_ANIMATION_CONFIG);
  readonly #easingParser = inject(EasingStringParser);
  readonly #snapshots = inject(SnapshotStorage);
  readonly #parent = inject(LayoutNodeAnimator, {
    skipSelf: true,
    optional: true,
  });

  /**
   * The duration of the animation in milliseconds.
   *
   * When not supplied, use the nearest parent directive's duration,
   * or the duration from the {@link LAYOUT_ANIMATION_CONFIG} token
   * if there is no parent directive.
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
   * When not supplied, use the nearest parent directive's easing,
   * or the easing from the {@link LAYOUT_ANIMATION_CONFIG} token
   * if there is no parent directive.
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

  protected readonly duration: Signal<number> = computed(
    () =>
      this.durationInput() ??
      this.#parent?.duration() ??
      this.#defaults.duration,
  );

  protected readonly easing: Signal<EasingFunction> = computed(
    () =>
      this.easingInput() ?? //
      this.#parent?.easing() ??
      this.#defaults.easing,
  );

  #destroyed = false;

  constructor() {
    this.#destroyRef.onDestroy(() => {
      this.#destroyed = true;
    });
    afterRender({
      earlyRead: () => {
        const isRoot = this.#node.parent() === null;
        if (!isRoot) return;
        // separate DOM read and write phases to avoid layout thrashing
        // https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing
        this.#node.traverse((n) => n.reset());
        this.#node.traverse((n) => void n.measure());
      },
    });
    afterRender({
      earlyRead: () => createSnapshot(this.#node),
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
        if (this.#destroyed) return;
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
