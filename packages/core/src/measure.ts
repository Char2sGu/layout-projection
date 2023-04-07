import { CssBorderRadiusParser } from './css.js';
import { BorderRadiusConfig, BoundingBox } from './shared.js';

export class ElementMeasurer {
  constructor(protected borderRadiusParser: CssBorderRadiusParser) {}

  measureBoundingBox(element: HTMLElement): BoundingBox {
    return new BoundingBox(element.getBoundingClientRect());
  }

  measureBorderRadiuses(
    element: HTMLElement,
    boundingBox: BoundingBox = this.measureBoundingBox(element),
  ): BorderRadiusConfig {
    const style = getComputedStyle(element);

    const parse = (style: string) =>
      this.borderRadiusParser.parse(
        style,
        boundingBox.width(),
        boundingBox.height(),
      );

    return {
      topLeft: parse(style.borderTopLeftRadius),
      topRight: parse(style.borderTopRightRadius),
      bottomLeft: parse(style.borderBottomLeftRadius),
      bottomRight: parse(style.borderBottomRightRadius),
    };
  }
}
