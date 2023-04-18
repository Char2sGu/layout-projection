import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CustomElementComponent } from '../shared/custom-element-component';

@Component({
  templateUrl: './blockquote.component.html',
  styleUrls: ['./blockquote.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockquoteComponent extends CustomElementComponent {
  static override readonly selector = 'md-blockquote';
}
