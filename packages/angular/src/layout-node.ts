import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  OnInit,
} from '@angular/core';
import {
  Layout,
  Measurement,
  Node,
  Projection,
  ProjectionNode,
} from '@layout-projection/core';

import { ProjectionNodeFactory } from './projection-node-factory';

/**
 * Directive for constructing the Projection Tree.
 *
 * Apply this directive to an element to make it a Projection Node within the tree.
 * Parent-child relationships are automatically established and maintained based on
 * the DOM hierarchy.
 *
 * Assign a string to the `layout` attribute to specify the identity of the node.
 * When the `layout` attribute does not have a value, the `id` attribute will be
 * considered as the identity of the node, if present.
 * If no identity is explicitly specified, it will be randomly generated, and
 * the format of the randomly generated id is up to the {@link ProjectionNodeFactory}
 * implementation in use.
 *
 * This directive implements the {@link ProjectionNode} interface by delegating
 * all the method calls to the actual {@link ProjectionNode} object within the tree.
 * Note that the actual {@link ProjectionNode} object is created lazily during the
 * {@link OnInit} lifecycle hook, and thus invoking any method before the initialization
 * will result in an error.
 *
 * In most cases, the directive can be used as if it were the actual {@link ProjectionNode}
 * object, unless the object reference to the actual node is required, such as
 * when defining metadata for the node.
 * In such cases, the {@link kernel} method can be used to retrieve the actual
 * {@link ProjectionNode} object that is used within the tree.
 *
 * The instance of this directive is automatically provided to the current node
 * injector using the class {@link LayoutNode} as the token, while it is also
 * possible to retrieve the same directive instance by using the {@link ProjectionNode}
 * and {@link Node} abstract classes as the token.
 *
 * @example
 * Assigning identities via the `id` attribute and the `layout` attribute:
 *  ```html
 *  <div id="container" layout>
 *    <div layout="box-1"></div>
 *    <div layout="box-2"></div>
 *  </div>
 *  ```
 *
 * @example
 * Accessing (the proxy of) the ProjectionNode object through the
 * directive export:
 *  ```html
 *  <div id="container" layout #containerNode="layout">
 *    <div layout="box-1"></div>
 *    <div layout="box-2"></div>
 *  </div>
 *  ```
 *
 * @example
 * Accessing the ProjectionNode object in the host component through
 * view query:
 *  ```ts
 *  nodes = viewChildren(ProjectionNode);
 *  root = viewChild.required(ProjectionNode);
 *  ```
 *
 * @example
 * Accessing the current ProjectionNode object in a peer directive:
 *  ```ts
 *  \@Directive({ ... })
 *  export class PeerDirective {
 *    private readonly node = inject(ProjectionNode, { self: true });
 *  }
 *  ```
 *
 * @example
 * Accessing the parent ProjectionNode object in a child component/directive:
 * ```ts
 *  \@Directive({ ... })
 *  export class ChildDirective {
 *    private readonly parent = inject(ProjectionNode, { skipSelf: true });
 *  }
 * ```
 */
@Directive({
  standalone: true,
  selector: '[layout]',
  exportAs: 'layout',
  providers: [
    { provide: Node, useExisting: LayoutNode },
    { provide: ProjectionNode, useExisting: LayoutNode },
  ],
  host: {
    // When the user uses the `[input]="value"` binding on an attribute
    // the attribute will be interpreted as an input and will be removed
    // from the DOM element. Thus here we use the `[attr.input]` binding
    // to enforce Angular to keep the attributes on the element.
    '[attr.id]': 'id()',
    '[attr.layout]': 'layout()',
  },
})
export class LayoutNode implements ProjectionNode, OnInit {
  readonly #element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly #factory = inject(ProjectionNodeFactory);
  readonly #parent = inject(ProjectionNode, { skipSelf: true, optional: true });
  readonly #destroyRef = inject(DestroyRef);

  #kernel?: ProjectionNode; // INVARIANT: non-null constant after `ngOnInit`

  readonly id = input<string>();
  readonly layout = input<string>();

  ngOnInit(): void {
    const identity = this.layout() || this.id();
    this.#kernel = this.#factory.create(this.#element, identity);
    if (this.#parent) this.#kernel.attach(this.#parent);
    this.#destroyRef.onDestroy(() => this.kernel().dispose());
  }

  /**
   * Return the actual {@link ProjectionNode} instance within the tree.
   * @throws {Error} when called before initialization
   */
  kernel(): ProjectionNode {
    if (!this.#kernel)
      throw new Error('kernel is not available before initialization');
    return this.#kernel;
  }

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
