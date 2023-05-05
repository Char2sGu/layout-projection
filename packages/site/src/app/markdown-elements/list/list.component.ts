import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';

import { parseBooleanStringInput } from '../shared/input';
import { NgElementComponent } from '../shared/ng-element';

@Component({
  selector: 'lpj-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent extends NgElementComponent {
  static override readonly selector = 'md-list';

  @HostBinding() get class(): string {
    const ordered = parseBooleanStringInput(this.ordered);
    return ordered ? 'tui-list tui-list_ordered' : 'tui-list tui-list_linear';
  }

  @Input() ordered = '';
}
