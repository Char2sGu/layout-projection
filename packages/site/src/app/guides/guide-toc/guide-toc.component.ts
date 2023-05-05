import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutAnimationEntry } from '@layout-projection/core';
import { combineLatest, filter, map, Observable } from 'rxjs';

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

  @ViewChild(LayoutAnimationEntry) private entry?: LayoutAnimationEntry;

  constructor(
    headingTracker: MarkdownHeadingTrackingDirective,
    @Inject(DOCUMENT) document: Document,
  ) {
    this.items$ = headingTracker.headings$.pipe(
      map((headings) =>
        headings.flatMap((heading) => {
          if (!heading.id) return [];
          const ele = document.getElementById(heading.id);
          if (!ele) return [];
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

    this.items$.pipe(takeUntilDestroyed()).subscribe(() => {
      this.entry?.snapshots.clear();
    });
  }
}

export interface GuideTocItem {
  id: string;
  title: string;
  level: number;
}
