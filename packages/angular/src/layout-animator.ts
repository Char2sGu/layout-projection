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
}
