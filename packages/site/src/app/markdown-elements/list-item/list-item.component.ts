import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

import { CustomElementComponent } from '../shared/custom-element';

@Component({
  selector: 'lpj-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListItemComponent extends CustomElementComponent {
  static override readonly selector = 'md-list-item';

  @HostBinding() class = 'tui-list__item';
}
