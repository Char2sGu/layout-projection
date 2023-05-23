import { CssBorderRadiusParser } from '../css.js';
import {
  DistortionCanceler,
  DistortionCancellationContext,
} from '../distortion.js';
import { BoundingBox } from '../shared.js';

export class BorderRadiusDistortionCanceller
  implements DistortionCanceler<BorderRadiusConfig>
{
  constructor(protected parser: CssBorderRadiusParser) {}

  measure(element: HTMLElement, boundingBox: BoundingBox): BorderRadiusConfig {
    const style = getComputedStyle(element);
    const parse = (style: string) =>
      this.parser.parse(style, boundingBox.width(), boundingBox.height());
    return {
      topLeft: parse(style.borderTopLeftRadius),
      topRight: parse(style.borderTopRightRadius),
      bottomLeft: parse(style.borderBottomLeftRadius),
      bottomRight: parse(style.borderBottomRightRadius),
    };
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
