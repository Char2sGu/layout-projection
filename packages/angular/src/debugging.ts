/* eslint-disable no-console */
import { inject, Provider } from '@angular/core';
import { MetadataManager } from '@layout-projection/animation';

/**
 * Provide {@link MetadataManager} use a debugging implementation
 * that logs metadata operations to console before delegating to the actual
 * implementation
 *
 * The actual implementation is fetched from the parent injector, and thus
 * this debugging implementation must not be provided at the root injector
 * level.
 */
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
