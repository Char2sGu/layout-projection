import {
  Layout,
  Measurement,
  Projection,
  ProjectionNode,
} from '@layout-projection/core';

/**
 * A proxy that behaves like a {@link ProjectionNode}
 * but actually forwards all calls to a kernel {@link ProjectionNode} object.
 */
export abstract class ProjectionNodeProxy implements ProjectionNode {
  /**
   * Return the proxied {@link ProjectionNode} object.
   */
  abstract kernel(): ProjectionNode;

  element(): HTMLElement {
    return this.kernel().element();
  }
  reset(): void {
    this.kernel().reset();
  }
  measure(): Measurement {
    return this.kernel().measure();
  }
  measurement(): Measurement | null {
    return this.kernel().measurement();
  }
  project(dest: Layout): Projection {
    return this.kernel().project(dest);
  }
  projection(): Projection | null {
    return this.kernel().projection();
  }
  identity(): string {
    return this.kernel().identity();
  }
  attach(parent: ProjectionNode): void {
    this.kernel().attach(parent);
  }
  detach(): void {
    this.kernel().detach();
  }
  appendChild(child: ProjectionNode): void {
    this.kernel().appendChild(child);
  }
  removeChild(child: ProjectionNode): void {
    this.kernel().removeChild(child);
  }
  parent(): this | null {
    return this.kernel().parent() as this | null;
  }
  children(): ReadonlySet<this> {
    return this.kernel().children() as ReadonlySet<this>;
  }
  dispose(): void {
    this.kernel().dispose();
  }
  traverse(consumer: (node: this) => void): void {
    this.kernel().traverse((actual) => consumer(actual as this));
  }
  track(): Iterable<this> {
    return this.kernel().track() as Iterable<this>;
  }
}
