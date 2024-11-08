import { Measurement } from '@layout-projection/core';

/**
 * A snapshot of the current state of a projection node.
 */
export interface ProjectionNodeSnapshot {
  readonly id: string;
  readonly element: HTMLElement;
  readonly measurement: Measurement | null;
  readonly parent: string | null;
  readonly children: ReadonlySet<string>;
}
