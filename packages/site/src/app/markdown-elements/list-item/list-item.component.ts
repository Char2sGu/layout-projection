import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { NgElementComponent } from '../shared/ng-element';

@Component({
  selector: 'lpj-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent extends NgElementComponent {
  static override readonly selector = 'md-list-item';

  @HostBinding() class = 'tui-list__item';
}
