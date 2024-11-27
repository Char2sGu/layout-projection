/* eslint-disable no-console */
import { inject, Provider } from '@angular/core';
import {
  MetadataManager,
  ProjectionAnimator,
} from '@layout-projection/animation';

/**
 * Provide {@link MetadataManager} use a debugging implementation
 * that logs metadata operations to console before delegating to the actual
 * implementation
 *
 * The actual implementation is fetched from the parent injector, and thus
 * this debugging implementation must not be provided at the root injector
 * level.
 */
export function provideLayoutProjectionDebugger(): Provider[] {
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
    {
      provide: ProjectionAnimator,
      useFactory: (
        base = inject(ProjectionAnimator, { skipSelf: true }),
      ): ProjectionAnimator => {
        let idNext = 1;
        return {
          animate(config) {
            const id = idNext++;
            console.debug(`[${id}] animate ${config.node.identity()}`, config);
            const ref = base.animate(config);
            ref.then((r) => {
              const msg = `[${id}] animation ${config.node.identity()} ${r}`;
              console.debug(msg);
            });
            return ref;
          },
        };
      },
    },
  ];
}
