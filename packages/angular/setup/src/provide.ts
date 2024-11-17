import { inject, Provider } from '@angular/core';
import {
  ProjectionNodeFactory,
  StringEasingParser,
} from '@layout-projection/angular';
import {
  AggregationProjectionTreeAnimator,
  HandlerBasedProjectionNodeAnimator,
  InPlaceMetadataManager,
  LayoutAnimationFramer,
  LayoutProjectionNodeAnimationHandler,
  MetadataManager,
  PreventPreemptiveNodeAnimation,
  PreventPreemptiveTreeAnimation,
  ProjectionNodeAnimator,
  ProjectionTreeAnimator,
} from '@layout-projection/animation';
import {
  BorderRadiusMeasurer,
  BorderRadiusStyleParser,
  ComputedStyleBorderRadiusMeasurer,
  ComputedStylesBorderRadiusParser,
} from '@layout-projection/core/behaviors';

import { BasicProjectionNodeFactory } from './basic-projection-node-factory';
import { CssEasingParser } from './css-easing-parser';

/**
 * Provide the required services using built-in implementations.
 */
// eslint-disable-next-line max-lines-per-function
export function provideLayoutProjectionBuiltinSetup(): Provider[] {
  return [
    {
      provide: InPlaceMetadataManager,
      useFactory: () => new InPlaceMetadataManager(),
    },
    {
      provide: MetadataManager,
      useExisting: InPlaceMetadataManager,
    },
    {
      provide: ComputedStylesBorderRadiusParser,
      useFactory: () => new ComputedStylesBorderRadiusParser(),
    },
    {
      provide: BorderRadiusStyleParser,
      useExisting: ComputedStylesBorderRadiusParser,
    },
    {
      provide: ComputedStyleBorderRadiusMeasurer,
      useFactory: () =>
        new ComputedStyleBorderRadiusMeasurer(inject(BorderRadiusStyleParser)),
    },
    {
      provide: BorderRadiusMeasurer,
      useExisting: ComputedStyleBorderRadiusMeasurer,
    },
    {
      provide: LayoutAnimationFramer,
      useFactory: () => new LayoutAnimationFramer(),
    },
    {
      provide: LayoutProjectionNodeAnimationHandler,
      useFactory: () =>
        new LayoutProjectionNodeAnimationHandler(
          inject(LayoutAnimationFramer),
          inject(MetadataManager),
        ),
    },
    {
      provide: ProjectionNodeAnimator,
      useFactory: () => {
        let instance: ProjectionNodeAnimator;
        instance = new HandlerBasedProjectionNodeAnimator([
          inject(LayoutProjectionNodeAnimationHandler),
        ]);
        instance = new PreventPreemptiveNodeAnimation(instance);
        return instance;
      },
    },
    {
      provide: ProjectionTreeAnimator,
      useFactory: () => {
        let instance: ProjectionTreeAnimator;
        instance = new AggregationProjectionTreeAnimator(
          inject(ProjectionNodeAnimator),
        );
        instance = new PreventPreemptiveTreeAnimation(instance);
        return instance;
      },
    },
    {
      provide: StringEasingParser,
      useExisting: CssEasingParser,
    },
    {
      provide: ProjectionNodeFactory,
      useExisting: BasicProjectionNodeFactory,
    },
  ];
}
