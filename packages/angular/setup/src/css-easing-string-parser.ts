import { Injectable } from '@angular/core';
import { EasingFunction } from '@layout-projection/animation';
import { cubicBezier, easeIn, easeInOut, easeOut, linear } from 'popmotion';

import { EasingStringParser } from '../../src/easing-string-parser';

/**
 * Implementation of {@link EasingStringParser} that attempts to parse the given
 * easing string as a CSS easing string.
 *
 * Supports the following types of CSS easing strings:
 * - `linear` (not the `linear` function)
 * - `ease`
 * - `ease-in`
 * - `ease-out`
 * - `ease-in-out`
 * - `cubic-bezier(a, b, c, d)`
 *
 * When the easing string is not recognized, an error is thrown.
 */
@Injectable({ providedIn: 'root' })
export class CssEasingStringParser implements EasingStringParser {
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
