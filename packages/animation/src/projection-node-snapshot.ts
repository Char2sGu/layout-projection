import { Measurement } from '@layout-projection/core';

/**
 * A snapshot of the current state of a projection node.
 */
export interface ProjectionNodeSnapshot {
  /**
   * The ID of the owner of this snapshot.
   */
  readonly id: string;
  /**
   * The current measurement of the node, or `null` if not available.
   */
  readonly measurement: Measurement | null;
  /**
   * The ID of the parent node, or `null` if this node has no parent.
   */
  readonly parent: string | null;
  /**
   * The set of IDs of the children nodes.
   */
  readonly children: ReadonlySet<string>;
}
