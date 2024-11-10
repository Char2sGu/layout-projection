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
  #elementRef = inject(ElementRef);
  #destroyRef = inject(DestroyRef);
  #factory = inject(ProjectionNodeFactory);
  #parent = inject(ProjectionNode, { skipSelf: true, optional: true });
  #identity = inject(new HostAttributeToken('id'), { optional: true });

  readonly kernel = this.#factory.create(this.#elementRef.nativeElement);

  constructor() {
    if (this.#parent) this.kernel.attach(this.#parent);
    this.#destroyRef.onDestroy(() => this.kernel.dispose());
    if (this.#identity) this.kernel.identifyAs(this.#identity);
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
  identifyAs(id: string): void {
    this.kernel.identifyAs(id);
  }
  identified(): boolean {
    return this.kernel.identified();
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
  parent(): ProjectionNode | null {
    return this.kernel.parent();
  }
  children(): ReadonlySet<ProjectionNode> {
    return this.kernel.children();
  }
  dispose(): void {
    this.kernel.dispose();
  }
  traverse(consumer: (node: ProjectionNode) => void): void {
    this.kernel.traverse(consumer);
  }
  track(): Iterable<ProjectionNode> {
    return this.kernel.track();
  }
}
