import * as styleUnits from 'style-value-types';

import {
  BorderRadiusConfig,
  BorderRadiusCornerConfig,
  BoundingBox,
} from './core.js';

export class NodeMeasurer {
  constructor(protected borderRadiusStyleParser: BorderRadiusStyleParser) {}

  measureBoundingBox(element: HTMLElement): BoundingBox {
    return new BoundingBox(element.getBoundingClientRect());
  }

  measureBorderRadiuses(
    element: HTMLElement,
    boundingBox: BoundingBox = this.measureBoundingBox(element),
  ): BorderRadiusConfig {
    const style = getComputedStyle(element);

    const parse = (style: string) =>
      this.borderRadiusStyleParser.parse(
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

export class BorderRadiusStyleParser {
  parse(
    style: string,
    width: number,
    height: number,
  ): BorderRadiusCornerConfig {
    if (style.match(/\d.*?px \d.*?px/u)) {
      const [x, y] = style.split(' ').map((value) => parseFloat(value));
      return { x, y };
    }
    if (styleUnits.percent.test(style)) {
      const value = parseFloat(style) / 100;
      return { x: value * width, y: value * height };
    }
    if (styleUnits.px.test(style)) {
      const value = parseFloat(style);
      return { x: value, y: value };
    }
    throw new Error(`Unsupported radius: ${style}`);
  }
}
