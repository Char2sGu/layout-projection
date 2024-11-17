import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutAnimator, LayoutNode } from '@layout-projection/angular';

@Component({
  selector: 'lpj-adapter-single-element',
  standalone: true,
  imports: [LayoutNode, LayoutAnimator],
  templateUrl: './adapter-single-element.component.html',
  styleUrl: './adapter-single-element.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'onClick()' },
})
export class AdapterSingleElementComponent {
  flag = false;

  onClick(): void {
    this.flag = !this.flag;
  }
}
