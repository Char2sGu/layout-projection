import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import {
  BasicProjectionNode,
  Layout,
  ProjectionNode,
} from '@layout-projection/core';
import {
  BorderRadiusMeasurer,
  CalibrateBorderRadius,
  MeasureBorderRadius,
} from '@layout-projection/core/behaviors';

import { paintLayout } from '../debugger';

@Component({
  selector: 'lpj-core-projection',
  standalone: true,
  imports: [],
  templateUrl: './core-projection.component.html',
  styleUrl: './core-projection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreProjectionComponent {
  private borderRadiusMeasurer = inject(BorderRadiusMeasurer);

  container = viewChild.required<ElementRef<HTMLElement>>('container');
  content = viewChild.required<ElementRef<HTMLElement>>('content');

  painted = new Set<HTMLElement>();

  ngAfterViewInit(): void {
    const container = this.createNode(this.container().nativeElement, 'parent');
    const content = this.createNode(this.content().nativeElement, 'child');
    content.attach(container);

    this.container().nativeElement.addEventListener('click', () => {
      container.reset();
      content.reset();
      container.measure();
      content.measure();

      const containerProjection = container.project(
        Layout.fromEdges({
          top: 50,
          left: 50,
          right: window.innerWidth,
          bottom: window.innerHeight,
        }),
      );
      const contentProjection = content.project(
        Layout.fromEdges({
          top: window.innerHeight - 100,
          left: window.innerWidth / 2,
          right: window.innerWidth,
          bottom: window.innerHeight,
        }),
      );

      this.painted.forEach((e) => e.remove());

      this.painted.add(paintLayout(containerProjection.layoutFrom));
      this.painted.add(paintLayout(containerProjection.layoutDest));
      this.painted.add(paintLayout(contentProjection.layoutFrom));
      this.painted.add(paintLayout(contentProjection.layoutDest));
    });
  }

  createNode(element: HTMLElement, id: string): ProjectionNode {
    let node: ProjectionNode = new BasicProjectionNode(element, id);

    node = MeasureBorderRadius.for(node, this.borderRadiusMeasurer);
    node = CalibrateBorderRadius.for(node);

    return node;
  }
}
