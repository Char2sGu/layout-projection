import {
  inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule,
  Provider,
  Type,
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

const DIRECTIVES = [
  ProjectionNodeDirective,
  LayoutAnimationEntryDirective,
  LayoutAnimationScopeDirective,
  LayoutAnimationScopeNodeRegistrarDirective,
  LayoutAnimationScopeEntryRegistrarDirective,
  LayoutAnimationTriggerDirective,
  LayoutAnimationSelfTriggerDirective,
];

const STATIC_PROVIDERS: Provider[] = [
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

@NgModule({
  imports: DIRECTIVES,
  exports: DIRECTIVES,
})
export class LayoutProjectionModule {
  static forRoot(
    config: LayoutProjectionProvidersConfig = {},
  ): ModuleWithProviders<LayoutProjectionModule> {
    const provideMultiTokenUsingClasses = (
      token: unknown,
      types: Type<unknown>[],
    ) => types.map((type) => ({ provide: token, useClass: type, multi: true }));

    return {
      ngModule: LayoutProjectionModule,
      providers: [
        STATIC_PROVIDERS,
        provideMultiTokenUsingClasses(
          PROJECTION_COMPONENTS,
          config.components ?? [],
        ),
        provideMultiTokenUsingClasses(
          ANIMATION_HANDLERS,
          config.animationHandlers ?? [],
        ),
        provideMultiTokenUsingClasses(
          ANIMATION_PLANNERS,
          config.animationPlanners ?? [],
        ),
      ],
    };
  }
}

export interface LayoutProjectionProvidersConfig {
  components?: Type<ProjectionComponent>[];
  animationHandlers?: Type<AnimationHandler>[];
  animationPlanners?: Type<AnimationPlanner>[];
}
