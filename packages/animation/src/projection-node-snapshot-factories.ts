import { isEqual, ProjectionNode } from '@layout-projection/core';

import { ProjectionNodeSnapshot } from './projection-node-snapshot.js';

/**
 * Creates a {@link ProjectionNodeSnapshot} of the given {@link ProjectionNode}.
 */
export function createSnapshot(node: ProjectionNode): ProjectionNodeSnapshot {
  return {
    id: node.identity(),
    measurement: node.measurement(),
    parent: node.parent()?.identity() ?? null,
    children: [...node.children()].map((child) => child.identity()),
    equals(other) {
      if (this === other) return true;
      return (
        this.id === other.id &&
        this.parent === other.parent &&
        isEqual(this.measurement, other.measurement) &&
        this.children.length === other.children.length &&
        this.children.every((child, index) => child === other.children[index])
      );
    },
  };
}
