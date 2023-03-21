import { LayoutBorderRadiuses, LayoutBoundingBox } from './core.js';
import { LayoutMeasurer } from './layout-measurement.js';
import { LayoutProjectionNode } from './layout-projection.js';

export class LayoutSnapper {
  constructor(protected measurer: LayoutMeasurer) {}

  snapshot(root: LayoutProjectionNode): LayoutSnapshot {
    const snapshot = new LayoutSnapshot();

    root.traverse(
      (node) => {
        const boundingBox = this.measurer.measureBoundingBox(node.element);
        const borderRadiuses = this.measurer.measureBorderRadiuses(
          node.element,
          boundingBox,
        );

        if (snapshot.has(node.id))
          throw new Error(`Node ID conflict: "${node.id}"`);

        snapshot.set(node.id, {
          element: node.element,
          boundingBox,
          borderRadiuses,
        });
      },
      { includeSelf: true },
    );

    return snapshot;
  }
}

export class LayoutSnapshot extends Map<
  LayoutProjectionNode['id'],
  LayoutNodeSnapshot
> {}

export interface LayoutNodeSnapshot {
  element: HTMLElement;
  boundingBox: LayoutBoundingBox;
  borderRadiuses: LayoutBorderRadiuses;
}
