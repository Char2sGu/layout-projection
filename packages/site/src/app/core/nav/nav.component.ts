import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { NAV_CONTENT } from '../nav.models';

@Component({
  selector: 'lpj-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
  tabs = ['Tutorial', 'API'];
  tabActive = this.tabs[0];
  content = inject(NAV_CONTENT);
}
