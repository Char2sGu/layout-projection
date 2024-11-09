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

@Component({
  selector: 'lpj-case-projection',
  standalone: true,
  imports: [],
  templateUrl: './case-projection.component.html',
  styleUrl: './case-projection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaseProjectionComponent {
  private borderRadiusMeasurer = inject(BorderRadiusMeasurer);

  container = viewChild.required<ElementRef<HTMLElement>>('container');
  content = viewChild.required<ElementRef<HTMLElement>>('content');

  ngAfterViewInit(): void {
    const container = this.createNode(this.container().nativeElement);
    const content = this.createNode(this.content().nativeElement);
    content.attach(container);

    this.container().nativeElement.addEventListener('click', () => {
      container.reset();
      content.reset();
      container.measure();
      content.measure();

      container.project(
        new Layout({
          top: 50,
          left: 50,
          right: window.innerWidth,
          bottom: window.innerHeight,
        }),
      );
      content.project(
        new Layout({
          top: window.innerHeight - 100,
          left: window.innerWidth / 2,
          right: window.innerWidth,
          bottom: window.innerHeight,
        }),
      );
    });
  }

  createNode(element: HTMLElement): ProjectionNode {
    let node: ProjectionNode = new BasicProjectionNode(element);

    node = new MeasureBorderRadius(node, this.borderRadiusMeasurer);
    node = new CalibrateBorderRadius(node);

    return node;
  }
}
