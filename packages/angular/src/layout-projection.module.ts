import { inject, NgModule } from '@angular/core';
import {
  BorderRadiusStyleParser,
  CssEasingParser,
  LayoutAnimator,
  NodeMeasurer,
  NodeSnapper,
} from '@layout-projection/core';
import { NodeAnimationEngine } from '@layout-projection/core/dist/node-animation';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';
import { LayoutAnimationScopeDirective } from './layout-animation-scope.directive';
import {
  LayoutAnimationScopeEntryRegistrarDirective,
  LayoutAnimationScopeNodeRegistrarDirective,
} from './layout-animation-scope-registrar.directives';
import { LayoutAnimationSelfTriggerDirective } from './layout-animation-self-trigger.directive';
import { LayoutAnimationTriggerDirective } from './layout-animation-trigger.directive';
import { NodeDirective } from './node.directive';

@NgModule({
  declarations: [
    NodeDirective,
    LayoutAnimationEntryDirective,
    LayoutAnimationScopeDirective,
    LayoutAnimationScopeNodeRegistrarDirective,
    LayoutAnimationScopeEntryRegistrarDirective,
    LayoutAnimationTriggerDirective,
    LayoutAnimationSelfTriggerDirective,
  ],
  exports: [
    NodeDirective,
    LayoutAnimationEntryDirective,
    LayoutAnimationScopeDirective,
    LayoutAnimationScopeNodeRegistrarDirective,
    LayoutAnimationScopeEntryRegistrarDirective,
    LayoutAnimationTriggerDirective,
    LayoutAnimationSelfTriggerDirective,
  ],
  providers: [
    {
      provide: LayoutAnimator,
      useFactory: () =>
        new LayoutAnimator(
          inject(NodeAnimationEngine),
          inject(NodeMeasurer),
          inject(CssEasingParser),
        ),
    },
    {
      provide: NodeAnimationEngine,
      useFactory: () => new NodeAnimationEngine(),
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
    {
      provide: CssEasingParser,
      useFactory: () => new CssEasingParser(),
    },
  ],
})
export class LayoutProjectionModule {}
