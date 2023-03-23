import { inject, NgModule } from '@angular/core';
import {
  BorderRadiusStyleParser,
  LayoutAnimationEasingParser,
  LayoutAnimator,
  NodeMeasurer,
  NodeSnapper,
} from '@layout-projection/core';

import { LayoutAnimationDirective } from './layout-animation.directive';
import { LayoutAnimationScopeDirective } from './layout-animation-scope.directive';
import { LayoutAnimationTriggerDirective } from './layout-animation-trigger.directive';
import { LayoutProjectionNodeDirective } from './layout-projection-node.directive';

@NgModule({
  declarations: [
    LayoutProjectionNodeDirective,
    LayoutAnimationDirective,
    LayoutAnimationScopeDirective,
    LayoutAnimationTriggerDirective,
  ],
  exports: [
    LayoutProjectionNodeDirective,
    LayoutAnimationDirective,
    LayoutAnimationScopeDirective,
    LayoutAnimationTriggerDirective,
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
