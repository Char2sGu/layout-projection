import { inject, NgModule } from '@angular/core';
import {
  BorderRadiusStyleParser,
  LayoutAnimationEasingParser,
  LayoutAnimator,
  NodeMeasurer,
  NodeSnapper,
} from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';
import {
  LayoutAnimationScopeDirective,
  LayoutAnimationScopeEntryRegistrarDirective,
} from './layout-animation-scope.directive';
import { LayoutAnimationSelfTriggerDirective } from './layout-animation-self-trigger.directive';
import { LayoutAnimationTriggerDirective } from './layout-animation-trigger.directive';
import { NodeDirective } from './node.directive';

@NgModule({
  declarations: [
    NodeDirective,
    LayoutAnimationEntryDirective,
    LayoutAnimationScopeDirective,
    LayoutAnimationScopeEntryRegistrarDirective,
    LayoutAnimationTriggerDirective,
    LayoutAnimationSelfTriggerDirective,
  ],
  exports: [
    NodeDirective,
    LayoutAnimationEntryDirective,
    LayoutAnimationScopeDirective,
    LayoutAnimationScopeEntryRegistrarDirective,
    LayoutAnimationTriggerDirective,
    LayoutAnimationSelfTriggerDirective,
  ],
  providers: [
    {
      provide: LayoutAnimator,
      useFactory: () =>
        new LayoutAnimator(
          inject(NodeMeasurer),
          inject(LayoutAnimationEasingParser),
        ),
    },
    {
      provide: LayoutAnimationEasingParser,
      useFactory: () => new LayoutAnimationEasingParser(),
    },
    {
      provide: NodeMeasurer,
      useFactory: () => new NodeMeasurer(inject(BorderRadiusStyleParser)),
    },
    {
      provide: NodeSnapper,
      useFactory: () => new NodeSnapper(inject(NodeMeasurer)),
    },
    {
      provide: BorderRadiusStyleParser,
      useFactory: () => new BorderRadiusStyleParser(),
    },
  ],
})
export class LayoutProjectionModule {}
