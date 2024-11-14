/* eslint-disable no-console */
import { inject, Provider } from '@angular/core';
import {
  ProjectionTreeAnimationConfig,
  ProjectionTreeAnimator,
} from '@layout-projection/animation';

/**
 * Provide {@link ProjectionTreeAnimator} use a debugging {@link ProjectionTreeAnimator}
 * that logs the animation config to console and then delegates to the parent animator.
 * @returns
 */
export function provideDebuggingProjectionTreeAnimator(): Provider[] {
  return [
    {
      provide: ProjectionTreeAnimator,
      useFactory: (
        base = inject(ProjectionTreeAnimator, { skipSelf: true }),
      ) => ({
        animate(config: ProjectionTreeAnimationConfig) {
          console.debug(config);
          return base.animate(config);
        },
      }),
    },
  ];
}
