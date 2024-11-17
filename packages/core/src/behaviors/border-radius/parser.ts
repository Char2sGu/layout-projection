import * as styleUnits from 'style-value-types';

import { BorderRadiusCornerConfig } from './config.js';

export abstract class BorderRadiusStyleParser {
  /**
   * Parse a CSS style string of border radius corner.
   * @param style the CSS style string
   * @param width the width of the element, in pixels
   * @param height the height of the element, in pixels
   */
  abstract parseCorner(
    style: string,
    width: number,
    height: number,
  ): BorderRadiusCornerConfig;
}

/**
 * A {@link BorderRadiusStyleParser} that can parse CSS border radius
 * styles strings returned by `window.getComputedStyle`, in the following
 * formats:
 * - `px px`
 * - `px`
 * - `%`
 */
export class ComputedStylesBorderRadiusParser
  implements BorderRadiusStyleParser
{
  parseCorner(
    style: string,
    width: number,
    height: number,
  ): BorderRadiusCornerConfig {
    if (style.match(/\d.*?px \d.*?px/u)) {
      const [x, y] = style.split(' ').map((value) => parseFloat(value));
      return new BorderRadiusCornerConfig({ x, y });
    }
    if (styleUnits.percent.test(style)) {
      const value = parseFloat(style) / 100;
      return new BorderRadiusCornerConfig({
        x: value * width,
        y: value * height,
      });
    }
    if (styleUnits.px.test(style)) {
      const value = parseFloat(style);
      return new BorderRadiusCornerConfig({ x: value, y: value });
    }
    throw new Error(`Unsupported radius: ${style}`);
  }
}
