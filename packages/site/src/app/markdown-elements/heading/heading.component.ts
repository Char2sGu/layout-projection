import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

import { CustomElementComponent } from '../shared/custom-element-component';

@Component({
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingComponent extends CustomElementComponent {
  static override readonly selector = 'md-heading';

  @Input() level = 1;

  @HostBinding() get className(): string {
    return `tui-text_h${this.level}`;
  }
}
