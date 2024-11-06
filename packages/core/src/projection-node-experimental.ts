import { Layout } from './layout.js';
import { BasicNode, Node } from './node.js';
import { TransformAxisConfig, TransformConfig } from './transform.js';

/**
 * A node that is bound to a DOM element and can be projected to a new layout.
 * @see https://www.youtube.com/watch?v=5-JIu0u42Jc Inside Framer Motion's Layout Animations - Matt Perry
 * @see https://gist.github.com/TheNightmareX/f5bf72e81d2667f6036e91cf81270ef7 Layout Projection - Matt Perry
 */
export interface ProjectionNode extends Node<ProjectionNode> {
  /**
   * Returns the element of this projection node.
   */
  element(): HTMLElement;

  /**
   * Reset the node and the element to its initial state, to get ready
   * for a new round of projection.
   */
  reset(): void;

  /**
   * Measure the current layout and relevant styles of the element.
   * The result can be accessed via {@link measurement}.
   * @returns the measurement result
   */
  measure(): Measurement;

  /**
   * Return the {@link measure} result of this projection node.
   */
  measurement(): Measurement | null;

  /**
   * Projects the element to the given layout.
   * Requires this projection node to be measured.
   * @param dest the destination layout
   */
  project(dest: Layout): Projection;
}

/**
 * A snapshot of the layout and relevant styles of an element.
 */
export interface Measurement {
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
   * The final transform applied to the target element.
   */
  readonly transform: TransformConfig;
  /**
   * The aggregated transform from all ancestor elements.
   */
  readonly distortion: TransformConfig;
}

export class BasicProjectionNode
  extends BasicNode<BasicProjectionNode>
  implements ProjectionNode
{
  readonly #element: HTMLElement;

  #projection?: Projection;
  #measurement?: Measurement;

  constructor(element: HTMLElement) {
    super();
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
    const layout = Layout.from(this.#element);
    this.#measurement = { layout };
    return this.#measurement;
  }

  measurement(): Measurement | null {
    return this.#measurement ?? null;
  }

  project(dest: Layout): Projection {
    if (!this.#measurement) throw new Error('Node not measured');
    const distortion = this.aggregateAncestorTransforms();
    const transform = this.computeTransform(this.#measurement.layout, dest);
    transform.x.translate -= distortion.x.translate;
    transform.x.translate /= distortion.x.scale;
    transform.y.translate -= distortion.y.translate;
    transform.y.translate /= distortion.y.scale;
    transform.x.scale /= distortion.x.scale;
    transform.y.scale /= distortion.y.scale;

    this.#element.style.transform = [
      `translate3d(${transform.x.translate}px, ${transform.y.translate}px, 0)`,
      `scale(${transform.x.scale}, ${transform.y.scale})`,
    ].join(' ');

    this.#projection = { transform, distortion };
    return this.#projection;
  }

  private computeTransform(
    currLayout: Layout,
    destLayout: Layout,
  ): TransformConfig {
    const currMidpoint = currLayout.midpoint();
    const destMidpoint = destLayout.midpoint();

    const transform: TransformConfig = {
      x: new TransformAxisConfig({
        origin: currMidpoint.x,
        translate: destMidpoint.x - currMidpoint.x,
        scale: destLayout.width() / currLayout.width(),
      }),
      y: new TransformAxisConfig({
        origin: currMidpoint.y,
        translate: destMidpoint.y - currMidpoint.y,
        scale: destLayout.height() / currLayout.height(),
      }),
    };

    // edge case: invisible element (width/height is 0)
    if (isNaN(transform.x.scale)) transform.x.scale = 1;
    if (isNaN(transform.y.scale)) transform.y.scale = 1;

    return transform;
  }

  private aggregateAncestorTransforms(): TransformConfig {
    const transformX = TransformAxisConfig.identity();
    const transformY = TransformAxisConfig.identity();

    const parent = this.parent();

    if (!parent) return { x: transformX, y: transformY };
    if (!parent.#projection) throw new Error('Parent not projected');

    const { transform, distortion } = parent.#projection;
    transformX.translate += distortion.x.translate + transform.x.translate;
    transformY.translate += distortion.y.translate + transform.y.translate;
    transformX.scale *= distortion.x.scale * transform.x.scale;
    transformY.scale *= distortion.y.scale * transform.y.scale;

    return { x: transformX, y: transformY };
  }
}
