/**
 * Easing function that takes a progress number in the range [0, 1] and returns
 * a new progress number in the same range.
 *
 * This interface is compatible with easing functions from the `popmotion` library.
 */
export interface EasingFunction {
  (progress: number): number;
}
