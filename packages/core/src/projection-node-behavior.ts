import { Layout } from './layout.js';
import { NodeBehavior } from './node-behavior.js';
import { Measurement, Projection, ProjectionNode } from './projection-node.js';

/**
 * Decorator for a {@link ProjectionNode} instance.
 *
 * Tree query methods will return the behavior instances of the
 * actual nodes, by dynamically decorating the returned nodes
 * via the {@link decorate} method.
 *
 * It is recommended for concrete behavior classes to offer an approach
 * to ensure that the behavior instances are unique for each node, so that
 * the same behavior instance is not created multiple times for the same node.
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
