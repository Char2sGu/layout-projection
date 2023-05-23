import { mix } from 'popmotion';

import { AnimationPlan, AnimationRoute } from '../animation-core.js';
import { AnimationHandler } from '../animation-engines.js';
import { ProjectionNode } from '../projection.js';
import { BoundingBox } from '../shared.js';

export class BoundingBoxAnimationHandler implements AnimationHandler {
  handleFrame(
    node: ProjectionNode,
    progress: number,
    plan: AnimationPlan,
  ): void {
    const route = plan['boundingBox'] as AnimationRoute<BoundingBox>;
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
