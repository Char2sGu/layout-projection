import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CustomElementComponent } from '../shared/custom-element';

@Component({
  selector: 'lpj-codespan',
  templateUrl: './codespan.component.html',
  styleUrls: ['./codespan.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodespanComponent extends CustomElementComponent {
  static override readonly selector = 'md-codespan';
}
