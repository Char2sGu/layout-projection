import { Directive, Host, OnDestroy, Optional, Self } from '@angular/core';
import { Node } from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';
import {
  LayoutAnimationScopeEntryRegistry,
  LayoutAnimationScopeNodeRegistry,
} from './layout-animation-scope.directive';

@Directive({
  selector: '[lpjNode]',
})
export class LayoutAnimationScopeNodeRegistrarDirective implements OnDestroy {
  constructor(
    @Self() private node: Node,
    @Host() @Optional() private registry?: LayoutAnimationScopeNodeRegistry,
  ) {
    this.registry?.add(node);
  }

  ngOnDestroy(): void {
    this.registry?.delete(this.node);
  }
}

@Directive({
  selector: '[lpjAnimation]',
})
export class LayoutAnimationScopeEntryRegistrarDirective implements OnDestroy {
  constructor(
    @Self() private entry: LayoutAnimationEntryDirective,
    @Host() @Optional() private registry?: LayoutAnimationScopeEntryRegistry,
  ) {
    this.registry?.add(entry);
  }

  ngOnDestroy(): void {
    this.registry?.delete(this.entry);
  }
}
