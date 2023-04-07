import { ElementMeasurer } from './measure.js';
import { ProjectionNode } from './projection.js';
import { BorderRadiusConfig, BoundingBox } from './shared.js';

export class ProjectionNodeSnapper {
  constructor(protected measurer: ElementMeasurer) {}

  snapshot(node: ProjectionNode, snapshots: ProjectionNodeSnapshotMap): void {
    const boundingBox = this.measurer.measureBoundingBox(node.element);
    const borderRadiuses = this.measurer.measureBorderRadiuses(
      node.element,
      boundingBox,
    );
    snapshots.set(node.id, {
      element: node.element,
      boundingBox,
      borderRadiuses,
    });
  }

  snapshotTree(
    root: ProjectionNode,
    snapshots: ProjectionNodeSnapshotMap,
    filter?: (node: ProjectionNode) => boolean,
  ): void {
    const visitedIds = new Set<ProjectionNode['id']>();
    root.traverse(
      (node) => {
        if (filter && !filter(node)) return;
        if (visitedIds.has(node.id))
          throw new Error(`Node ID conflict: "${node.id}"`);
        visitedIds.add(node.id);
        this.snapshot(node, snapshots);
      },
      { includeSelf: true },
    );
  }
}

export interface ProjectionNodeSnapshot {
  element: HTMLElement;
  boundingBox: BoundingBox;
  borderRadiuses: BorderRadiusConfig;
}

export class ProjectionNodeSnapshotMap extends Map<
  ProjectionNode['id'],
  ProjectionNodeSnapshot
> {}
