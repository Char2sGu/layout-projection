import { Directive, inject } from '@angular/core';
import {
  MetadataManager,
  MetadataToken,
  SKIP_POSITION,
  SKIP_SIZE,
} from '@layout-projection/animation';
import { ProjectionNode } from '@layout-projection/core';

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
