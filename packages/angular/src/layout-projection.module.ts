import {
  inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  Provider,
} from '@angular/core';
import {
  AnimationHandler,
  AnimationPlanner,
  CssEasingParser,
  LayoutAnimator,
  ProjectionComponent,
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

export const PROJECTION_COMPONENTS = new InjectionToken<ProjectionComponent[]>(
  'PROJECTION_COMPONENTS',
  { factory: () => [] },
);
export const ANIMATION_HANDLERS = new InjectionToken<AnimationHandler[]>(
  'ANIMATION_HANDLERS',
  { factory: () => [] },
);
export const ANIMATION_PLANNERS = new InjectionToken<AnimationPlanner[]>(
  'ANIMATION_PLANNERS',
  { factory: () => [] },
);

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
        inject(CssEasingParser),
        inject(ANIMATION_PLANNERS),
      ),
  },
  {
    provide: ProjectionNodeAnimationEngine,
    useFactory: () =>
      new ProjectionNodeAnimationEngine(inject(ANIMATION_HANDLERS)),
  },
  {
    provide: ProjectionTreeAnimationEngine,
    useFactory: () =>
      new ProjectionTreeAnimationEngine(inject(ProjectionNodeAnimationEngine)),
  },
  {
    provide: CssEasingParser,
    useFactory: () => new CssEasingParser(),
  },
  {
    provide: ProjectionNodeSnapper,
    useFactory: () => new ProjectionNodeSnapper(),
  },
];
