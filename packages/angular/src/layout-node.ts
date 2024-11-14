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
 * The {@link ProjectionNode} instance can be accessed via the `layout` directive export.
 *
 * @example
 *  ```html
 *  <div layout id="container" #containerNode="layout">
 *    <div layout id="box-1"></div>
 *    <div layout id="box-2"></div>
 *  </div>
 *  ```
 */
@Directive({
  standalone: true,
  selector: '[layout]',
  exportAs: 'layout',
  providers: [
    {
      provide: ProjectionNode,
      useExisting: LayoutNode,
    },
  ],
})
export class LayoutNode implements ProjectionNode {
  readonly #kernel: ProjectionNode;

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const factory = inject(ProjectionNodeFactory);
    const parent = inject(ProjectionNode, { skipSelf: true, optional: true });
    const identity = inject(new HostAttributeToken('id'), { optional: true });
    const destroyRef = inject(DestroyRef);
    this.#kernel = factory.create(element, identity ?? undefined);
    if (parent) this.#kernel.attach(parent);
    destroyRef.onDestroy(() => this.#kernel.dispose());
  }

  element(): HTMLElement {
    return this.#kernel.element();
  }
  reset(): void {
    this.#kernel.reset();
  }
  measure(): Measurement {
    return this.#kernel.measure();
  }
  measurement(): Measurement | null {
    return this.#kernel.measurement();
  }
  project(dest: Layout): Projection {
    return this.#kernel.project(dest);
  }
  projection(): Projection | null {
    return this.#kernel.projection();
  }
  identity(): string {
    return this.#kernel.identity();
  }
  attach(parent: ProjectionNode): void {
    this.#kernel.attach(parent);
  }
  detach(): void {
    this.#kernel.detach();
  }
  appendChild(child: ProjectionNode): void {
    this.#kernel.appendChild(child);
  }
  removeChild(child: ProjectionNode): void {
    this.#kernel.removeChild(child);
  }
  parent(): ProjectionNode | null {
    return this.#kernel.parent();
  }
  children(): ReadonlySet<ProjectionNode> {
    return this.#kernel.children();
  }
  dispose(): void {
    this.#kernel.dispose();
  }
  traverse(consumer: (node: ProjectionNode) => void): void {
    this.#kernel.traverse(consumer);
  }
  track(): Iterable<ProjectionNode> {
    return this.#kernel.track();
  }
}
