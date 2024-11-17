import { Equatable } from './equality.js';
import { Layout } from './layout.js';
import {
  computeTransformBetween,
  transformLayout,
} from './layout-transform.js';
import { BasicNode, Node } from './node.js';
import { Transform2D } from './transform.js';

/**
 * A {@link Node} that is bound to a DOM element and can accurately project the element
 * into an arbitrary layout.
 * @see https://www.youtube.com/watch?v=5-JIu0u42Jc Inside Framer Motion's Layout Animations - Matt Perry
 * @see https://gist.github.com/TheNightmareX/f5bf72e81d2667f6036e91cf81270ef7 Layout Projection - Matt Perry
 */
export abstract class ProjectionNode extends Node {
  /**
   * Returns the corresponding element of this projection node.
   */
  abstract element(): HTMLElement;

  /**
   * Reset the node and the element to prepare for the next projection:
   * - remove any applied transform on the element
   * - clear the measurement and projection information
   */
  abstract reset(): void;

  /**
   * Measure the current layout and relevant styles of the element.
   * The result can also be accessed via {@link measurement}.
   * @returns the measurement result
   */
  abstract measure(): Measurement;

  /**
   * Return the latest {@link measure} result of this projection node, or null
   * if no measurement has been performed ever, or since the last
   * {@link reset}.
   */
  abstract measurement(): Measurement | null;

  /**
   * Projects the element to the given layout by applying a CSS transform.
   * Requires the {@link measurement} to exist and up-to-date.
   *
   * All ancestor projection nodes will be taken into account, to cancel the
   * transform distortion resulted by their projection.
   * Parent nodes should always be projected before their children.
   *
   * @param dest the destination layout
   * @returns information about the performed projection
   */
  abstract project(dest: Layout): Projection;

  /**
   * Return the information about the current projection, or null
   * if no projection has been performed ever, or since the last
   * {@link reset}.
   */
  abstract projection(): Projection | null;
}

/**
 * A snapshot of the layout and relevant styles of an element.
 */
export interface Measurement extends Equatable {
  /**
   * The layout of the element at the time of measurement.
   */
  readonly layout: Layout;
}

/**
 * Information about a performed projection.
 */
export interface Projection {
  /**
   * The measurement used for this projection.
   */
  readonly measurement: Measurement;
  /**
   * The layout of the element before this projection, potentially
   * distorted by parent projection.
   */
  readonly layoutFrom: Layout;
  /**
   * The destination layout the element was projected to.
   */
  readonly layoutDest: Layout;
  /**
   * The actual transform applied on the element to project it from its
   * current, potentially distorted, layout to the destination layout.
   */
  readonly transformApplied: Transform2D;
  /**
   * The theoretical transform that projects the element from its
   * original, undistorted, layout to the destination layout.
   */
  readonly transformPhysical: Transform2D;
}

export class BasicProjectionNode extends BasicNode implements ProjectionNode {
  readonly #element: HTMLElement;

  #projection?: Projection;
  #measurement?: Measurement;

  constructor(element: HTMLElement, id: string) {
    super(id);
    this.#element = element;
  }

  element(): HTMLElement {
    return this.#element;
  }

  reset(): void {
    this.#projection = undefined;
    this.#measurement = undefined;
    this.#element.style.transform = '';
  }

  measure(): Measurement {
    const layout = Layout.fromElement(this.#element);
    this.#measurement = {
      layout,
      equals: (other) => layout.equals(other.layout),
    };
    return this.#measurement;
  }

  measurement(): Measurement | null {
    return this.#measurement ?? null;
  }

  project(dest: Layout): Projection {
    const measurement = this.#measurement;
    if (!measurement) throw new Error('Node not measured');

    const parentProjection = this.parent()?.projection();

    let curr = measurement.layout;
    if (parentProjection)
      curr = transformLayout(
        curr,
        parentProjection.transformPhysical,
        parentProjection.measurement.layout.midpoint,
      );

    let transform = computeTransformBetween(curr, dest);
    if (parentProjection) {
      const translateX =
        transform.x.translate / parentProjection.transformPhysical.x.scale;
      const translateY =
        transform.y.translate / parentProjection.transformPhysical.y.scale;
      transform = Transform2D.config({
        x: { translate: translateX, scale: transform.x.scale },
        y: { translate: translateY, scale: transform.y.scale },
      });
    }

    this.#element.style.transform = [
      `translate3d(${transform.x.translate}px, ${transform.y.translate}px, 0)`,
      `scale(${transform.x.scale}, ${transform.y.scale})`,
    ].join(' ');

    this.#projection = {
      measurement,
      layoutFrom: curr,
      layoutDest: dest,
      transformApplied: transform,
      transformPhysical: computeTransformBetween(measurement.layout, dest),
    };
    return this.#projection;
  }

  projection(): Projection | null {
    return this.#projection ?? null;
  }
}
