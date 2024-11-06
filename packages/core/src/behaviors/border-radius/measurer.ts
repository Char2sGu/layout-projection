import { Layout } from '../../layout.js';
import { BorderRadiusConfig } from './config.js';
import { CssBorderRadiusParser } from './parser.js';

export class BorderRadiusMeasurer {
  constructor(protected parser: CssBorderRadiusParser) {}

  measure(
    element: HTMLElement,
    layout = Layout.from(element),
  ): BorderRadiusConfig {
    const style = getComputedStyle(element);

    const parse = (style: string) =>
      this.parser.parse(style, layout.width(), layout.height());

    return {
      topLeft: parse(style.borderTopLeftRadius),
      topRight: parse(style.borderTopRightRadius),
      bottomLeft: parse(style.borderBottomLeftRadius),
      bottomRight: parse(style.borderBottomRightRadius),
    };
  }
}
