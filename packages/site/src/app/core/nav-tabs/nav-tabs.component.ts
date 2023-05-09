import { ChangeDetectionStrategy, Component } from '@angular/core';

import { AnimationCurve } from '../../common/animation';

@Component({
  selector: 'lpj-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavTabsComponent {
  AnimationCurve = AnimationCurve;
  items = ['Tutorial', 'API'];
  itemActive = this.items[0];
}
