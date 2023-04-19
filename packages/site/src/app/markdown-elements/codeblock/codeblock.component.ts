import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CustomElementComponent } from '../shared/custom-element';

@Component({
  templateUrl: './codeblock.component.html',
  styleUrls: ['./codeblock.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeblockComponent extends CustomElementComponent {
  static override readonly selector = 'md-codeblock';

  @Input() filename?: string;
  @Input() content?: string;
}
