import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

import { CustomElementComponent } from '../shared/custom-element-component';
import { parseNumberStringInput } from '../shared/input';

@Component({
  templateUrl: './heading.component.html',
  styleUrls: ['./heading.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeadingComponent extends CustomElementComponent {
  static override readonly selector = 'md-heading';

  @Input() id?: string;

  // prettier-ignore
  @Input('level') set levelInput(v: string) { this.level = parseNumberStringInput(v) }
  level = 1;

  @HostBinding('class') get class(): string {
    return `level-${this.level}`;
  }
}
