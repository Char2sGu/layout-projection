import { mix } from 'popmotion';

import { AnimationPlan, AnimationRoute } from '../animation-core.js';
import { AnimationHandler } from '../animation-engines.js';
import {
  DistortionCanceler,
  DistortionCancellationContext,
} from '../distortion.js';
import { ElementMeasurer } from '../measure.js';
import { ProjectionNode } from '../projection.js';
import { BoundingBox } from '../shared.js';

export interface BorderRadiusConfig {
  topLeft: BorderRadiusCornerConfig;
  topRight: BorderRadiusCornerConfig;
  bottomLeft: BorderRadiusCornerConfig;
  bottomRight: BorderRadiusCornerConfig;
}
export interface BorderRadiusCornerConfig {
  x: number;
  y: number;
}

export class BorderRadiusDistortionCanceller
  implements DistortionCanceler<BorderRadiusConfig>
{
  constructor(protected measurer: ElementMeasurer) {}

  measure(element: HTMLElement, boundingBox: BoundingBox): BorderRadiusConfig {
    return this.measurer.measureBorderRadiuses(element, boundingBox);
  }

  cancel(
    element: HTMLElement,
    context: DistortionCancellationContext<BorderRadiusConfig>,
  ): void {
    const { measured: radiuses, scaleX, scaleY } = context;
    const radiusStyle = (radius: BorderRadiusCornerConfig) =>
      `${radius.x / scaleX}px ${radius.y / scaleY}px`;
    element.style.borderTopLeftRadius = radiusStyle(radiuses.topLeft);
    element.style.borderTopRightRadius = radiusStyle(radiuses.topRight);
    element.style.borderBottomLeftRadius = radiusStyle(radiuses.bottomLeft);
    element.style.borderBottomRightRadius = radiusStyle(radiuses.bottomRight);
  }
}

export class BorderRadiusAnimationHandler implements AnimationHandler {
  handleFrame(
    node: ProjectionNode,
    progress: number,
    plan: AnimationPlan,
  ): void {
    const route = plan['borderRadiuses'] as AnimationRoute<BorderRadiusConfig>;
    const { from, to } = route;

    const mixRadius = (
      from: BorderRadiusCornerConfig,
      to: BorderRadiusCornerConfig,
      progress: number,
    ): BorderRadiusCornerConfig => ({
      x: mix(from.x, to.x, progress),
      y: mix(from.y, to.y, progress),
    });

    const radiuses = {
      topLeft: mixRadius(from.topLeft, to.topLeft, progress),
      topRight: mixRadius(from.topRight, to.topRight, progress),
      bottomLeft: mixRadius(from.bottomLeft, to.bottomLeft, progress),
      bottomRight: mixRadius(from.bottomRight, to.bottomRight, progress),
    };

    node.borderRadiuses = radiuses;
  }
}
