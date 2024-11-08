import { EasingFunction } from './easing-function.js';

/**
 * Essential configuration for any animations.
 */
export interface AnimationConfig {
  duration: number;
  easing: EasingFunction;
}
