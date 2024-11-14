/**
 * A node in a tree structure.
 */
export abstract class Node<Self extends Node<Self>> {
  /**
   * Returns the ID of this node.
   */
  abstract identity(): string;

  /**
   * Attach this node as a child of the given parent node.
   * One node can only have one parent.
   * @param parent another node
   */
  abstract attach(parent: Self): void;

  /**
   * Detach this node from its current parent.
   * @throws Error if no parent.
   */
  abstract detach(): void;

  /**
   * Append a child node to this node.
   * @param child
   */
  abstract appendChild(child: Self): void;

  /**
   * Remove a child node from this node.
   * Do nothing if the given node is not a child.
   * @param child
   */
  abstract removeChild(child: Self): void;

  /**
   * Return the parent node of this projection node.
   */
  abstract parent(): Self | null;

  /**
   * Return the child nodes of this projection node.
   */
  abstract children(): ReadonlySet<Self>;

  /**
   * Dispose this node and all its children.
   * Must be invoked when the node is no longer needed.
   * Duplicate invocations have no effect.
   */
  abstract dispose(): void;

  /**
   * Traverse down the node tree starting from this node.
   * @param consumer invoked on each node
   */
  abstract traverse(consumer: (node: Self) => void): void;

  /**
   * Track the path from the this node to the root.
   * @returns an iterable object, where the first value is parent of the current node
   * and the last value is the root node.
   */
  abstract track(): Iterable<Self>;
}

export class BasicNode<Self extends BasicNode<Self>> implements Node<Self> {
  readonly #id: string;
  #parent: Self | null = null;
  readonly #children: Set<Self> = new Set();

  constructor(id: string) {
    this.#id = id;
  }

  identity(): string {
    return this.#id;
  }

  attach(parent: Self): void {
    if (this.#parent !== null) throw new Error('Node already has a parent.');
    parent.appendChild(this as unknown as Self);
    this.#parent = parent;
  }

  detach(): void {
    if (this.#parent === null) throw new Error('Node has no parent.');
    this.#parent.removeChild(this as unknown as Self);
    this.#parent = null;
  }

  appendChild(child: Self): void {
    this.#children.add(child);
  }

  removeChild(child: Self): void {
    this.#children.delete(child);
  }

  parent(): Self | null {
    return this.#parent;
  }

  children(): ReadonlySet<Self> {
    return this.#children;
  }

  dispose(): void {
    if (this.#parent !== null) this.detach();
    for (const child of this.#children) child.dispose();
  }

  traverse(consumer: (node: Self) => void): void {
    consumer(this as unknown as Self);
    for (const child of this.#children) child.traverse(consumer);
  }

  *track(): Iterable<Self> {
    let current: Self | null = this.#parent;
    while (current !== null) {
      yield current;
      current = current.#parent;
    }
  }
}
