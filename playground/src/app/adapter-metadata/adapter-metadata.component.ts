import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  LayoutAnimator,
  LayoutNode,
  SkipPositionLayoutNodeMetadata,
  SkipSizeLayoutNodeMetadata,
} from '@layout-projection/angular';
import { provideLayoutProjectionBuiltinSetup } from '@layout-projection/angular/setup';

@Component({
  selector: 'lpj-adapter-metadata',
  standalone: true,
  imports: [
    LayoutNode,
    LayoutAnimator,
    SkipPositionLayoutNodeMetadata,
    SkipSizeLayoutNodeMetadata,
  ],
  providers: [provideLayoutProjectionBuiltinSetup()],
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
