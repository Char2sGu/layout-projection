import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LayoutNode,LayoutNodeAnimator } from '@layout-projection/angular';

import { AnimationCurve } from '../../common/animation';

@Component({
  selector: 'lpj-nav-tabs',
  templateUrl: './nav-tabs.component.html',
  styleUrls: ['./nav-tabs.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [
    {
      directive: LayoutNode,
    },
    {
      directive: LayoutNodeAnimator,
      inputs: ['duration', 'easing'],
    },
  ],
})
export class NavTabsComponent {
  AnimationCurve = AnimationCurve;
  @Input({ required: true }) items: string[] = [];
  @Input({ required: true }) itemActive?: string;
  @Output() itemActiveChange = new EventEmitter<string>();
}
