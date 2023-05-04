import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { combineLatest, filter, map, Observable } from 'rxjs';

import { AnimationCurve } from '../../common/animation';
import { MarkdownCurrentHeadingTrackerDirective } from '../../shared/markdown-current-heading-tracker.directive';

@Component({
  selector: 'lpj-guide-toc',
  templateUrl: './guide-toc.component.html',
  styleUrls: ['./guide-toc.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideTocComponent {
  AnimationCurve = AnimationCurve;

  items$: Observable<GuideTocItem[]>;
  itemActive$: Observable<GuideTocItem>;

  constructor(
    headingTracker: MarkdownCurrentHeadingTrackerDirective,
    @Inject(DOCUMENT) document: Document,
  ) {
    this.items$ = headingTracker.headings$.pipe(
      map((headings) =>
        headings.map((heading) => {
          if (!heading.id) throw new Error();
          const ele = document.getElementById(heading.id);
          if (!ele) throw new Error();
          return {
            id: heading.id,
            level: +heading.level,
            title: ele.innerText,
          };
        }),
      ),
    );
    this.itemActive$ = combineLatest([
      this.items$,
      headingTracker.currentId$,
    ]).pipe(
      map(([items, currentId]) => items.find((item) => item.id === currentId)),
      filter(Boolean),
    );
  }
}

export interface GuideTocItem {
  id: string;
  title: string;
  level: number;
}
