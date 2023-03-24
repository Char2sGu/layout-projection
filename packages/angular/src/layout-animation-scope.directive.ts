import { Directive } from '@angular/core';
import { NodeSnapshotMap } from '@layout-projection/core';

import { LayoutAnimationEntryRegistry } from './layout-animation-entry.directive';

@Directive({
  selector: '[lpjAnimationScope]',
  providers: [
    {
      provide: NodeSnapshotMap,
      useValue: new NodeSnapshotMap(),
    },
    {
      provide: LayoutAnimationEntryRegistry,
      useValue: new LayoutAnimationEntryRegistry(),
    },
  ],
})
export class LayoutAnimationScopeDirective {}
