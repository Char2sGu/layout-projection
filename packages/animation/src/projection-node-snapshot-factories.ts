import { ProjectionNode } from '@layout-projection/core';

import { ProjectionNodeSnapshot } from './projection-node-snapshot.js';

/**
 * Creates a snapshot of the given projection node.
 */
export function createSnapshot(node: ProjectionNode): ProjectionNodeSnapshot {
  return {
    id: node.identity(),
    element: node.element(),
    measurement: node.measurement(),
    parent: node.parent()?.identity() ?? null,
    children: new Set([...node.children()].map((child) => child.identity())),
  };
}

/**
 * Creates a map of snapshots of the tree starting from the given node.
 * @param root the root of the tree
 * @param options
 * @returns a map of snapshots, indexed by node id
 * @throws Error if found duplicate node ids within the tree
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
