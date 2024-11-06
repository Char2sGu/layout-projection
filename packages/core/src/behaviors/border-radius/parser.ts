import * as styleUnits from 'style-value-types';

import { BorderRadiusCornerConfig } from './config.js';

export class CssBorderRadiusParser {
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
