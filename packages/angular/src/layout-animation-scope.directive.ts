import { Directive, Self } from '@angular/core';
import { Node, NodeSnapshotMap } from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';

export class LayoutAnimationScopeNodeRegistry extends Set<Node> {}
export class LayoutAnimationScopeEntryRegistry extends Set<LayoutAnimationEntryDirective> {}

@Directive({
  selector: '[lpjAnimationScope]',
  exportAs: 'lpjAnimationScope',
  providers: [
    {
      provide: LayoutAnimationScopeNodeRegistry,
      useFactory: () => new LayoutAnimationScopeNodeRegistry(),
    },
    {
      provide: LayoutAnimationScopeEntryRegistry,
      useFactory: () => new LayoutAnimationScopeEntryRegistry(),
    },
    {
      provide: NodeSnapshotMap,
      useFactory: () => new NodeSnapshotMap(),
    },
  ],
})
export class LayoutAnimationScopeDirective {
  constructor(
    @Self() readonly nodeRegistry: LayoutAnimationScopeNodeRegistry,
    @Self() readonly entryRegistry: LayoutAnimationScopeEntryRegistry,
    @Self() readonly snapshots: NodeSnapshotMap,
  ) {}
}
