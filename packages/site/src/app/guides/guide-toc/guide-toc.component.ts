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
  combineLatest,
  filter,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';

import { AnimationCurve } from '../../common/animation';
import { VisibilityObserver } from '../../core/visibility-observer.service';
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
  private visibilityObserver = inject(VisibilityObserver);

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
      map((headings) =>
        headings.map((heading) =>
          this.visibilityObserver
            .observe(heading)
            .pipe(map((visible) => ({ id: heading.id, visible }))),
        ),
      ),
      switchMap((observables) => combineLatest(observables)),
      map((entries) => entries.find(({ visible }) => visible)?.id),
      filter(Boolean),
    );
  }
}

export interface GuideTocItem {
  id: string;
  title: string;
  level: number;
}
