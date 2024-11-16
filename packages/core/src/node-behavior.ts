import { Node } from './node.js';

/**
 * Decorator for a node that modifies its original behaviors.
 * Each concrete behavior class should make sure that there is only one
 * instance of behavior per node, and thus its constructor should not be
 * public.
 *
 * Tree query methods are modified to return the behavior instances of
 * the inner nodes, by dynamically decorating the inner nodes with the
 * {@link decorate} method.
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
   * If exists, returns the previous behavior instance of this node.
   */
  protected abstract decorate(target: Node): this;
}
