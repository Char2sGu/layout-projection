import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AnimationCurve } from '../../common/animation';
import { GuideTocItem } from '../shared/guide.models';

@Component({
  selector: 'lpj-guide-toc',
  templateUrl: './guide-toc.component.html',
  styleUrls: ['./guide-toc.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideTocComponent {
  AnimationCurve = AnimationCurve;

  @Input({ required: true }) items: GuideTocItem[] = [];
  @Input({ required: true }) itemActive?: GuideTocItem;
}
