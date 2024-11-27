import { inject, Provider } from '@angular/core';
import {
  EasingStringParser,
  ProjectionNodeFactory,
} from '@layout-projection/angular';
import {
  CompositeProjectionAnimator,
  InPlaceMetadataManager,
  LayoutAnimationFramer,
  LayoutProjectionAnimationHandler,
  MetadataManager,
  ProjectionAnimator,
} from '@layout-projection/animation';
import {
  BorderRadiusMeasurer,
  BorderRadiusStyleParser,
  ComputedStyleBorderRadiusMeasurer,
  ComputedStylesBorderRadiusParser,
} from '@layout-projection/core/behaviors';

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
 * - {@link MetadataManager} <-- {@link InPlaceMetadataManager}
 * - {@link ProjectionNodeFactory} <-- {@link BasicProjectionNodeFactory}
 *    - {@link BorderRadiusMeasurer} <-- {@link ComputedStyleBorderRadiusMeasurer}
 *    - {@link BorderRadiusStyleParser} <-- {@link ComputedStylesBorderRadiusParser}
 * - {@link ProjectionAnimator} <-- {@link CompositeProjectionAnimator}
 *    - handlers: [{@link LayoutProjectionAnimationHandler}] <br/>
 * - {@link EasingStringParser} <-- {@link CssEasingStringParser}
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
      provide: LayoutProjectionAnimationHandler,
      useFactory: () =>
        new LayoutProjectionAnimationHandler(
          inject(LayoutAnimationFramer),
          inject(MetadataManager),
        ),
    },
    {
      provide: ProjectionAnimator,
      useFactory: () =>
        new CompositeProjectionAnimator([
          inject(LayoutProjectionAnimationHandler),
        ]),
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
