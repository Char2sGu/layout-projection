import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { AnimationCurve } from '../../common/animation';

@Component({
  selector: 'lpj-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavTabsComponent {
  AnimationCurve = AnimationCurve;
  @Input({ required: true }) items: string[] = [];
  @Input({ required: true }) itemActive?: string;
  @Output() itemActiveChange = new EventEmitter<string>();
}
