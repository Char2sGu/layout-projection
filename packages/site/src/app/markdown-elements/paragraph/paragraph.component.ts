import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { NgElementComponent } from '../shared/ng-element';

@Component({
  selector: 'lpj-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParagraphComponent extends NgElementComponent {
  static override readonly selector = 'md-paragraph';

  @HostBinding() class = 'tui-text_body-m';
}
