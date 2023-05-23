import { mix } from 'popmotion';

import { AnimationPlanner, AnimationPlanningContext } from '../animation.js';
import { AnimationPlan, AnimationRoute } from '../animation-core.js';
import { AnimationHandler } from '../animation-engines.js';
import { ElementMeasurer } from '../measure.js';
import {
  ProjectionComponent,
  ProjectionDistortion,
  ProjectionNode,
} from '../projection.js';
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

const PROP_NAME = 'borderRadiuses';
export interface BorderRadiusProperties {
  [PROP_NAME]: BorderRadiusConfig;
}

export class BorderRadiusDistortionCanceller
  implements ProjectionComponent<BorderRadiusProperties>
{
  constructor(protected measurer: ElementMeasurer) {}

  measureProperties(
    element: HTMLElement,
    boundingBox: BoundingBox,
  ): BorderRadiusProperties {
    return {
      borderRadiuses: this.measurer.measureBorderRadiuses(element, boundingBox),
    };
  }

  cancelDistortion(
    element: HTMLElement,
    { borderRadiuses: radiuses }: BorderRadiusProperties,
    { scaleX, scaleY }: ProjectionDistortion,
  ): void {
    const radiusStyle = (radius: BorderRadiusCornerConfig) =>
      `${radius.x / scaleX}px ${radius.y / scaleY}px`;
    element.style.borderTopLeftRadius = radiusStyle(radiuses.topLeft);
    element.style.borderTopRightRadius = radiusStyle(radiuses.topRight);
    element.style.borderBottomLeftRadius = radiusStyle(radiuses.bottomLeft);
    element.style.borderBottomRightRadius = radiusStyle(radiuses.bottomRight);
  }
}

export class BorderRadiusAnimationComponent
  implements AnimationPlanner, AnimationHandler
{
  buildPlan(
    context: AnimationPlanningContext<BorderRadiusProperties>,
  ): Partial<AnimationPlan> {
    const { node, snapshot } = context;
    const route: AnimationRoute<BorderRadiusConfig> = {
      from: snapshot?.[PROP_NAME] ?? node[PROP_NAME],
      to: node[PROP_NAME],
    };
    return { [PROP_NAME]: route };
  }

  handleFrame(
    node: ProjectionNode,
    progress: number,
    plan: AnimationPlan,
  ): void {
    const route = plan[PROP_NAME] as AnimationRoute<BorderRadiusConfig>;
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

    node[PROP_NAME] = radiuses;
  }
}
