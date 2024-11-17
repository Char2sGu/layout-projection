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
import { ProjectionNode } from '@layout-projection/core';

import { EasingStringParser } from './easing-string-parser';

/**
 * Directive for animating the Projection Tree starting from the current
 * Projection Node, whenever the measurement of any node in the tree changes,
 * or the tree structure changes.
 *
 * Requires a {@link ProjectionNode} available in the current node injector.
 * See the {@link LayoutNode} directive for constructing the Projection Tree
 * and providing the {@link ProjectionNode} object.
 *
 * @experimental experimental implementation; subject to changes
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
        if (this.#isSnapshotsEqual(previous, current)) return;
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

  #isSnapshotsEqual(
    a: ReadonlyMap<string, ProjectionNodeSnapshot>,
    b: ReadonlyMap<string, ProjectionNodeSnapshot>,
  ) {
    if (a.size !== b.size) return false;
    for (const [id, snapshot] of a) {
      const other = b.get(id);
      if (!other || !snapshot.equals(other)) return false;
    }
    return true;
  }
}
