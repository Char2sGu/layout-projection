import { Directive, inject } from '@angular/core';
import {
  MetadataManager,
  MetadataToken,
  SKIP_POSITION,
  SKIP_SIZE,
} from '@layout-projection/animation';
import { ProjectionNode } from '@layout-projection/core';

@Directive()
export abstract class LayoutNodeMetadata<T> {
  #node = inject(ProjectionNode, { self: true });
  #metadata = inject(MetadataManager);

  constructor(token: MetadataToken<T>, value: NoInfer<T>) {
    this.#metadata.define(this.#node, token, value);
  }
}

@Directive({
  standalone: true,
  selector: '[layout][skipPosition]',
})
export class SkipPositionLayoutNodeMetadata extends LayoutNodeMetadata<boolean> {
  constructor() {
    super(SKIP_POSITION, true);
  }
}

@Directive({
  standalone: true,
  selector: '[layout][skipSize]',
})
export class SkipSizeLayoutNodeMetadata extends LayoutNodeMetadata<boolean> {
  constructor() {
    super(SKIP_SIZE, true);
  }
}
