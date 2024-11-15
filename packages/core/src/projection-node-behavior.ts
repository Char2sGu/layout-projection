import { Layout } from './layout.js';
import { Measurement, Projection, ProjectionNode } from './projection-node.js';

/**
 * Decorator for a projection node that modifies its original behaviors.
 * Each concrete behavior class should make sure that there is only one
 * instance of behavior per node, and thus its constructor should not be
 * public.
 *
 * Tree-related methods are modified to return the behavior instances of
 * the inner nodes, by dynamically decorating the inner nodes with the
 * {@link decorate} method.
 */
export abstract class ProjectionNodeBehavior implements ProjectionNode {
  protected constructor(protected readonly kernel: ProjectionNode) {}

  element(): HTMLElement {
    return this.kernel.element();
  }

  reset(): void {
    this.kernel.reset();
  }

  measure(): Measurement {
    return this.kernel.measure();
  }

  measurement(): Measurement | null {
    return this.kernel.measurement();
  }

  project(dest: Layout): Projection {
    return this.kernel.project(dest);
  }

  projection(): Projection | null {
    return this.kernel.projection();
  }

  identity(): string {
    return this.kernel.identity();
  }

  attach(parent: ProjectionNode): void {
    this.kernel.attach(parent);
  }

  detach(): void {
    this.kernel.detach();
  }

  appendChild(child: ProjectionNode): void {
    this.kernel.appendChild(child);
  }

  removeChild(child: ProjectionNode): void {
    this.kernel.removeChild(child);
  }

  parent(): this | null {
    const parent = this.kernel.parent();
    if (parent === null) return null;
    return this.decorate(parent);
  }

  children(): ReadonlySet<this> {
    const children = new Set<this>();
    for (const child of this.kernel.children())
      children.add(this.decorate(child));
    return children;
  }

  dispose(): void {
    this.kernel.dispose();
  }

  traverse(consumer: (node: this) => void): void {
    this.kernel.traverse((node) => consumer(this.decorate(node)));
  }

  *track(): Iterable<this> {
    for (const node of this.kernel.track()) yield this.decorate(node);
  }

  /**
   * Return the behavior instance of the given node.
   * If exists, returns the previous behavior instance of this node.
   */
  protected abstract decorate(target: ProjectionNode): this;
}
