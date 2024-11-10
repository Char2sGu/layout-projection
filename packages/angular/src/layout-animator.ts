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

import { StringEasingParser } from './string-easing-parser';

@Directive({
  standalone: true,
  selector: '[layout][animate]',
})
export class LayoutAnimator {
  #node = inject(ProjectionNode, { self: true });
  #animator = inject(ProjectionTreeAnimator);
  #easingParser = inject(StringEasingParser);

  #previousDest?: ReadonlyMap<string, ProjectionNodeSnapshot>;

  readonly duration = input.required({ transform: numberAttribute });

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
