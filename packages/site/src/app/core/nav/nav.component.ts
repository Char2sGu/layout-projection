import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { NAV_CONTENT } from '../nav.models';

@Component({
  selector: 'lpj-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
  private content = inject(NAV_CONTENT);

  tabs = Object.keys(this.content);
  tabActive$ = new BehaviorSubject(this.tabs[0]);

  items$ = this.tabActive$.pipe(map((tab) => this.content[tab]));
}
