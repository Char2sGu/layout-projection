import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  InPlaceMetadataManager,
  LayoutAnimationFramer,
  LayoutProjectionNodeAnimationHandler,
  MetadataManager,
} from '@layout-projection/animation';
import {
  BorderRadiusMeasurer,
  CssBorderRadiusParser,
} from '@layout-projection/core/behaviors';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // provide concrete classes themselves (no aliasing)
    // so that we can conveniently alias them via `useExisting` in other places
    {
      provide: CssBorderRadiusParser,
      useFactory: () => new CssBorderRadiusParser(),
    },
    {
      provide: BorderRadiusMeasurer,
      useFactory: () => new BorderRadiusMeasurer(inject(CssBorderRadiusParser)),
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
      provide: InPlaceMetadataManager,
      useFactory: () => new InPlaceMetadataManager(),
    },
    // provide aliases for services that are definitely shared
    // throughout all test cases
    {
      provide: MetadataManager,
      useExisting: InPlaceMetadataManager,
    },
  ],
};
