import { Injectable } from '@angular/core';
import { EasingFunction } from '@layout-projection/animation';

@Injectable()
export abstract class StringEasingParser {
  /**
   * Parse a string easing representation into an easing function.
   * @param easing string representation of the easing function
   */
  abstract parse(easing: string): EasingFunction;
}
