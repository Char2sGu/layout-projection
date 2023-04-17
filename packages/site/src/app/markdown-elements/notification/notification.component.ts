import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CustomElementComponent } from '../shared/custom-element-component';

@Component({
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent extends CustomElementComponent {
  static override readonly selector = 'md-notification';
}
