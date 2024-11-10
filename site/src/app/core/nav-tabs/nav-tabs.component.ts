import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LayoutAnimator, LayoutNode } from '@layout-projection/angular';

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
      directive: LayoutAnimator,
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
