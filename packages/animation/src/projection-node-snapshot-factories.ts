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

/**
 * Creates a map of {@link ProjectionNodeSnapshot} of the tree structure
 * starting from the given node.
 * @param root the root of the tree
 * @param options
 * @returns a map of snapshots, indexed by node id
 * @throws if found duplicate node ids within the tree
 */
export function createTreeSnapshot(
  root: ProjectionNode,
): ReadonlyMap<string, ProjectionNodeSnapshot> {
  const map = new Map<string, ProjectionNodeSnapshot>();
  root.traverse((node) => {
    const id = node.identity();
    if (map.has(id)) throw new Error(`Duplicate node id: "${id}"`);
    map.set(id, createSnapshot(node));
  });
  return map;
}
