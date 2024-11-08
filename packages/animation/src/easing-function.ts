/**
 * Easing function that takes a progress number in the range [0, 1] and returns
 * a new progress number in the same range.
 */
export interface EasingFunction {
  (progress: number): number;
}
