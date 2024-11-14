import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChildren,
} from '@angular/core';
import {
  AggregationProjectionTreeAnimator,
  createTreeSnapshot,
  HandlerBasedProjectionNodeAnimator,
  LayoutProjectionNodeAnimationHandler,
  PreventPreemptiveNodeAnimation,
  PreventPreemptiveTreeAnimation,
  ProjectionNodeAnimator,
  ProjectionTreeAnimator,
} from '@layout-projection/animation';
import { BasicProjectionNode, ProjectionNode } from '@layout-projection/core';
import {
  BorderRadiusMeasurer,
  CalibrateBorderRadius,
  MeasureBorderRadius,
} from '@layout-projection/core/behaviors';
import { linear } from 'popmotion';

@Component({
  selector: 'lpj-core-shared-elements',
  standalone: true,
  imports: [],
  providers: [
    {
      provide: ProjectionNodeAnimator,
      useFactory: () => {
        let instance: ProjectionNodeAnimator =
          new HandlerBasedProjectionNodeAnimator([
            inject(LayoutProjectionNodeAnimationHandler),
          ]);
        instance = new PreventPreemptiveNodeAnimation(instance);
        return instance;
      },
    },
    {
      provide: ProjectionTreeAnimator,
      useFactory: () => {
        let instance: ProjectionTreeAnimator =
          new AggregationProjectionTreeAnimator(inject(ProjectionNodeAnimator));
        instance = new PreventPreemptiveTreeAnimation(instance);
        return instance;
      },
    },
  ],
  templateUrl: './core-shared-elements.component.html',
  styleUrl: './core-shared-elements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreSharedElementsComponent {
  private animator = inject(ProjectionTreeAnimator);
  private borderRadiusMeasurer = inject(BorderRadiusMeasurer);

  container = inject<ElementRef<HTMLElement>>(ElementRef);
  cards = viewChildren<ElementRef<HTMLElement>>('card');
  overlay?: ProjectionNode;

  ngAfterViewInit(): void {
    const container = this.createNode(this.container.nativeElement, 'root');

    this.cards().forEach((elementRef, index) => {
      const card = this.createNode(elementRef.nativeElement, 'card-' + index);
      card.attach(container);

      card.element().addEventListener('click', async () => {
        card.element().style.zIndex = '1';

        container.traverse((n) => n.measure());
        const from = createTreeSnapshot(container);

        this.overlay?.element().remove();
        this.overlay?.dispose();
        this.overlay = this.createNode(
          document.createElement('div'),
          'overlay',
        );
        this.overlay.element().classList.add('overlay');
        this.overlay.attach(card);
        card.element().appendChild(this.overlay.element());

        container.traverse((n) => n.reset());
        container.traverse((n) => n.measure());
        const to = createTreeSnapshot(container);
        await this.animator.animate({
          root: container,
          from,
          to,
          duration: 1000,
          easing: linear,
        });

        card.element().style.zIndex = '';
      });
    });
  }

  createNode(element: HTMLElement, id: string): ProjectionNode {
    let node: ProjectionNode = new BasicProjectionNode(element, id);

    node = new MeasureBorderRadius(node, this.borderRadiusMeasurer);
    node = new CalibrateBorderRadius(node);

    return node;
  }
}
