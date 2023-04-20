import { ElementMeasurer } from './measure.js';
import { ProjectionNode } from './projection.js';
import { BorderRadiusConfig, BoundingBox } from './shared.js';

export class ProjectionNodeSnapper {
  constructor(protected measurer: ElementMeasurer) {}

  snapshot(node: ProjectionNode): ProjectionNodeSnapshot {
    const boundingBox = this.measurer.measureBoundingBox(node.element);
    const borderRadiuses = this.measurer.measureBorderRadiuses(
      node.element,
      boundingBox,
    );
    return {
      element: node.element,
      boundingBox,
      borderRadiuses,
    };
  }

  snapshotTree(
    root: ProjectionNode,
    filter?: (node: ProjectionNode) => boolean,
  ): ProjectionNodeSnapshotMap {
    const map = new ProjectionNodeSnapshotMap();
    const visitedIds = new Set<ProjectionNode['id']>();
    root.traverse(
      (node) => {
        if (filter && !filter(node)) return;
        if (visitedIds.has(node.id))
          throw new Error(`Node ID conflict: "${node.id}"`);
        visitedIds.add(node.id);
        map.set(node.id, this.snapshot(node));
      },
      { includeSelf: true },
    );
    return map;
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
> {
  merge(other: ProjectionNodeSnapshotMap): void {
    for (const [id, snapshot] of other) this.set(id, snapshot);
  }
}
