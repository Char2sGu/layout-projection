import { Equatable, Measurement } from '@layout-projection/core';

/**
 * A snapshot of the current state of a projection node.
 *
 * Two snapshots are considered equal if:
 * - they share the same ID, and
 * - they all have or don't have measurement, and
 * - their measurements are equal, if available
 * - they have the same parent ID, or no parent
 * - they have the same children IDs, in the same order
 */
export interface ProjectionNodeSnapshot extends Equatable {
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
   * The array of ordered distinct IDs of the children nodes.
   */
  readonly children: readonly string[];
}
