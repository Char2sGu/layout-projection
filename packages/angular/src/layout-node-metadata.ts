import { Directive, inject, OnInit } from '@angular/core';
import {
  MetadataManager,
  MetadataToken,
  SKIP_POSITION,
  SKIP_SIZE,
} from '@layout-projection/animation';

import { LayoutNode } from './layout-node';

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
 *  export class SomeMetadata extends DefineLayoutNodeMetadata implements OnInit {
 *    ngOnInit(): void {
 *      this.define(SOME_METADATA, someValue);
 *    }
 *  }
 *  ```
 *
 */
@Directive()
export abstract class DefineLayoutNodeMetadata {
  readonly #proxy = inject(LayoutNode, { self: true });
  readonly #metadata = inject(MetadataManager);

  define<T>(token: MetadataToken<T>, value: NoInfer<T>): void {
    const node = this.#proxy.kernel();
    this.#metadata.define(node, token, value);
  }
}

/**
 * Directive that defines a `true` value for the {@link SKIP_POSITION} metadata
 * token for the current projection node.
 * See the metadata token documentation for more information.
 *
 * Requires a {@link ProjectionNode} available in the current node injector.
 * See the {@link LayoutNode} directive for constructing the Projection Tree
 * and providing the {@link ProjectionNode} object.
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
export class SkipPosition extends DefineLayoutNodeMetadata implements OnInit {
  ngOnInit(): void {
    this.define(SKIP_POSITION, true);
  }
}

/**
 * Directive that defines a `true` value for the {@link SKIP_SIZE} metadata
 * token for the current projection node.
 * See the metadata token documentation for more information.
 *
 * Requires a {@link ProjectionNode} available in the current node injector.
 * See the {@link LayoutNode} directive for constructing the Projection Tree
 * and providing the {@link ProjectionNode} object.
 */
@Directive({
  standalone: true,
  selector: '[skipSize]',
})
export class SkipSize extends DefineLayoutNodeMetadata implements OnInit {
  ngOnInit(): void {
    this.define(SKIP_SIZE, true);
  }
}
