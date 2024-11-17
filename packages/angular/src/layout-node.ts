import {
  DestroyRef,
  Directive,
  ElementRef,
  HostAttributeToken,
  inject,
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
 * When the `id` attribute is present, it will be used as the identity of the node.
 * Alternatively, assign a string to the `layout` attribute to specify the identity.
 * The `id` attribute has higher priority than the `layout` attribute.
 * When the identity is not explicitly specified, it will be randomly generated,
 * and format may vary depending on the {@link ProjectionNodeFactory}
 * implementation in use.
 *
 * The {@link ProjectionNode} interface is implemented by this directive, so that
 * the {@link ProjectionNode} object can be interacted with directly through
 * the directive export (using the name `layout`) or view query.
 *
 * Although this directive behave like a {@link ProjectionNode}, this directive
 * is merely a proxy to the actual {@link ProjectionNode} used within the tree.
 * The actual {@link ProjectionNode} object is available under the `kernel` property
 * of the directive instance.
 *
 * The actual {@link ProjectionNode} object is provided to the current node
 * injector, using the abstract class {@link ProjectionNode} as the token,
 * so that it can be accessed by any peer directives, by child elements,
 * via view queries, etc.
 *
 * The abstract class {@link Node} can also be used as the token to retrieve
 * the {@link ProjectionNode} object from the node injector.
 * This could be convenient if only the {@link Node} interface is needed.
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
    {
      provide: Node,
      useFactory: (dir = inject(LayoutNode, { self: true })) => dir.kernel,
    },
    {
      provide: ProjectionNode,
      useFactory: (dir = inject(LayoutNode, { self: true })) => dir.kernel,
    },
  ],
})
export class LayoutNode implements ProjectionNode {
  /**
   * The actual {@link ProjectionNode} instance within the tree.
   */
  readonly kernel: ProjectionNode;

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const factory = inject(ProjectionNodeFactory);
    const parent = inject(ProjectionNode, { skipSelf: true, optional: true });
    const identity =
      inject(new HostAttributeToken('id'), { optional: true }) ??
      inject(new HostAttributeToken('layout'), { optional: true });
    const destroyRef = inject(DestroyRef);
    this.kernel = factory.create(element, identity ?? undefined);
    if (parent) this.kernel.attach(parent);
    destroyRef.onDestroy(() => this.kernel.dispose());
  }

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
    return this.kernel.parent() as this | null;
  }
  children(): ReadonlySet<this> {
    return this.kernel.children() as ReadonlySet<this>;
  }
  dispose(): void {
    this.kernel.dispose();
  }
  traverse(consumer: (node: this) => void): void {
    this.kernel.traverse((actual) => consumer(actual as this));
  }
  track(): Iterable<this> {
    return this.kernel.track() as Iterable<this>;
  }
}
