import {
  Directive,
  Host,
  OnDestroy,
  OnInit,
  Optional,
  Self,
} from '@angular/core';
import { Node } from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';
import {
  LayoutAnimationScopeEntryRegistry,
  LayoutAnimationScopeNodeRegistry,
} from './layout-animation-scope.directive';

// Register instances in `ngOnInit` instead of `constructor` to register the
// updated IDs of nodes.

@Directive({
  selector: '[lpjNode]',
})
export class LayoutAnimationScopeNodeRegistrarDirective
  implements OnInit, OnDestroy
{
  constructor(
    @Self() private node: Node,
    @Host() @Optional() private registry?: LayoutAnimationScopeNodeRegistry,
  ) {}
  ngOnInit(): void {
    this.registry?.add(this.node);
  }
  ngOnDestroy(): void {
    this.registry?.delete(this.node);
  }
}

@Directive({
  selector: '[lpjAnimation]',
})
export class LayoutAnimationScopeEntryRegistrarDirective
  implements OnInit, OnDestroy
{
  constructor(
    @Self() private entry: LayoutAnimationEntryDirective,
    @Host() @Optional() private registry?: LayoutAnimationScopeEntryRegistry,
  ) {}
  ngOnInit(): void {
    this.registry?.add(this.entry);
  }
  ngOnDestroy(): void {
    this.registry?.delete(this.entry);
  }
}
