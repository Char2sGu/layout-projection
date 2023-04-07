import { NodeMeasurer } from './measure.js';
import { Node } from './node.js';
import { BorderRadiusConfig, BoundingBox } from './shared.js';

export class NodeSnapper {
  constructor(protected measurer: NodeMeasurer) {}

  snapshot(node: Node, snapshots: NodeSnapshotMap): void {
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
    root: Node,
    snapshots: NodeSnapshotMap,
    filter?: (node: Node) => boolean,
  ): void {
    const visitedIds = new Set<Node['id']>();
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

export interface NodeSnapshot {
  element: HTMLElement;
  boundingBox: BoundingBox;
  borderRadiuses: BorderRadiusConfig;
}

export class NodeSnapshotMap extends Map<Node['id'], NodeSnapshot> {}
