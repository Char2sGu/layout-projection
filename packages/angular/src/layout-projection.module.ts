import { inject, NgModule } from '@angular/core';
import {
  LayoutAnimationEasingParser,
  LayoutBorderRadiusParser,
  LayoutMeasurer,
} from '@layout-projection/core';

import { LayoutAnimationDirective } from './layout-animation.directive';
import { LayoutProjectionNodeDirective } from './layout-projection-node.directive';

@NgModule({
  declarations: [LayoutProjectionNodeDirective, LayoutAnimationDirective],
  exports: [LayoutProjectionNodeDirective, LayoutAnimationDirective],
  providers: [
    LayoutAnimationEasingParser,
    {
      provide: LayoutMeasurer,
      useFactory: () => new LayoutMeasurer(inject(LayoutBorderRadiusParser)),
    },
    LayoutBorderRadiusParser,
  ],
})
export class LayoutProjectionModule {}
