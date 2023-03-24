import { Directive } from '@angular/core';
import { NodeSnapshotMap } from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';

export class LayoutAnimationScopeItemRegistry extends Set<LayoutAnimationEntryDirective> {}

@Directive({
  selector: '[lpjAnimationScope]',
  providers: [
    {
      provide: NodeSnapshotMap,
      useValue: new NodeSnapshotMap(),
    },
    {
      provide: LayoutAnimationScopeItemRegistry,
      useValue: new LayoutAnimationScopeItemRegistry(),
    },
  ],
})
export class LayoutAnimationScopeDirective {}
