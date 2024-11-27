import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutNode, LayoutNodeAnimator } from '@layout-projection/angular';

@Component({
  selector: 'lpj-adapter-shared-elements',
  standalone: true,
  imports: [LayoutNode, LayoutNodeAnimator],
  templateUrl: './adapter-shared-elements.component.html',
  styleUrl: './adapter-shared-elements.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdapterSharedElementsComponent {
  active = 1;
  items = [1, 2];
}
