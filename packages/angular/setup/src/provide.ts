import { inject, Provider } from '@angular/core';
import { ProjectionNodeFactory } from '@layout-projection/angular';
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

import { EasingStringParser } from '../../src/easing-string-parser';
import { BasicProjectionNodeFactory } from './basic-projection-node-factory';
import { CssEasingStringParser } from './css-easing-string-parser';

/**
 * Provide the necessary services using built-in implementations
 * to setup the layout projection directives.
 *
 * This setup is sufficient for simple use cases such as animating
 * interactive components. For more complex use cases, it might be
 * preferable to provide custom implementations of the services.
 *
 * Primary Services:
 * - {@link MetadataManager} <-- {@link InPlaceMetadataManager}
 * - {@link ProjectionNodeFactory} <-- {@link BasicProjectionNodeFactory}
 * - {@link ProjectionNodeAnimator} <-- {@link HandlerBasedProjectionNodeAnimator}
 *    - handlers: [{@link LayoutProjectionNodeAnimationHandler}] <br/>
 *    - behaviors: [{@link PreventPreemptiveNodeAnimation}] <br/>
 * - {@link ProjectionTreeAnimator} <-- {@link AggregationProjectionTreeAnimator}
 *    - behaviors: [{@link PreventPreemptiveTreeAnimation}]
 *
 * Supporting Services:
 * - {@link EasingStringParser} <-- {@link CssEasingStringParser}
 * - {@link BorderRadiusMeasurer} <-- {@link ComputedStyleBorderRadiusMeasurer}
 * - {@link BorderRadiusStyleParser} <-- {@link ComputedStylesBorderRadiusParser}
 */
// eslint-disable-next-line max-lines-per-function -- it's common for providers declarations to be long
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
      provide: EasingStringParser,
      useExisting: CssEasingStringParser,
    },
    {
      provide: ProjectionNodeFactory,
      useExisting: BasicProjectionNodeFactory,
    },
  ];
}
