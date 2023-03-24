import { Directive, Host, OnDestroy, Optional, Self } from '@angular/core';
import { NodeSnapshotMap } from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';

export class LayoutAnimationScopeItemRegistry extends Set<LayoutAnimationEntryDirective> {}

@Directive({
  selector: '[lpjAnimationScope]',
  providers: [
    {
      provide: LayoutAnimationScopeItemRegistry,
      useValue: new LayoutAnimationScopeItemRegistry(),
    },
    {
      provide: NodeSnapshotMap,
      useValue: new NodeSnapshotMap(),
    },
  ],
})
export class LayoutAnimationScopeDirective {}

@Directive({
  selector: '[lpjAnimation]',
})
export class LayoutAnimationScopeEntryRegistrarDirective implements OnDestroy {
  constructor(
    @Self() private instance: LayoutAnimationEntryDirective,
    @Host() @Optional() private registry?: LayoutAnimationScopeItemRegistry,
  ) {
    this.registry?.add(instance);
  }

  ngOnDestroy(): void {
    this.registry?.delete(this.instance);
  }
}
