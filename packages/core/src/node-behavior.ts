import { Node } from './node.js';

/**
 * Decorator for a {@link Node} instance.
 *
 * Tree query methods will return the behavior instances of the
 * actual nodes, by dynamically decorating the returned nodes
 * via the {@link decorate} method.
 *
 * It is recommended for concrete behavior classes to offer an approach
 * to ensure that the behavior instances are unique for each node, so that
 * the same behavior instance is not created multiple times for the same node.
 */
export abstract class NodeBehavior implements Node {
  readonly #kernel: Node;

  protected constructor(kernel: Node) {
    this.#kernel = kernel;
  }

  identity(): string {
    return this.#kernel.identity();
  }

  attach(parent: Node): void {
    this.#kernel.attach(parent);
  }

  detach(): void {
    this.#kernel.detach();
  }

  appendChild(child: Node): void {
    this.#kernel.appendChild(child);
  }

  removeChild(child: Node): void {
    this.#kernel.removeChild(child);
  }

  parent(): this | null {
    const parent = this.#kernel.parent();
    if (parent === null) return null;
    return this.decorate(parent);
  }

  children(): ReadonlySet<this> {
    const children = new Set<this>();
    for (const child of this.#kernel.children())
      children.add(this.decorate(child));
    return children;
  }

  dispose(): void {
    this.#kernel.dispose();
  }

  traverse(consumer: (node: this) => void): void {
    this.#kernel.traverse((node) => consumer(this.decorate(node)));
  }

  *track(): Iterable<this> {
    for (const node of this.#kernel.track()) yield this.decorate(node);
  }

  /**
   * Return the behavior instance of the given node.
   * It should try to reuse existing behavior instance to avoid duplicate
   * behavior instances for the same node.
   */
  protected abstract decorate(target: Node): this;
}
