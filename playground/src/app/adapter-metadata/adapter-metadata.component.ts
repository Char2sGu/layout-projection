import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  LayoutAnimator,
  LayoutNode,
  SkipPosition,
  SkipSize,
} from '@layout-projection/angular';

@Component({
  selector: 'lpj-adapter-metadata',
  standalone: true,
  imports: [LayoutNode, LayoutAnimator, SkipPosition, SkipSize],
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
