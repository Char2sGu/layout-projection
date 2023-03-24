import { Directive } from '@angular/core';
import { Node, NodeSnapshotMap } from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';

export class LayoutAnimationScopeNodeRegistry extends Set<Node> {}
export class LayoutAnimationScopeEntryRegistry extends Set<LayoutAnimationEntryDirective> {}

@Directive({
  selector: '[lpjAnimationScope]',
  providers: [
    {
      provide: LayoutAnimationScopeNodeRegistry,
      useValue: new LayoutAnimationScopeNodeRegistry(),
    },
    {
      provide: LayoutAnimationScopeEntryRegistry,
      useValue: new LayoutAnimationScopeEntryRegistry(),
    },
    {
      provide: NodeSnapshotMap,
      useValue: new NodeSnapshotMap(),
    },
  ],
})
export class LayoutAnimationScopeDirective {}
