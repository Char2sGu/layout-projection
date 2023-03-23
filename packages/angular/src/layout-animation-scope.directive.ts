import { Directive } from '@angular/core';
import { NodeSnapshotMap } from '@layout-projection/core';

import { LayoutAnimationDirectiveRegistry } from './layout-animation.directive';

@Directive({
  selector: '[lpjAnimationScope]',
  providers: [
    {
      provide: NodeSnapshotMap,
      useValue: new NodeSnapshotMap(),
    },
    {
      provide: LayoutAnimationDirectiveRegistry,
      useValue: new LayoutAnimationDirectiveRegistry(),
    },
  ],
})
export class LayoutAnimationScopeDirective {}
