import { Layout } from './layout.js';

/**
 * During a projection, aside from the layout, many other CSS properties
 * might be distorted too, such as border radius, box shadow, etc.
 * A ProjectionComponent is responsible for handling such additional CSS properties
 * of an element for projection.
 */

export interface ProjectionComponent<Properties extends object = object> {
  /**
   * Measures the target properties of the given element.
   * @param element target element
   * @param layout current layout of the element
   * @returns the measured properties
   */
  measureProperties(element: HTMLElement, layout: Layout): Properties;

  /**
   * Update the given element to cancel the distortion during projection.
   * @param element target element
   * @param measured measured properties before the projection, usually by `measureProperties`
   * @param distortion the distortion to cancel
   */
  cancelDistortion(
    element: HTMLElement,
    measured: Properties,
    distortion: ProjectionDistortion,
  ): void;
}

export interface ProjectionDistortion {
  scaleX: number;
  scaleY: number;
}
