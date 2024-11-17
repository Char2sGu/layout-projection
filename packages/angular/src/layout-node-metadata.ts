import { Directive, inject } from '@angular/core';
import {
  MetadataManager,
  MetadataToken,
  SKIP_POSITION,
  SKIP_SIZE,
} from '@layout-projection/animation';
import { ProjectionNode } from '@layout-projection/core';

/**
 * The foundation directive for defining metadata for the current
 * projection node.
 *
 * @example
 * To create a custom directive that defines metadata:
 *  ```ts
 *  \@Directive({
 *    standalone: true,
 *    selector: '[someMetadata]',
 *  })
 *  export class SomeMetadata extends DefineLayoutNodeMetadata {
 *    constructor() {
 *      super();
 *      this.define(SOME_METADATA, someValue);
 *    }
 *  }
 *  ```
 *
 */
@Directive()
export abstract class DefineLayoutNodeMetadata {
  #node = inject(ProjectionNode, { self: true });
  #metadata = inject(MetadataManager);

  define<T>(token: MetadataToken<T>, value: NoInfer<T>): void {
    this.#metadata.define(this.#node, token, value);
  }
}

/**
 * Directive that defines a `true` value for the {@link SKIP_POSITION} metadata
 * token for the current projection node.
 * See the metadata token documentation for more information.
 *
 * This directive must be applied to an element whose node injector contains
 * a {@link ProjectionNode} declaration, such as where a {@link LayoutNode}
 * directive is also applied.
 *
 * @example
 *  ```html
 *  <div layout animate ...>
 *    <div layout skipPosition></div>
 *  </div>
 *  ```
 */
@Directive({
  standalone: true,
  selector: '[skipPosition]',
})
export class SkipPosition extends DefineLayoutNodeMetadata {
  constructor() {
    super();
    this.define(SKIP_POSITION, true);
  }
}

/**
 * Directive that defines a `true` value for the {@link SKIP_SIZE} metadata
 * token for the current projection node.
 * See the metadata token documentation for more information.
 *
 * This directive must be applied to an element whose node injector contains
 * a {@link ProjectionNode} declaration, such as where a {@link LayoutNode}
 * directive is also applied.
 */
@Directive({
  standalone: true,
  selector: '[skipSize]',
})
export class SkipSize extends DefineLayoutNodeMetadata {
  constructor() {
    super();
    this.define(SKIP_SIZE, true);
  }
}
