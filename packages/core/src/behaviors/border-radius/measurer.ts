import { Layout } from '../../layout.js';
import { BorderRadiusConfig } from './config.js';
import { BorderRadiusStyleParser } from './parser.js';

export abstract class BorderRadiusMeasurer {
  /**
   * Measure the border radius of an element.
   * @param element the target element
   * @param layout the current layout of the element
   */
  abstract measure(element: HTMLElement, layout: Layout): BorderRadiusConfig;
}

/**
 * A {@link BorderRadiusMeasurer} that measures the border radius of an element
 * by parsing the computed style of the element via `window.getComputedStyle`.
 */
export class ComputedStyleBorderRadiusMeasurer implements BorderRadiusMeasurer {
  constructor(protected parser: BorderRadiusStyleParser) {}

  measure(element: HTMLElement, layout: Layout): BorderRadiusConfig {
    const style = getComputedStyle(element);

    const parse = (style: string) =>
      this.parser.parseCorner(style, layout.width, layout.height);

    return new BorderRadiusConfig({
      topLeft: parse(style.borderTopLeftRadius),
      topRight: parse(style.borderTopRightRadius),
      bottomLeft: parse(style.borderBottomLeftRadius),
      bottomRight: parse(style.borderBottomRightRadius),
    });
  }
}
