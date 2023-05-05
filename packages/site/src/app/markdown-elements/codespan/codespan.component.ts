import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgElementComponent } from '../shared/ng-element';

@Component({
  selector: 'lpj-codespan',
  templateUrl: './codespan.component.html',
  styleUrls: ['./codespan.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodespanComponent extends NgElementComponent {
  static override readonly selector = 'md-codespan';
}
