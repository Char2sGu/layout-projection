import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutAnimationEntry } from '@layout-projection/core';
import {
  BehaviorSubject,
  filter,
  finalize,
  map,
  Observable,
  of,
  scan,
  shareReplay,
  Subject,
  switchMap,
} from 'rxjs';

import { AnimationCurve } from '../../common/animation';
import { HeadingComponent } from '../../markdown-elements/heading/heading.component';
import { NgElementQuerier } from '../../markdown-elements/shared/ng-element';
import { MarkdownArticleComponent } from '../../shared/markdown-article/markdown-article.component';

@Component({
  selector: 'lpj-guide-toc',
  templateUrl: './guide-toc.component.html',
  styleUrls: ['./guide-toc.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideTocComponent {
  AnimationCurve = AnimationCurve;

  // prettier-ignore
  @Input({ alias: 'article', required: true })
  set articleInput(v: MarkdownArticleComponent) { this.article$.next(v) }
  article$ = new BehaviorSubject<MarkdownArticleComponent | null>(null);

  items$: Observable<GuideTocItem[]>;
  activeId$: Observable<string> = of('a');

  @ViewChild(LayoutAnimationEntry) private entry?: LayoutAnimationEntry;
  private querier = inject(NgElementQuerier);

  constructor() {
    const article$ = this.article$.pipe(filter(Boolean));

    article$
      .pipe(
        switchMap((article) => article.render),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.entry?.snapshots.clear());

    const headings$ = article$.pipe(
      switchMap((article) => article.render.pipe(map(() => article.element))),
      map((element) => this.querier.queryAll(element, HeadingComponent)),
      shareReplay(1),
    );

    this.items$ = headings$.pipe(
      map((headings) =>
        headings.map((heading) => ({
          id: heading.id,
          title: heading.innerText,
          level: +heading.level,
        })),
      ),
      shareReplay(1),
    );

    this.activeId$ = headings$.pipe(
      switchMap((headings) => this.watchHeadingElementVisibilities(headings)),
      map((visibilities) => Object.entries(visibilities).find(([, v]) => v)),
      filter(Boolean),
      map(([id]) => id),
    );
  }

  watchHeadingElementVisibilities(
    headings: HTMLElement[],
  ): Observable<Record<string, boolean>> {
    const entries$ = new Subject<IntersectionObserverEntry[]>();
    const observer = new IntersectionObserver((v) => entries$.next(v));
    headings.forEach((heading) => observer.observe(heading));
    return entries$.pipe(
      finalize(() => observer.disconnect()),
      scan((visibilities: Record<string, boolean>, entries) => {
        for (const entry of entries)
          visibilities[entry.target.id] = entry.isIntersecting;
        return visibilities;
      }, {}),
    );
  }
}

export interface GuideTocItem {
  id: string;
  title: string;
  level: number;
}
