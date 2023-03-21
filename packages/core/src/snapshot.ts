import { BorderRadiusConfig, BoundingBox } from './core.js';
import { NodeMeasurer } from './measurement.js';
import { Node } from './node.js';

export class NodeSnapper {
  constructor(protected measurer: NodeMeasurer) {}

  snapshot(node: Node): NodeSnapshot {
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

  snapshotTree(root: Node): NodeSnapshotMap {
    const snapshots = new NodeSnapshotMap();
    root.traverse(
      (node) => {
        if (snapshots.has(node.id))
          throw new Error(`Node ID conflict: "${node.id}"`);
        snapshots.set(node.id, this.snapshot(node));
      },
      { includeSelf: true },
    );
    return snapshots;
  }
}

export interface NodeSnapshot {
  element: HTMLElement;
  boundingBox: BoundingBox;
  borderRadiuses: BorderRadiusConfig;
}

export class NodeSnapshotMap extends Map<Node['id'], NodeSnapshot> {}
