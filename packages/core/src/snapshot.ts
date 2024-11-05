import { MeasuredProjectionNode, ProjectionNode } from './projection-node.js';

export class ProjectionNodeSnapper {
  snapshot(node: ProjectionNode): ProjectionNodeSnapshot {
    if (!node.measured()) throw new Error(`Node "${node.id}" not measured`);
    const result = { ...node };
    result.children = new Set(node.children);
    return result;
  }

  snapshotTree(
    root: ProjectionNode,
    options: ProjectionTreeSnapshotOptions = {},
  ): ProjectionNodeSnapshotMap {
    const map = new ProjectionNodeSnapshotMap();
    const visitedIds = new Set<ProjectionNode['id']>();
    root.traverse(
      (node) => {
        if (options.filter && !options.filter(node)) return;
        if (visitedIds.has(node.id))
          throw new Error(`Node ID conflict: "${node.id}"`);
        visitedIds.add(node.id);
        if (options.measure) node.measure();
        map.set(node.id, this.snapshot(node));
      },
      { includeSelf: true },
    );
    return map;
  }
}

export interface ProjectionTreeSnapshotOptions {
  filter?: (node: ProjectionNode) => boolean;
  measure?: boolean;
}

export type ProjectionNodeSnapshot = {
  [K in keyof MeasuredProjectionNode as MeasuredProjectionNode[K] extends (
    ...args: any[]
  ) => any
    ? never
    : K]: MeasuredProjectionNode[K];
};

export class ProjectionNodeSnapshotMap extends Map<
  ProjectionNode['id'],
  ProjectionNodeSnapshot
> {
  merge(other: ProjectionNodeSnapshotMap): void {
    for (const [id, snapshot] of other) this.set(id, snapshot);
  }
}
