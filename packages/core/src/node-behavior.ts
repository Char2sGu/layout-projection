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
    return new LazyMappedReadonlySet(
      this.#kernel.children(), //
      (child) => this.decorate(child),
    );
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

/**
 * A {@link ReadonlySet} where the values are mapped to another value of
 * the same type when accessed.
 */
class LazyMappedReadonlySet<From, To> implements ReadonlySet<To> {
  readonly size: number;

  private readonly map = new Map<From, To>();

  constructor(
    private readonly original: ReadonlySet<From>,
    private readonly mapper: (value: From) => To,
  ) {
    this.size = original.size;
  }

  forEach(
    callbackfn: (value: To, value2: To, set: ReadonlySet<To>) => void,
    thisArg?: any,
  ): void {
    this.original.forEach((value) => {
      const mapped = this.mapped(value);
      callbackfn.call(thisArg, mapped, mapped, this);
    });
  }

  has(value: To): boolean {
    for (const original of this.original)
      if (this.mapped(original) === value) return true;
    return false;
  }

  *[Symbol.iterator](): IterableIterator<To> {
    const values = this.original.values();
    for (const value of values) yield this.mapped(value);
  }

  *entries(): IterableIterator<[To, To]> {
    for (const value of this[Symbol.iterator]()) yield [value, value];
  }

  keys(): IterableIterator<To> {
    return this[Symbol.iterator]();
  }
  values(): IterableIterator<To> {
    return this[Symbol.iterator]();
  }

  private mapped(value: From): To {
    let mapped = this.map.get(value);
    if (mapped === undefined) {
      mapped = this.mapper(value);
      this.map.set(value, mapped);
    }
    return mapped;
  }
}
