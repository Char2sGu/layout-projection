/**
 * A node in a tree structure.
 */
export interface Node<Self extends Node<Self>> {
  /**
   * Assign a ID to this node. The ID cannot be assigned again.
   * @throws Error if an ID has already been assigned.
   */
  identifyAs(id: string): void;

  /**
   * Returns whether an ID has been assigned to this node.
   */
  identified(): boolean;

  /**
   * Returns the ID of this node.
   * Might be a random string if no ID has been assigned.
   */
  identity(): string;

  /**
   * Attach this node as a child of the given parent node.
   * One node can only have one parent.
   * @param parent another node
   */
  attach(parent: Self): void;

  /**
   * Detach this node from its current parent.
   * @throws Error if no parent.
   */
  detach(): void;

  /**
   * Return the parent node of this projection node.
   */
  parent(): Self | null;

  /**
   * Return the child nodes of this projection node.
   */
  children(): ReadonlySet<Self>;

  /**
   * Dispose this node and all its children.
   * Must be invoked when the node is no longer needed.
   * Duplicate invocations have no effect.
   */
  dispose(): void;

  /**
   * Traverse down the node tree starting from this node.
   * @param consumer invoked on each node
   */
  traverse(consumer: (node: Self) => void): void;

  /**
   * Track the path from the this node to the root.
   * @returns an iterable object, where the first value is parent of the current node
   * and the last value is the root node.
   */
  track(): Iterable<Self>;
}

export class BasicNode<Self extends BasicNode<Self>> implements Node<Self> {
  private static nextAnonymousId = 1;

  #id: string | null = null;
  #identified = false;
  #parent: Self | null = null;
  readonly #children: Set<Self> = new Set();

  identifyAs(id: string): void {
    if (this.#identified) throw new Error('Node already identified.');
    this.#id = id;
    this.#identified = true;
  }

  identified(): boolean {
    return this.#identified;
  }

  identity(): string {
    this.#id ??= `anonymous-${BasicNode.nextAnonymousId++}`;
    return this.#id;
  }

  attach(parent: Self): void {
    if (this.#parent !== null) throw new Error('Node already has a parent.');
    this.#parent = parent;
    parent.#children.add(this as unknown as Self);
  }

  detach(): void {
    if (this.#parent === null) throw new Error('Node has no parent.');
    this.#parent.#children.delete(this as unknown as Self);
    this.#parent = null;
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
