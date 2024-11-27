import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutNode, LayoutNodeAnimator } from '@layout-projection/angular';

@Component({
  selector: 'lpj-adapter-nested-elements',
  standalone: true,
  imports: [LayoutNode, LayoutNodeAnimator],
  templateUrl: './adapter-nested-elements.component.html',
  styleUrl: './adapter-nested-elements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'onClick()' },
})
export class AdapterNestedElementsComponent {
  flag = false;

  onClick(): void {
    this.flag = !this.flag;
  }
}
