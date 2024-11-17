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
  Projection,
  ProjectionNode,
} from '@layout-projection/core';

import { ProjectionNodeFactory } from './projection-node-factory';

/**
 * Directive for constructing the Projection Tree.
 * Apply this directive to an element to make it a Projection Node within the tree.
 *
 * When the `id` attribute is present, it will be used as the identity of the node.
 * Otherwise, the identity of the node will be generated and is not determinant.
 *
 * Parent-child relationships are automatically established by the DOM hierarchy.
 *
 * The {@link ProjectionNode} interface is implemented by this directive, so that
 * the {@link ProjectionNode} instance can be interacted with directly through
 * the directive export or view query.
 *
 * Although this directive behave like a {@link ProjectionNode}, the actual node instance
 * that is used within the tree is under the `kernel` property of the directive instance.
 *
 * The actual {@link ProjectionNode} instance is provided to the current node injector,
 * so that it can be accessed by any peer directives, child elements, view queries, etc.
 *
 * @example
 *  ```html
 *  <div layout id="container" #containerNode="layout">
 *    <div layout id="box-1"></div>
 *    <div layout id="box-2"></div>
 *  </div>
 *  ```
 * @example
 *  ```ts
 *  rootNode = viewChild.required(ProjectionNode);
 *  // alternatively
 *  rootNode = viewChild.required(LayoutNode);
 *  ```
 */
@Directive({
  standalone: true,
  selector: '[layout]',
  exportAs: 'layout',
  providers: [
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
    const identity = inject(new HostAttributeToken('id'), { optional: true });
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
