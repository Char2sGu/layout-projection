import {
  afterRender,
  Directive,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import {
  createTreeSnapshot,
  EasingFunction,
  ProjectionNodeSnapshot,
  ProjectionTreeAnimator,
} from '@layout-projection/animation';
import { Measurement, ProjectionNode } from '@layout-projection/core';

import { EasingStringParser } from './easing-string-parser';

/**
 * Directive for animating the Projection Tree starting from the current
 * Projection Node, whenever the layout of any nodes within this subtree
 * is changed.
 *
 * Requires a {@link ProjectionNode} available in the current node injector.
 * See the {@link LayoutNode} directive for constructing the Projection Tree
 * and providing the {@link ProjectionNode} object.
 *
 * @experimental
 *
 * @example
 *  ```html
 *  <div id="container" layout animate duration="100" easing="linear">
 *    <div
 *      id="box"
 *      [class.active]="isActive()"
 *      layout
 *    ></div>
 *  </div>
 *  ```
 */
@Directive({
  standalone: true,
  selector: '[animate]',
})
export class LayoutAnimator {
  #node = inject(ProjectionNode, { self: true });
  #animator = inject(ProjectionTreeAnimator);
  #easingParser = inject(EasingStringParser);

  #previousDest?: ReadonlyMap<string, ProjectionNodeSnapshot>;

  /**
   * The duration of the animation in milliseconds.
   */
  readonly duration = input.required({ transform: numberAttribute });

  /**
   * The easing of the animation.
   * Accepts a {@link EasingFunction} or a string, which will be parsed by
   * the provided {@link EasingStringParser}.
   */
  readonly easing = input.required({
    transform: (v: string | EasingFunction) =>
      typeof v === 'string' ? this.#easingParser.parse(v) : v,
  });

  constructor() {
    // TODO: start from the last frame of the previous animation
    afterRender({
      earlyRead: () => {
        this.#node.traverse((n) => n.reset());
        this.#node.traverse((n) => n.measure());
        return createTreeSnapshot(this.#node);
      },
      write: async (current) => {
        const previous = this.#previousDest;
        this.#previousDest = current;
        if (!previous) return;
        if (this.#snapshotsEqual(previous, current)) return;
        await this.#animator.animate({
          root: this.#node,
          from: previous,
          to: current,
          duration: this.duration(),
          easing: this.easing(),
        });
      },
    });
  }

  #snapshotsEqual(
    a: ReadonlyMap<string, ProjectionNodeSnapshot>,
    b: ReadonlyMap<string, ProjectionNodeSnapshot>,
  ) {
    if (a.size !== b.size) return false;
    for (const [key, value] of a)
      if (!b.has(key) || !this.#snapshotEqual(value, b.get(key)!)) return false;
    return true;
  }

  #snapshotEqual(a: ProjectionNodeSnapshot, b: ProjectionNodeSnapshot) {
    return (
      a.id === b.id &&
      a.parent === b.parent &&
      this.#measurementEqual(a.measurement, b.measurement) &&
      a.children.size === b.children.size &&
      [...a.children].every((c) => b.children.has(c))
    );
  }

  #measurementEqual(a: Measurement | null, b: Measurement | null) {
    return (
      a === b ||
      (a !== null &&
        b !== null &&
        a.layout.top === b.layout.top &&
        a.layout.left === b.layout.left &&
        a.layout.right === b.layout.right &&
        a.layout.bottom === b.layout.bottom)
    );
  }
}
