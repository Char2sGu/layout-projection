import {
  cubicBezier,
  easeIn,
  easeInOut,
  easeOut,
  Easing,
  linear,
} from 'popmotion';
import * as styleUnits from 'style-value-types';

import { BorderRadiusCornerConfig } from './core.js';

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

export class CssEasingParser {
  parse(easing: string): Easing {
    if (easing === 'linear') {
      return linear;
    } else if (easing === 'ease') {
      return easeInOut;
    } else if (easing === 'ease-in') {
      return easeIn;
    } else if (easing === 'ease-out') {
      return easeOut;
    } else if (easing === 'ease-in-out') {
      return easeInOut;
    } else if (easing.startsWith('cubic-bezier')) {
      const [a, b, c, d] = easing
        .replace('cubic-bezier(', '')
        .replace(')', '')
        .split(',')
        .map((v) => parseFloat(v));
      return cubicBezier(a, b, c, d);
    }
    throw new Error(`Unsupported easing string: ${easing}`);
  }
}
