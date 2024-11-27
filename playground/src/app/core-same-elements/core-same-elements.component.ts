import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from '@angular/core';
import {
  createSnapshot,
  ProjectionAnimator,
} from '@layout-projection/animation';
import { BasicProjectionNode, ProjectionNode } from '@layout-projection/core';
import {
  BorderRadiusMeasurer,
  CalibrateBorderRadius,
  MeasureBorderRadius,
} from '@layout-projection/core/behaviors';
import { linear } from 'popmotion';

import { paintLayout } from '../debugger';

@Component({
  selector: 'lpj-core-same-elements',
  standalone: true,
  imports: [],
  templateUrl: './core-same-elements.component.html',
  styleUrl: './core-same-elements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreSameElementsComponent {
  private animator = inject(ProjectionAnimator);
  private borderRadiusMeasurer = inject(BorderRadiusMeasurer);

  container = viewChild.required<ElementRef<HTMLElement>>('container');
  outerBox = viewChild.required<ElementRef<HTMLElement>>('outerBox');
  innerBox = viewChild.required<ElementRef<HTMLElement>>('innerBox');

  painted = new Set<HTMLElement>();

  ngAfterViewInit(): void {
    let flag = false;

    const container = this.createNode(this.container().nativeElement, 'root');
    const outerBox = this.createNode(this.outerBox().nativeElement, 'outerBox');
    outerBox.attach(container);
    const innerBox = this.createNode(this.innerBox().nativeElement, 'innerBox');
    innerBox.attach(outerBox);

    container.element().setAttribute('flag', String(flag));

    this.container().nativeElement.addEventListener('click', async () => {
      container.traverse((n) => n.measure());
      const containerFrom = createSnapshot(container);

      flag = !flag;
      container.element().setAttribute('flag', String(flag));
      container.traverse((n) => n.reset());
      container.traverse((n) => n.measure());
      const containerTo = createSnapshot(container);

      this.painted.forEach((e) => e.remove());
      this.painted.add(paintLayout(containerFrom.measurement!.layout));
      this.painted.add(paintLayout(containerTo.measurement!.layout));

      await this.animator.animate({
        node: container,
        from: containerFrom,
        to: containerTo,
        duration: 1000,
        easing: linear,
      });
    });
  }

  createNode(element: HTMLElement, id: string): ProjectionNode {
    let node: ProjectionNode = new BasicProjectionNode(element, id);

    node = MeasureBorderRadius.for(node, this.borderRadiusMeasurer);
    node = CalibrateBorderRadius.for(node);

    return node;
  }
}
