import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgElement } from '@angular/elements';
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
  skip,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';

import { AnimationCurve } from '../../common/animation';
import { HeadingComponent } from '../../markdown-elements/heading/heading.component';
import {
  CustomElementComponent,
  CustomElementComponentType,
} from '../../markdown-elements/shared/custom-element';
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
  articleElement$ = this.article$.pipe(
    filter(Boolean),
    switchMap((article) => article.ready.pipe(map(() => article.element))),
    shareReplay(1),
  );

  items$: Observable<GuideTocItem[]>;
  activeId$: Observable<string> = of('a');

  @ViewChild(LayoutAnimationEntry) private entry?: LayoutAnimationEntry;

  constructor() {
    this.articleElement$
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.entry?.snapshots.clear());

    const headings$ = this.articleElement$.pipe(
      map((element) => queryCustomElement(element, HeadingComponent)),
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

    const headingVisibilities$ = headings$.pipe(
      switchMap((headings) => {
        const entries$ = new Subject<IntersectionObserverEntry[]>();
        const observer = new IntersectionObserver((v) => entries$.next(v));
        headings.forEach((heading) => observer.observe(heading));
        return entries$.pipe(
          takeUntil(headings$.pipe(skip(1))),
          finalize(() => observer.disconnect()),
          scan((visibilities: Record<string, boolean>, entries) => {
            for (const entry of entries)
              visibilities[entry.target.id] = entry.isIntersecting;
            return visibilities;
          }, {}),
        );
      }),
    );

    this.activeId$ = headingVisibilities$.pipe(
      map((visibilities) => Object.entries(visibilities).find(([, v]) => v)),
      filter(Boolean),
      map(([id]) => id),
    );
  }
}

export interface GuideTocItem {
  id: string;
  title: string;
  level: number;
}

// TODO: move
function queryCustomElement<Component extends CustomElementComponent>(
  from: HTMLElement,
  type: CustomElementComponentType<Component>,
): (NgElement & Component)[] {
  const elements = from.querySelectorAll<NgElement & Component>(type.selector);
  return [...elements];
}
