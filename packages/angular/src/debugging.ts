/* eslint-disable no-console */
import { inject, Provider } from '@angular/core';
import {
  MetadataManager,
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
      ): ProjectionTreeAnimator => ({
        animate(config: ProjectionTreeAnimationConfig) {
          console.debug('animate:', config);
          return base.animate(config);
        },
      }),
    },
  ];
}

export function provideDebuggingMetadataManager(): Provider[] {
  return [
    {
      provide: MetadataManager,
      useFactory: (
        base = inject(MetadataManager, { skipSelf: true }),
      ): MetadataManager => ({
        define(target, token, value) {
          console.debug('metadata:define', { target, token, value });
          base.define(target, token, value);
        },
        resolve(target, token) {
          const result = base.resolve(target, token);
          console.debug('metadata:resolve', { target, token, result });
          return result;
        },
      }),
    },
  ];
}
