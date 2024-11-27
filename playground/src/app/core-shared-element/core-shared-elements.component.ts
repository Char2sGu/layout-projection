import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChildren,
} from '@angular/core';
import {
  AnimationRef,
  createSnapshot,
  ProjectionAnimator,
  ProjectionNodeSnapshot,
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
  templateUrl: './core-shared-elements.component.html',
  styleUrl: './core-shared-elements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreSharedElementsComponent {
  private animator = inject(ProjectionAnimator);
  private borderRadiusMeasurer = inject(BorderRadiusMeasurer);

  container = inject<ElementRef<HTMLElement>>(ElementRef);
  cards = viewChildren<ElementRef<HTMLElement>>('card');
  overlay?: ProjectionNode;

  // eslint-disable-next-line max-lines-per-function
  ngAfterViewInit(): void {
    const container = this.createNode(this.container.nativeElement, 'root');

    // eslint-disable-next-line max-lines-per-function
    this.cards().forEach((elementRef, index) => {
      const card = this.createNode(elementRef.nativeElement, 'card-' + index);
      card.attach(container);

      card.element().addEventListener('click', async () => {
        card.element().style.zIndex = '1';

        container.traverse((n) => n.reset());
        const prev = new Map<string, ProjectionNodeSnapshot>();
        container.traverse((n) => {
          n.measure();
          prev.set(n.identity(), createSnapshot(n));
        });

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
        const curr = new Map<string, ProjectionNodeSnapshot>();
        container.traverse((n) => {
          n.measure();
          curr.set(n.identity(), createSnapshot(n));
        });

        const animations: AnimationRef<unknown>[] = [];
        container.traverse((n) => {
          const from = prev.get(n.identity());
          const to = curr.get(n.identity());
          if (!from || !to) return;
          animations.push(
            this.animator.animate({
              node: n,
              duration: 1000,
              easing: linear,
              from,
              to,
            }),
          );
        });
        await Promise.all(animations);

        card.element().style.zIndex = '';
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
