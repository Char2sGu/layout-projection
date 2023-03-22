import { inject, NgModule } from '@angular/core';
import {
  BorderRadiusStyleParser,
  LayoutAnimationEasingParser,
  LayoutAnimator,
  NodeMeasurer,
  NodeSnapper,
} from '@layout-projection/core';

import { LayoutAnimationDirective } from './layout-animation.directive';
import { LayoutAnimationConfigDirective } from './layout-animation-config.directive';
import { LayoutProjectionNodeDirective } from './layout-projection-node.directive';

@NgModule({
  declarations: [
    LayoutProjectionNodeDirective,
    LayoutAnimationDirective,
    LayoutAnimationConfigDirective,
  ],
  exports: [
    LayoutProjectionNodeDirective,
    LayoutAnimationDirective,
    LayoutAnimationConfigDirective,
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
