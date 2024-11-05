import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgElementComponent } from '../shared/ng-element';

@Component({
  templateUrl: './blockquote.component.html',
  styleUrls: ['./blockquote.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BlockquoteComponent extends NgElementComponent {
  static override readonly selector = 'md-blockquote';
}
