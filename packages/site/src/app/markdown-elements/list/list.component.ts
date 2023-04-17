import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

import { CustomElementComponent } from '../shared/custom-element-component';

@Component({
  selector: 'lpj-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends CustomElementComponent {
  static override readonly selector = 'md-list';

  @Input('ordered') set orderInput(v: string) {
    this.ordered = parseBooleanStringInput(v);
  }
  ordered = false;

  @HostBinding('class') get class(): string {
    return this.ordered ? 'tui-list tui-list_ordered' : 'tui-list';
  }
}

function parseBooleanStringInput(value: string): boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error(`Invalid boolean string input: ${value}`);
}
