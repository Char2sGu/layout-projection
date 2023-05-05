import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AnimationCurve } from '../../common/animation';

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

export interface GuideTocItem {
  id: string;
  title: string;
  level: number;
}
