import { Injectable } from '@angular/core';
import { StringEasingParser } from '@layout-projection/angular';
import { EasingFunction } from '@layout-projection/animation';
import { cubicBezier, easeIn, easeInOut, easeOut, linear } from 'popmotion';

@Injectable({ providedIn: 'root' })
export class CssEasingParser implements StringEasingParser {
  parse(easing: string): EasingFunction {
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
