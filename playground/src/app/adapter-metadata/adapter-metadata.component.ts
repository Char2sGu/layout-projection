import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  LayoutNode,
  LayoutNodeAnimator,
  SkipPosition,
  SkipSize,
} from '@layout-projection/angular';

@Component({
  selector: 'lpj-adapter-metadata',
  standalone: true,
  imports: [LayoutNode, LayoutNodeAnimator, SkipPosition, SkipSize],
  templateUrl: './adapter-metadata.component.html',
  styleUrl: './adapter-metadata.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(click)': 'onClick()' },
})
export class AdapterMetadataComponent {
  flag = false;

  onClick(): void {
    this.flag = !this.flag;
  }
}
