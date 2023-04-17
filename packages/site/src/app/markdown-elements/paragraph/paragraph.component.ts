import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { CustomElementComponent } from '../shared/custom-element-component';

@Component({
  selector: 'lpj-paragraph',
  templateUrl: './paragraph.component.html',
  styleUrls: ['./paragraph.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParagraphComponent extends CustomElementComponent {
  static override readonly selector = 'md-paragraph';

  @HostBinding('class') class = 'tui-text_body-m';
}
