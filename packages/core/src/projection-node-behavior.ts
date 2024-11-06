import { Layout } from './layout.js';
import { Measurement, Projection, ProjectionNode } from './projection-node.js';

/**
 * Decorator for a projection node that modifies behaviors.
 */
export abstract class ProjectionNodeBehavior implements ProjectionNode {
  constructor(protected kernel: ProjectionNode) {}

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

  identifyAs(id: string): void {
    this.kernel.identifyAs(id);
  }

  identified(): boolean {
    return this.kernel.identified();
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

  parent(): ProjectionNode | null {
    return this.kernel.parent();
  }

  children(): ReadonlySet<ProjectionNode> {
    return this.kernel.children();
  }

  dispose(): void {
    this.kernel.dispose();
  }

  traverse(consumer: (node: ProjectionNode) => void): void {
    this.kernel.traverse(consumer);
  }

  track(): Iterable<ProjectionNode> {
    return this.kernel.track();
  }
}
