import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { combineLatest, filter, map, Observable, retry } from 'rxjs';

import { AnimationCurve } from '../../common/animation';
import { MarkdownHeadingTrackingDirective } from '../../shared/markdown-heading-tracking.directive';

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
    headingTracker: MarkdownHeadingTrackingDirective,
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
      retry(3),
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
