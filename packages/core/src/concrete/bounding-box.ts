import { mix } from 'popmotion';

import { AnimationPlanner, AnimationPlanningContext } from '../animation.js';
import { AnimationPlan, AnimationRoute } from '../animation-core.js';
import { AnimationHandler } from '../animation-engines.js';
import { ProjectionNode } from '../projection.js';
import { BoundingBox } from '../shared.js';
import {
  ProjectionNodeSnapshot,
  ProjectionNodeSnapshotMap,
} from '../snapshot.js';

const ROUTE_NAME = 'boundingBox';

export class BoundingBoxAnimationHandler implements AnimationHandler {
  handleFrame(
    node: ProjectionNode,
    progress: number,
    plan: AnimationPlan,
  ): void {
    const route = plan[ROUTE_NAME] as AnimationRoute<BoundingBox>;
    const { from, to } = route;
    const dest = new BoundingBox({
      top: mix(from.top, to.top, progress),
      left: mix(from.left, to.left, progress),
      right: mix(from.right, to.right, progress),
      bottom: mix(from.bottom, to.bottom, progress),
    });
    node.project(dest);
  }
}

export class BoundingBoxAnimationPlanner implements AnimationPlanner {
  plan(context: AnimationPlanningContext): AnimationPlan {
    const { root, node, snapshot, snapshots, estimation } = context;
    const from =
      snapshot?.boundingBox ||
      (estimation && this.estimate(root, node, snapshots)) ||
      node.boundingBox;
    const to = node.boundingBox;
    return { [ROUTE_NAME]: { from, to } };
  }

  estimate(
    root: ProjectionNode,
    node: ProjectionNode,
    snapshots: ProjectionNodeSnapshotMap,
  ): BoundingBox | undefined {
    if (!node.measured()) throw new Error('Unknown node');

    let ancestor: ProjectionNode = node;
    let ancestorSnapshot: ProjectionNodeSnapshot | undefined = undefined;
    while ((ancestorSnapshot = snapshots.get(ancestor.id)) === undefined) {
      if (ancestor === root || !ancestor.parent) return;
      ancestor = ancestor.parent;
    }
    if (!ancestor.measured()) throw new Error('Unknown ancestor');

    const transform = ancestor.calculateTransform(ancestorSnapshot.boundingBox);
    const scale = transform.x.scale;

    return new BoundingBox({
      top:
        ancestorSnapshot.boundingBox.top -
        (ancestor.boundingBox.top - node.boundingBox.top) * scale,
      left:
        ancestorSnapshot.boundingBox.left -
        (ancestor.boundingBox.left - node.boundingBox.left) * scale,
      right:
        ancestorSnapshot.boundingBox.right -
        (ancestor.boundingBox.right - node.boundingBox.right) * scale,
      bottom:
        ancestorSnapshot.boundingBox.top -
        (ancestor.boundingBox.top - node.boundingBox.bottom) * scale,
    });
  }
}
