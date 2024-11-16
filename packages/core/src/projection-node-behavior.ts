import { Layout } from './layout.js';
import { NodeBehavior } from './node-behavior.js';
import { Measurement, Projection, ProjectionNode } from './projection-node.js';

/**
 * Decorator for a projection node that modifies its original behaviors.
 * Each concrete behavior class should make sure that there is only one
 * instance of behavior per node, and thus its constructor should not be
 * public.
 *
 * Tree query methods are modified to return the behavior instances of
 * the inner nodes, by dynamically decorating the inner nodes with the
 * {@link decorate} method.
 */
export abstract class ProjectionNodeBehavior
  extends NodeBehavior
  implements ProjectionNode
{
  #kernel: ProjectionNode;

  protected constructor(kernel: ProjectionNode) {
    super(kernel);
    this.#kernel = kernel;
  }

  element(): HTMLElement {
    return this.#kernel.element();
  }

  reset(): void {
    this.#kernel.reset();
  }

  measure(): Measurement {
    return this.#kernel.measure();
  }

  measurement(): Measurement | null {
    return this.#kernel.measurement();
  }

  project(dest: Layout): Projection {
    return this.#kernel.project(dest);
  }

  projection(): Projection | null {
    return this.#kernel.projection();
  }
}
