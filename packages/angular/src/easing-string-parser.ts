import { Injectable } from '@angular/core';
import { EasingFunction } from '@layout-projection/animation';

/**
 * Service that parses string representations of easing functions into easing
 * functions.
 */
@Injectable()
export abstract class EasingStringParser {
  /**
   * Parse a string easing representation into an easing function.
   * @param easing string representation of the easing function
   */
  abstract parse(easing: string): EasingFunction;
}
