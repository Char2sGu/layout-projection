import { inject, ModuleWithProviders, NgModule, Provider } from '@angular/core';
import {
  CssBorderRadiusParser,
  CssEasingParser,
  ElementMeasurer,
  LayoutAnimator,
  ProjectionNodeAnimationEngine,
  ProjectionNodeSnapper,
  ProjectionTreeAnimationEngine,
} from '@layout-projection/core';

import { LayoutAnimationEntryDirective } from './layout-animation-entry.directive';
import { LayoutAnimationScopeDirective } from './layout-animation-scope.directive';
import {
  LayoutAnimationScopeEntryRegistrarDirective,
  LayoutAnimationScopeNodeRegistrarDirective,
} from './layout-animation-scope-registrar.directives';
import { LayoutAnimationSelfTriggerDirective } from './layout-animation-self-trigger.directive';
import { LayoutAnimationTriggerDirective } from './layout-animation-trigger.directive';
import { ProjectionNodeDirective } from './projection-node.directive';

const DIRECTIVES = [
  ProjectionNodeDirective,
  LayoutAnimationEntryDirective,
  LayoutAnimationScopeDirective,
  LayoutAnimationScopeNodeRegistrarDirective,
  LayoutAnimationScopeEntryRegistrarDirective,
  LayoutAnimationTriggerDirective,
  LayoutAnimationSelfTriggerDirective,
];

@NgModule({
  imports: DIRECTIVES,
  exports: DIRECTIVES,
})
export class LayoutProjectionModule {
  static forRoot(): ModuleWithProviders<LayoutProjectionModule> {
    return {
      ngModule: LayoutProjectionModule,
      providers: PROVIDERS,
    };
  }
}

const PROVIDERS: Provider[] = [
  {
    provide: LayoutAnimator,
    useFactory: () =>
      new LayoutAnimator(
        inject(ProjectionTreeAnimationEngine),
        inject(ElementMeasurer),
        inject(CssEasingParser),
      ),
  },
  {
    provide: ProjectionNodeAnimationEngine,
    useFactory: () => new ProjectionNodeAnimationEngine(),
  },
  {
    provide: ProjectionTreeAnimationEngine,
    useFactory: () =>
      new ProjectionTreeAnimationEngine(inject(ProjectionNodeAnimationEngine)),
  },
  {
    provide: ElementMeasurer,
    useFactory: () => new ElementMeasurer(inject(CssBorderRadiusParser)),
  },
  {
    provide: ProjectionNodeSnapper,
    useFactory: () => new ProjectionNodeSnapper(inject(ElementMeasurer)),
  },
  {
    provide: CssBorderRadiusParser,
    useFactory: () => new CssBorderRadiusParser(),
  },
  {
    provide: CssEasingParser,
    useFactory: () => new CssEasingParser(),
  },
];
